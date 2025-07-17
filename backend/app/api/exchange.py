from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
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

@router.get("/rates/history")
async def get_exchange_rate_history(
    from_currency: str = Query(..., description="기준 통화"),
    to_currency: str = Query(..., description="대상 통화"),
    days: int = Query(7, description="조회할 일수", ge=1, le=30)
):
    """환율 이력을 조회합니다. (MVP에서는 현재 환율만 반환)"""
    try:
        current_rate = await exchange_service.get_conversion_rate(
            from_currency.upper(), 
            to_currency.upper()
        )
        
        return {
            "from_currency": from_currency.upper(),
            "to_currency": to_currency.upper(),
            "current_rate": current_rate,
            "history": [{"date": "today", "rate": current_rate}],
            "message": "MVP 버전에서는 현재 환율만 제공됩니다."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"환율 이력 조회 실패: {str(e)}")

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