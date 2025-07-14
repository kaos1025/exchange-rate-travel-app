from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserProfile(BaseModel):
    id: str
    display_name: Optional[str] = None
    timezone: str = 'Asia/Seoul'
    preferred_currency: str = 'KRW'
    notification_email: bool = True
    notification_push: bool = False
    created_at: datetime
    updated_at: datetime

class UserProfileCreate(BaseModel):
    display_name: Optional[str] = None
    timezone: str = 'Asia/Seoul'
    preferred_currency: str = 'KRW'
    notification_email: bool = True
    notification_push: bool = False

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    timezone: Optional[str] = None
    preferred_currency: Optional[str] = None
    notification_email: Optional[bool] = None
    notification_push: Optional[bool] = None