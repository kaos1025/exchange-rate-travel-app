from typing import List, Optional, Dict
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
from ..models.alert import AlertSetting, AlertSettingCreate, AlertSettingUpdate, NotificationHistory
from .exchange_rate import ExchangeRateService

class AlertService:
    """알림 설정 관리 서비스"""
    
    def __init__(self):
        # MVP에서는 메모리 기반 저장소 사용 (실제로는 데이터베이스 사용)
        self.alert_settings: Dict[str, AlertSetting] = {}
        self.notification_history: List[NotificationHistory] = []
        self.exchange_service = ExchangeRateService()
    
    async def create_alert_setting(self, user_id: str, alert_data: AlertSettingCreate) -> AlertSetting:
        """새 알림 설정 생성"""
        alert_id = str(uuid.uuid4())
        now = datetime.now()
        
        alert_setting = AlertSetting(
            id=alert_id,
            user_id=user_id,
            currency_from=alert_data.currency_from.upper(),
            currency_to=alert_data.currency_to.upper(),
            target_rate=alert_data.target_rate,
            condition=alert_data.condition,
            is_active=alert_data.is_active,
            created_at=now,
            updated_at=now
        )
        
        self.alert_settings[alert_id] = alert_setting
        return alert_setting
    
    async def get_user_alerts(self, user_id: str) -> List[AlertSetting]:
        """사용자의 모든 알림 설정 조회"""
        return [
            alert for alert in self.alert_settings.values() 
            if alert.user_id == user_id
        ]
    
    async def get_alert_by_id(self, alert_id: str) -> Optional[AlertSetting]:
        """ID로 알림 설정 조회"""
        return self.alert_settings.get(alert_id)
    
    async def update_alert_setting(self, alert_id: str, update_data: AlertSettingUpdate) -> Optional[AlertSetting]:
        """알림 설정 수정"""
        alert = self.alert_settings.get(alert_id)
        if not alert:
            return None
        
        # 업데이트할 필드만 변경
        if update_data.target_rate is not None:
            alert.target_rate = update_data.target_rate
        if update_data.condition is not None:
            alert.condition = update_data.condition
        if update_data.is_active is not None:
            alert.is_active = update_data.is_active
        
        alert.updated_at = datetime.now()
        self.alert_settings[alert_id] = alert
        return alert
    
    async def delete_alert_setting(self, alert_id: str) -> bool:
        """알림 설정 삭제"""
        if alert_id in self.alert_settings:
            del self.alert_settings[alert_id]
            return True
        return False
    
    async def get_active_alerts(self) -> List[AlertSetting]:
        """활성화된 모든 알림 설정 조회"""
        return [
            alert for alert in self.alert_settings.values() 
            if alert.is_active
        ]
    
    async def check_alert_conditions(self) -> List[Dict]:
        """알림 조건 확인 및 발송할 알림 목록 반환"""
        triggered_alerts = []
        active_alerts = await self.get_active_alerts()
        
        for alert in active_alerts:
            try:
                # 현재 환율 조회
                current_rate = await self.exchange_service.get_conversion_rate(
                    alert.currency_from, 
                    alert.currency_to
                )
                
                # 조건 확인
                should_trigger = False
                if alert.condition == 'above' and current_rate >= float(alert.target_rate):
                    should_trigger = True
                elif alert.condition == 'below' and current_rate <= float(alert.target_rate):
                    should_trigger = True
                
                if should_trigger:
                    # 최근에 같은 알림을 보냈는지 확인 (중복 방지)
                    recent_notification = self._check_recent_notification(alert.id)
                    if not recent_notification:
                        triggered_alerts.append({
                            'alert': alert,
                            'current_rate': current_rate,
                            'triggered_at': datetime.now()
                        })
                        
            except Exception as e:
                print(f"알림 확인 중 오류 ({alert.id}): {e}")
        
        return triggered_alerts
    
    def _check_recent_notification(self, alert_id: str, hours: int = 1) -> bool:
        """최근 지정된 시간 내에 알림을 보냈는지 확인"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        for notification in self.notification_history:
            if (notification.alert_setting_id == alert_id and 
                notification.sent_at > cutoff_time):
                return True
        return False
    
    async def record_notification(self, alert_setting_id: str, triggered_rate: float, 
                                notification_type: str = 'email') -> NotificationHistory:
        """알림 발송 이력 기록"""
        notification = NotificationHistory(
            id=str(uuid.uuid4()),
            user_id=self.alert_settings[alert_setting_id].user_id,
            alert_setting_id=alert_setting_id,
            triggered_rate=Decimal(str(triggered_rate)),
            notification_type=notification_type,
            sent_at=datetime.now()
        )
        
        self.notification_history.append(notification)
        return notification
    
    async def get_user_notification_history(self, user_id: str, limit: int = 50) -> List[NotificationHistory]:
        """사용자의 알림 이력 조회"""
        user_notifications = [
            notification for notification in self.notification_history
            if notification.user_id == user_id
        ]
        
        # 최신순 정렬
        user_notifications.sort(key=lambda x: x.sent_at, reverse=True)
        return user_notifications[:limit]
    
    async def get_alert_statistics(self, user_id: str) -> Dict:
        """사용자 알림 통계"""
        user_alerts = await self.get_user_alerts(user_id)
        user_notifications = await self.get_user_notification_history(user_id)
        
        active_count = sum(1 for alert in user_alerts if alert.is_active)
        inactive_count = len(user_alerts) - active_count
        
        # 최근 7일간 알림 수
        week_ago = datetime.now() - timedelta(days=7)
        recent_notifications = [
            n for n in user_notifications 
            if n.sent_at > week_ago
        ]
        
        return {
            "total_alerts": len(user_alerts),
            "active_alerts": active_count,
            "inactive_alerts": inactive_count,
            "total_notifications": len(user_notifications),
            "recent_notifications": len(recent_notifications),
            "last_notification": user_notifications[0].sent_at if user_notifications else None
        }