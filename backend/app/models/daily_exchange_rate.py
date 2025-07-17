from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class DailyExchangeRateBase(BaseModel):
    currency_from: str
    currency_to: str
    rate: Decimal
    previous_rate: Optional[Decimal] = None
    change_amount: Optional[Decimal] = None
    change_percentage: Optional[Decimal] = None
    date: date


class DailyExchangeRateCreate(DailyExchangeRateBase):
    pass


class DailyExchangeRateUpdate(BaseModel):
    rate: Optional[Decimal] = None
    previous_rate: Optional[Decimal] = None
    change_amount: Optional[Decimal] = None
    change_percentage: Optional[Decimal] = None


class DailyExchangeRate(DailyExchangeRateBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class DailyExchangeRateWithPrevious(BaseModel):
    current: DailyExchangeRate
    previous: Optional[DailyExchangeRate] = None
    change_amount: Decimal
    change_percentage: Decimal