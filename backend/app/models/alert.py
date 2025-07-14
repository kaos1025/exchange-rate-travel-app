from pydantic import BaseModel
from typing import Literal
from datetime import datetime
from decimal import Decimal

class AlertSetting(BaseModel):
    id: str
    user_id: str
    currency_from: str
    currency_to: str
    target_rate: Decimal
    condition: Literal['above', 'below']
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class AlertSettingCreate(BaseModel):
    currency_from: str
    currency_to: str
    target_rate: Decimal
    condition: Literal['above', 'below']
    is_active: bool = True

class AlertSettingUpdate(BaseModel):
    target_rate: Decimal = None
    condition: Literal['above', 'below'] = None
    is_active: bool = None

class ExchangeRate(BaseModel):
    id: str
    currency_from: str
    currency_to: str
    rate: Decimal
    timestamp: datetime

class NotificationHistory(BaseModel):
    id: str
    user_id: str
    alert_setting_id: str
    triggered_rate: Decimal
    notification_type: str = 'email'
    sent_at: datetime