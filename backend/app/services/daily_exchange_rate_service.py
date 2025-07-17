import asyncio
from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import List, Optional
import logging

from ..database import get_supabase
from ..models.daily_exchange_rate import DailyExchangeRate, DailyExchangeRateCreate
from .exchange_rate import ExchangeRateService

logger = logging.getLogger(__name__)


class DailyExchangeRateService:
    def __init__(self):
        self.supabase = get_supabase()
        self.exchange_service = ExchangeRateService()
        
    async def store_daily_rates(self, target_date: Optional[date] = None) -> bool:
        """매일 환율을 조회하고 DB에 저장"""
        try:
            if target_date is None:
                target_date = date.today()
            
            # 이미 해당 날짜의 데이터가 있는지 확인
            existing_data = self.supabase.table("daily_exchange_rates").select("*").eq("date", target_date.isoformat()).execute()
            
            if existing_data.data:
                logger.info(f"Daily rates for {target_date} already exist")
                return True
            
            # 현재 환율 조회
            current_rates_data = await self.exchange_service.get_current_rates('USD')
            current_rates = current_rates_data.get('rates', {})
            
            if not current_rates:
                logger.error("Failed to fetch current exchange rates")
                return False
            
            # 전일 데이터 조회
            previous_date = target_date - timedelta(days=1)
            
            stored_rates = []
            target_currencies = ['USD', 'JPY', 'EUR', 'CNY']
            
            for currency_from in target_currencies:
                if currency_from not in current_rates:
                    continue
                    
                # USD 기준 환율을 KRW 기준으로 변환
                if currency_from == 'USD':
                    rate = current_rates.get('KRW', 0)
                else:
                    usd_to_krw = current_rates.get('KRW', 0)
                    usd_to_currency = current_rates.get(currency_from, 0)
                    if usd_to_currency != 0:
                        rate = usd_to_krw / usd_to_currency
                    else:
                        continue
                    
                # 전일 환율 조회
                previous_rate_data = self.supabase.table("daily_exchange_rates").select("rate").eq("currency_from", currency_from).eq("currency_to", "KRW").eq("date", previous_date.isoformat()).execute()
                
                previous_rate = None
                change_amount = None
                change_percentage = None
                
                if previous_rate_data.data:
                    previous_rate = Decimal(str(previous_rate_data.data[0]['rate']))
                    change_amount = Decimal(str(rate)) - previous_rate
                    if previous_rate != 0:
                        change_percentage = (change_amount / previous_rate) * 100
                
                # 직접 딕셔너리 구성으로 JSON 직렬화 문제 해결
                rate_dict = {
                    'currency_from': currency_from,
                    'currency_to': "KRW",
                    'rate': float(rate),
                    'previous_rate': float(previous_rate) if previous_rate is not None else None,
                    'change_amount': float(change_amount) if change_amount is not None else None,
                    'change_percentage': float(change_percentage) if change_percentage is not None else None,
                    'date': target_date.isoformat()  # date 타입을 ISO 문자열로 변환
                }
                
                stored_rates.append(rate_dict)
            
            # DB에 저장
            result = self.supabase.table("daily_exchange_rates").insert(stored_rates).execute()
            
            if result.data:
                logger.info(f"Successfully stored {len(stored_rates)} daily exchange rates for {target_date}")
                return True
            else:
                logger.error(f"Failed to store daily exchange rates: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Error storing daily exchange rates: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise e  # 예외를 다시 발생시켜서 API 레벨에서 캐치할 수 있도록
    
    async def get_daily_rates(self, target_date: Optional[date] = None) -> List[DailyExchangeRate]:
        """특정 날짜의 일일 환율 데이터 조회"""
        try:
            if target_date is None:
                target_date = date.today()
            
            result = self.supabase.table("daily_exchange_rates").select("*").eq("date", target_date.isoformat()).execute()
            
            if result.data:
                return [DailyExchangeRate(**item) for item in result.data]
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error fetching daily exchange rates: {e}")
            return []
    
    async def get_latest_rates_with_changes(self) -> tuple[List[DailyExchangeRate], bool]:
        """최신 환율 데이터 및 변동률 조회 (실시간 API 실패 시 저장된 데이터로 폴백)"""
        try:
            # 먼저 오늘 날짜로 실시간 데이터 저장 시도
            today = date.today()
            store_success = await self.store_daily_rates(today)
            
            # 저장 성공 여부와 관계없이 최신 데이터 조회
            latest_date_result = self.supabase.table("daily_exchange_rates").select("date").order("date", desc=True).limit(1).execute()
            
            if not latest_date_result.data:
                # 저장된 데이터가 전혀 없으면 빈 리스트 반환
                return [], store_success
            
            latest_date = latest_date_result.data[0]['date']
            
            # 최신 날짜의 모든 환율 데이터 조회
            result = self.supabase.table("daily_exchange_rates").select("*").eq("date", latest_date).execute()
            
            if result.data:
                rates = [DailyExchangeRate(**item) for item in result.data]
                return rates, store_success
            else:
                return [], store_success
                
        except Exception as e:
            logger.error(f"Error fetching latest exchange rates with changes: {e}")
            # 예외 발생 시에도 저장된 데이터라도 조회 시도
            try:
                latest_date_result = self.supabase.table("daily_exchange_rates").select("date").order("date", desc=True).limit(1).execute()
                if latest_date_result.data:
                    latest_date = latest_date_result.data[0]['date']
                    result = self.supabase.table("daily_exchange_rates").select("*").eq("date", latest_date).execute()
                    if result.data:
                        rates = [DailyExchangeRate(**item) for item in result.data]
                        return rates, False  # 실시간 업데이트 실패
                return [], False
            except Exception as fallback_error:
                logger.error(f"Fallback data fetch also failed: {fallback_error}")
                return [], False

    async def get_latest_stored_rates_only(self) -> List[DailyExchangeRate]:
        """실시간 API 호출 없이 데이터베이스에서만 최신 환율 데이터 조회"""
        try:
            # 최신 날짜 조회
            latest_date_result = self.supabase.table("daily_exchange_rates").select("date").order("date", desc=True).limit(1).execute()
            
            if not latest_date_result.data:
                # 데이터가 없으면 임시 테스트 데이터 삽입
                logger.info("No data found, inserting test data")
                await self._insert_test_data()
                # 다시 조회
                latest_date_result = self.supabase.table("daily_exchange_rates").select("date").order("date", desc=True).limit(1).execute()
                if not latest_date_result.data:
                    return []
            
            latest_date = latest_date_result.data[0]['date']
            
            # 최신 날짜의 모든 환율 데이터 조회
            result = self.supabase.table("daily_exchange_rates").select("*").eq("date", latest_date).execute()
            
            if result.data:
                rates = [DailyExchangeRate(**item) for item in result.data]
                return rates
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error fetching stored exchange rates: {e}")
            return []

    async def _insert_test_data(self):
        """테스트용 환율 데이터 삽입"""
        try:
            from datetime import date
            today = date.today()
            
            test_data = [
                {
                    "currency_from": "USD",
                    "currency_to": "KRW", 
                    "rate": 1387.70,
                    "previous_rate": 1385.20,
                    "change_amount": 2.50,
                    "change_percentage": 0.18,
                    "date": today.isoformat()
                },
                {
                    "currency_from": "JPY",
                    "currency_to": "KRW",
                    "rate": 9.36,
                    "previous_rate": 9.40,
                    "change_amount": -0.04,
                    "change_percentage": -0.43,
                    "date": today.isoformat()
                },
                {
                    "currency_from": "EUR", 
                    "currency_to": "KRW",
                    "rate": 1613.60,
                    "previous_rate": 1610.10,
                    "change_amount": 3.50,
                    "change_percentage": 0.22,
                    "date": today.isoformat()
                },
                {
                    "currency_from": "CNY",
                    "currency_to": "KRW",
                    "rate": 193.27,
                    "previous_rate": 194.50,
                    "change_amount": -1.23,
                    "change_percentage": -0.63,
                    "date": today.isoformat()
                }
            ]
            
            self.supabase.table("daily_exchange_rates").insert(test_data).execute()
            logger.info("Test data inserted successfully")
            
        except Exception as e:
            logger.error(f"Error inserting test data: {e}")