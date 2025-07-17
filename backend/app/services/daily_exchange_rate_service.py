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
            current_rates = await self.exchange_service.get_rates(['USD', 'JPY', 'EUR', 'CNY'], 'KRW')
            
            if not current_rates:
                logger.error("Failed to fetch current exchange rates")
                return False
            
            # 전일 데이터 조회
            previous_date = target_date - timedelta(days=1)
            
            stored_rates = []
            for currency_from, rate in current_rates.items():
                if currency_from == 'KRW':
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
                
                daily_rate = DailyExchangeRateCreate(
                    currency_from=currency_from,
                    currency_to="KRW",
                    rate=Decimal(str(rate)),
                    previous_rate=previous_rate,
                    change_amount=change_amount,
                    change_percentage=change_percentage,
                    date=target_date
                )
                
                stored_rates.append(daily_rate.model_dump())
            
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
            return False
    
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
    
    async def get_latest_rates_with_changes(self) -> List[DailyExchangeRate]:
        """최신 환율 데이터 및 변동률 조회"""
        try:
            # 가장 최근 날짜 조회
            latest_date_result = self.supabase.table("daily_exchange_rates").select("date").order("date", desc=True).limit(1).execute()
            
            if not latest_date_result.data:
                # 데이터가 없으면 오늘 날짜로 저장 시도
                await self.store_daily_rates()
                return await self.get_daily_rates()
            
            latest_date = latest_date_result.data[0]['date']
            
            # 최신 날짜의 모든 환율 데이터 조회
            result = self.supabase.table("daily_exchange_rates").select("*").eq("date", latest_date).execute()
            
            if result.data:
                return [DailyExchangeRate(**item) for item in result.data]
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error fetching latest exchange rates with changes: {e}")
            return []