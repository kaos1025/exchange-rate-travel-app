from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict
from datetime import date, datetime
from pydantic import BaseModel
from ..services.exchange_rate import ExchangeRateService
from ..services.daily_exchange_rate_service import DailyExchangeRateService
from ..services.monitoring_service import get_monitoring_service

router = APIRouter(prefix="/exchange", tags=["exchange"])
exchange_service = ExchangeRateService()
daily_exchange_service = DailyExchangeRateService()

class ConversionRequest(BaseModel):
    amount: float
    from_currency: str
    to_currency: str

class ConversionResponse(BaseModel):
    amount: float
    from_currency: str
    to_currency: str
    rate: float
    converted_amount: float
    timestamp: str

class RatesResponse(BaseModel):
    base: str
    rates: dict
    timestamp: str

@router.get("/rates", response_model=RatesResponse)
async def get_current_rates(
    base: str = Query("USD", description="기준 통화 코드"),
    currencies: Optional[str] = Query(None, description="조회할 통화 목록 (쉼표로 구분)")
):
    """현재 환율 정보를 조회합니다."""
    try:
        if currencies:
            target_currencies = [c.strip().upper() for c in currencies.split(",")]
            rates_data = await exchange_service.get_multiple_rates(base.upper(), target_currencies)
        else:
            rates_data = await exchange_service.get_current_rates(base.upper())
            rates_data = {
                "base": rates_data.get("base", base.upper()),
                "rates": rates_data.get("rates", {}),
                "timestamp": rates_data.get("date", "")
            }
        
        return rates_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"환율 정보 조회 실패: {str(e)}")


@router.post("/convert", response_model=ConversionResponse)
async def convert_currency(request: ConversionRequest):
    """통화 변환을 수행합니다."""
    try:
        result = await exchange_service.convert_amount(
            request.amount,
            request.from_currency.upper(),
            request.to_currency.upper()
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"통화 변환 실패: {str(e)}")

@router.get("/currencies")
async def get_supported_currencies():
    """지원하는 통화 목록을 조회합니다."""
    try:
        currencies = await exchange_service.get_supported_currencies()
        return {
            "currencies": sorted(currencies),
            "count": len(currencies)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"통화 목록 조회 실패: {str(e)}")

@router.get("/rates/popular")
async def get_popular_rates():
    """인기 있는 환율 쌍을 조회합니다."""
    try:
        popular_pairs = {
            "USD": ["KRW", "EUR", "JPY", "GBP", "CNY"],
            "KRW": ["USD", "JPY", "EUR", "GBP"],
            "EUR": ["USD", "KRW", "JPY", "GBP"],
            "JPY": ["KRW", "USD", "EUR"]
        }
        
        result = {}
        for base, targets in popular_pairs.items():
            rates_data = await exchange_service.get_multiple_rates(base, targets)
            result[base] = rates_data
        
        return {
            "popular_rates": result,
            "timestamp": rates_data.get("timestamp", "")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"인기 환율 조회 실패: {str(e)}")

@router.get("/rates/daily")
async def get_daily_rates(target_date: Optional[str] = Query(None, description="조회할 날짜 (YYYY-MM-DD)")):
    """일일 환율 데이터를 조회합니다."""
    try:
        if target_date:
            query_date = date.fromisoformat(target_date)
        else:
            query_date = None
        
        daily_rates = await daily_exchange_service.get_daily_rates(query_date)
        
        return {
            "date": query_date.isoformat() if query_date else date.today().isoformat(),
            "rates": [
                {
                    "currency_pair": f"{rate.currency_from}/{rate.currency_to}",
                    "rate": float(rate.rate),
                    "previous_rate": float(rate.previous_rate) if rate.previous_rate else None,
                    "change_amount": float(rate.change_amount) if rate.change_amount else 0,
                    "change_percentage": float(rate.change_percentage) if rate.change_percentage else 0
                }
                for rate in daily_rates
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"일일 환율 조회 실패: {str(e)}")

@router.get("/rates/latest")
async def get_latest_rates_with_changes():
    """최신 환율 데이터와 변동률을 조회합니다."""
    try:
        latest_rates, is_realtime = await daily_exchange_service.get_latest_rates_with_changes()
        
        return {
            "rates": [
                {
                    "currency_pair": f"{rate.currency_from}/{rate.currency_to}",
                    "rate": float(rate.rate),
                    "previous_rate": float(rate.previous_rate) if rate.previous_rate else None,
                    "change_amount": float(rate.change_amount) if rate.change_amount else 0,
                    "change_percentage": float(rate.change_percentage) if rate.change_percentage else 0,
                    "date": rate.date.isoformat()
                }
                for rate in latest_rates
            ],
            "is_realtime": is_realtime,
            "data_source": "realtime" if is_realtime else "cached",
            "message": "실시간 환율 데이터" if is_realtime else "실시간 API 실패로 저장된 데이터 사용"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"최신 환율 조회 실패: {str(e)}")

@router.get("/rates/stored", response_model=Dict)
async def get_stored_rates():
    """데이터베이스에 저장된 최신 환율 데이터만 조회 (실시간 API 호출 없음)"""
    try:
        rates = await daily_exchange_service.get_latest_stored_rates_only()
        
        if not rates:
            return {
                "rates": [],
                "is_realtime": False,
                "data_source": "none",
                "message": "저장된 환율 데이터가 없습니다"
            }
        
        # 응답 형식을 기존 latest 엔드포인트와 동일하게 맞춤
        formatted_rates = []
        for rate in rates:
            formatted_rates.append({
                "currency_pair": f"{rate.currency_from}/{rate.currency_to}",
                "rate": float(rate.rate),
                "previous_rate": float(rate.previous_rate) if rate.previous_rate else None,
                "change_amount": float(rate.change_amount) if rate.change_amount else 0.0,
                "change_percentage": float(rate.change_percentage) if rate.change_percentage else 0.0,
                "date": str(rate.date)
            })
        
        return {
            "rates": formatted_rates,
            "is_realtime": False,
            "data_source": "stored",
            "message": f"저장된 환율 데이터 ({rates[0].date})"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"저장된 환율 조회 실패: {str(e)}")

@router.get("/rates/history/{from_currency}/{to_currency}", response_model=Dict)
async def get_currency_pair_history(
    from_currency: str,
    to_currency: str,
    days: int = Query(30, ge=1, le=365, description="조회할 일수 (1-365)")
):
    """특정 통화 쌍의 환율 히스토리 조회"""
    try:
        # 통화 쌍 변수 사용
        currency_pair = f"{from_currency}/{to_currency}"
        
        # 최근 N일간의 데이터 조회
        from datetime import date, timedelta
        end_date = date.today()
        start_date = end_date - timedelta(days=days-1)
        
        try:
            result = daily_exchange_service.supabase.table("daily_exchange_rates").select(
                "date, rate, change_amount, change_percentage"
            ).eq("currency_from", from_currency).eq("currency_to", to_currency).gte(
                "date", start_date.isoformat()
            ).lte("date", end_date.isoformat()).order("date", desc=False).execute()
            
            if not result.data:
                result = None
        except Exception as db_error:
            # 데이터베이스 연결 실패 시 테스트 데이터 생성
            result = None
        
        if not result or not result.data:
            # 데이터가 없으면 빈 배열 반환
            return {
                "currency_pair": currency_pair,
                "period_days": days,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "data": [],
                "data_source": "database",
                "message": "요청한 기간에 대한 환율 히스토리 데이터가 없습니다"
            }
        
        return {
            "currency_pair": currency_pair,
            "period_days": days,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "data": result.data,
            "data_source": "database",
            "message": f"{len(result.data)}개의 히스토리 데이터를 조회했습니다"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"환율 히스토리 조회 실패: {str(e)}")

@router.get("/convert", response_model=Dict)
async def convert_currency(
    from_currency: str = Query(..., description="변환할 통화 (예: USD)"),
    to_currency: str = Query(..., description="변환 대상 통화 (예: KRW)"),
    amount: float = Query(..., gt=0, description="변환할 금액")
):
    """실시간 환율을 사용한 통화 변환"""
    try:
        # 최신 환율 데이터 조회
        rates, is_realtime = await daily_exchange_service.get_latest_rates_with_changes()
        
        if not rates:
            raise HTTPException(status_code=404, detail="환율 데이터를 찾을 수 없습니다")
        
        # 환율 데이터를 딕셔너리로 변환
        rate_dict = {}
        for rate in rates:
            key = f"{rate.currency_from}-{rate.currency_to}"
            rate_dict[key] = float(rate.rate)
        
        # 변환 로직
        converted_amount = None
        used_rate = None
        
        if from_currency == to_currency:
            # 같은 통화면 그대로 반환
            converted_amount = amount
            used_rate = 1.0
        else:
            # 직접 환율 찾기
            direct_key = f"{from_currency}-{to_currency}"
            if direct_key in rate_dict:
                used_rate = rate_dict[direct_key]
                converted_amount = amount * used_rate
            else:
                # 역방향 환율 찾기
                reverse_key = f"{to_currency}-{from_currency}"
                if reverse_key in rate_dict:
                    used_rate = 1.0 / rate_dict[reverse_key]
                    converted_amount = amount * used_rate
                else:
                    # KRW를 중간 통화로 사용
                    from_to_krw = f"{from_currency}-KRW"
                    krw_to_to = f"KRW-{to_currency}"
                    
                    if from_to_krw in rate_dict and krw_to_to in rate_dict:
                        krw_amount = amount * rate_dict[from_to_krw]
                        converted_amount = krw_amount * rate_dict[krw_to_to]
                        used_rate = rate_dict[from_to_krw] * rate_dict[krw_to_to]
                    else:
                        raise HTTPException(
                            status_code=400, 
                            detail=f"{from_currency}에서 {to_currency}로의 환율을 찾을 수 없습니다"
                        )
        
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate": used_rate,
            "converted_amount": round(converted_amount, 6),
            "is_realtime": is_realtime,
            "timestamp": datetime.now().isoformat(),
            "data_source": "realtime" if is_realtime else "stored"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"환율 변환 실패: {str(e)}")

@router.post("/rates/store")
async def store_daily_rates():
    """수동으로 일일 환율을 저장합니다. (테스트용)"""
    try:
        start_time = datetime.now()
        success = await daily_exchange_service.store_daily_rates()
        end_time = datetime.now()
        
        return {
            "success": success,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "duration_seconds": (end_time - start_time).total_seconds()
        }
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }