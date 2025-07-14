import httpx
from datetime import datetime
from typing import Dict, Optional, List
from ..config import settings

class ExchangeRateService:
    def __init__(self):
        self.base_url = "https://api.exchangerate-api.com/v4"
        
    async def get_current_rates(self, base_currency: str = "USD") -> Dict:
        """주어진 기준 통화에 대한 모든 환율 정보를 가져옵니다."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/latest/{base_currency}")
            response.raise_for_status()
            return response.json()
    
    async def get_conversion_rate(self, from_currency: str, to_currency: str) -> float:
        """두 통화 간의 환율을 가져옵니다."""
        rates_data = await self.get_current_rates(from_currency)
        return rates_data["rates"].get(to_currency, 0.0)
    
    async def convert_amount(self, amount: float, from_currency: str, to_currency: str) -> Dict:
        """금액을 다른 통화로 변환합니다."""
        rate = await self.get_conversion_rate(from_currency, to_currency)
        converted_amount = amount * rate
        
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate": rate,
            "converted_amount": round(converted_amount, 2),
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_multiple_rates(self, base_currency: str, target_currencies: List[str]) -> Dict:
        """기준 통화에 대한 여러 통화의 환율을 가져옵니다."""
        rates_data = await self.get_current_rates(base_currency)
        filtered_rates = {}
        
        for currency in target_currencies:
            if currency in rates_data["rates"]:
                filtered_rates[currency] = rates_data["rates"][currency]
        
        return {
            "base": base_currency,
            "rates": filtered_rates,
            "timestamp": rates_data.get("date", datetime.now().strftime("%Y-%m-%d"))
        }
    
    async def get_supported_currencies(self) -> List[str]:
        """지원하는 모든 통화 목록을 가져옵니다."""
        rates_data = await self.get_current_rates("USD")
        return list(rates_data["rates"].keys())