import asyncio
import threading
import time
from datetime import datetime, timedelta
from typing import Dict, List
import logging

from .alert_service import AlertService
from .exchange_rate import ExchangeRateService
from .notification import NotificationService

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExchangeRateMonitoringService:
    """백그라운드 환율 모니터링 서비스"""
    
    def __init__(self):
        self.alert_service = AlertService()
        self.exchange_service = ExchangeRateService()
        self.notification_service = NotificationService()
        self.is_running = False
        self.monitoring_thread = None
        self.check_interval = 300  # 5분마다 확인
        
    def start_monitoring(self):
        """모니터링 시작"""
        if self.is_running:
            logger.warning("모니터링이 이미 실행 중입니다")
            return
        
        self.is_running = True
        self.monitoring_thread = threading.Thread(target=self._run_monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        logger.info("환율 모니터링 서비스가 시작되었습니다")
    
    def stop_monitoring(self):
        """모니터링 중지"""
        self.is_running = False
        if self.monitoring_thread:
            self.monitoring_thread.join(timeout=10)
        logger.info("환율 모니터링 서비스가 중지되었습니다")
    
    def _run_monitoring_loop(self):
        """모니터링 루프 실행"""
        while self.is_running:
            try:
                # 비동기 함수를 동기 스레드에서 실행
                asyncio.run(self._check_alerts())
                
                # 다음 확인까지 대기
                for _ in range(self.check_interval):
                    if not self.is_running:
                        break
                    time.sleep(1)
                    
            except Exception as e:
                logger.error(f"모니터링 중 오류 발생: {e}")
                time.sleep(60)  # 오류 발생 시 1분 대기
    
    async def _check_alerts(self):
        """알림 조건 확인 및 발송"""
        try:
            logger.info("알림 조건 확인 시작...")
            
            # 트리거된 알림 확인
            triggered_alerts = await self.alert_service.check_alert_conditions()
            
            if not triggered_alerts:
                logger.info("트리거된 알림이 없습니다")
                return
            
            logger.info(f"{len(triggered_alerts)}개의 알림이 트리거되었습니다")
            
            # 각 알림에 대해 발송 처리
            for alert_data in triggered_alerts:
                await self._process_triggered_alert(alert_data)
                
        except Exception as e:
            logger.error(f"알림 확인 중 오류: {e}")
    
    async def _process_triggered_alert(self, alert_data: Dict):
        """트리거된 알림 처리"""
        try:
            alert = alert_data['alert']
            current_rate = alert_data['current_rate']
            triggered_at = alert_data['triggered_at']
            
            logger.info(f"알림 처리: {alert.currency_from}/{alert.currency_to} "
                       f"목표: {alert.target_rate}, 현재: {current_rate}")
            
            # 이메일 알림 발송
            success = await self.notification_service.send_exchange_rate_alert(
                user_id=alert.user_id,
                alert_setting=alert,
                current_rate=current_rate,
                triggered_at=triggered_at
            )
            
            if success:
                # 알림 발송 이력 기록
                await self.alert_service.record_notification(
                    alert_setting_id=alert.id,
                    triggered_rate=current_rate,
                    notification_type='email'
                )
                
                logger.info(f"알림 발송 완료: {alert.id}")
            else:
                logger.error(f"알림 발송 실패: {alert.id}")
                
        except Exception as e:
            logger.error(f"알림 처리 중 오류: {e}")
    
    async def get_monitoring_status(self) -> Dict:
        """모니터링 상태 조회"""
        active_alerts = await self.alert_service.get_active_alerts()
        
        return {
            "is_running": self.is_running,
            "check_interval_seconds": self.check_interval,
            "active_alerts_count": len(active_alerts),
            "last_check": datetime.now().isoformat(),
            "thread_alive": self.monitoring_thread.is_alive() if self.monitoring_thread else False
        }
    
    async def manual_check(self) -> Dict:
        """수동 알림 확인 (테스트용)"""
        try:
            triggered_alerts = await self.alert_service.check_alert_conditions()
            
            # 실제 발송은 하지 않고 결과만 반환
            result = {
                "check_time": datetime.now().isoformat(),
                "triggered_count": len(triggered_alerts),
                "alerts": []
            }
            
            for alert_data in triggered_alerts:
                alert = alert_data['alert']
                result["alerts"].append({
                    "alert_id": alert.id,
                    "user_id": alert.user_id,
                    "currency_pair": f"{alert.currency_from}/{alert.currency_to}",
                    "target_rate": float(alert.target_rate),
                    "current_rate": alert_data['current_rate'],
                    "condition": alert.condition
                })
            
            return result
            
        except Exception as e:
            logger.error(f"수동 확인 중 오류: {e}")
            return {
                "error": str(e),
                "check_time": datetime.now().isoformat()
            }

# 글로벌 모니터링 서비스 인스턴스
monitoring_service = ExchangeRateMonitoringService()

def get_monitoring_service() -> ExchangeRateMonitoringService:
    """모니터링 서비스 인스턴스 반환"""
    return monitoring_service