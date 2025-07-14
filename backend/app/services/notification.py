import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Optional
from ..models.alert import AlertSetting

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotificationService:
    """알림 발송 서비스"""
    
    def __init__(self):
        # MVP에서는 이메일 설정을 하드코딩 (실제로는 환경변수 사용)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = "noreply@exchangeapp.com"  # 실제 이메일로 교체 필요
        self.sender_password = "app_password"  # 실제 앱 비밀번호로 교체 필요
        
        # MVP용 사용자 이메일 매핑 (실제로는 데이터베이스에서 조회)
        self.user_emails = {
            "user1": "test1@example.com",
            "user2": "test2@example.com",
            "demo_user": "demo@example.com"
        }
    
    async def send_exchange_rate_alert(
        self, 
        user_id: str, 
        alert_setting: AlertSetting, 
        current_rate: float,
        triggered_at: datetime
    ) -> bool:
        """환율 알림 이메일 발송"""
        try:
            # 사용자 이메일 조회
            user_email = self.user_emails.get(user_id)
            if not user_email:
                logger.warning(f"사용자 이메일을 찾을 수 없습니다: {user_id}")
                return False
            
            # 이메일 내용 생성
            subject = self._create_alert_subject(alert_setting, current_rate)
            body = self._create_alert_body(alert_setting, current_rate, triggered_at)
            
            # MVP에서는 실제 이메일 발송 대신 로그 출력
            logger.info("=" * 60)
            logger.info("📧 환율 알림 이메일")
            logger.info(f"받는 사람: {user_email}")
            logger.info(f"제목: {subject}")
            logger.info(f"내용:\n{body}")
            logger.info("=" * 60)
            
            # 실제 프로덕션에서는 아래 코드 사용
            # return await self._send_email(user_email, subject, body)
            
            return True  # MVP에서는 항상 성공으로 처리
            
        except Exception as e:
            logger.error(f"이메일 발송 실패: {e}")
            return False
    
    def _create_alert_subject(self, alert_setting: AlertSetting, current_rate: float) -> str:
        """알림 이메일 제목 생성"""
        condition_text = "상승" if alert_setting.condition == "above" else "하락"
        return f"🚨 환율 알림: {alert_setting.currency_from}/{alert_setting.currency_to} {condition_text}"
    
    def _create_alert_body(
        self, 
        alert_setting: AlertSetting, 
        current_rate: float, 
        triggered_at: datetime
    ) -> str:
        """알림 이메일 본문 생성"""
        condition_text = "이상" if alert_setting.condition == "above" else "이하"
        
        body = f"""
안녕하세요!

설정하신 환율 알림이 발생했습니다.

📊 환율 정보:
• 통화쌍: {alert_setting.currency_from} → {alert_setting.currency_to}
• 목표 환율: {alert_setting.target_rate} {condition_text}
• 현재 환율: {current_rate:.6f}
• 발생 시간: {triggered_at.strftime('%Y-%m-%d %H:%M:%S')}

💡 현재 환율이 설정하신 목표 환율 {alert_setting.target_rate}{condition_text}에 도달했습니다.

환율 정보를 확인하고 필요한 조치를 취하세요.

---
Exchange Rate Travel App
https://your-app-domain.com

이 이메일은 자동으로 발송되었습니다.
알림 설정을 변경하려면 앱에서 설정을 수정해주세요.
        """
        
        return body.strip()
    
    async def _send_email(self, to_email: str, subject: str, body: str) -> bool:
        """실제 이메일 발송 (프로덕션용)"""
        try:
            # MIME 메시지 생성
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # 본문 추가
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # SMTP 서버 연결 및 발송
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            
            logger.info(f"이메일 발송 성공: {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"이메일 발송 실패 ({to_email}): {e}")
            return False
    
    async def send_test_email(self, user_id: str) -> bool:
        """테스트 이메일 발송"""
        try:
            user_email = self.user_emails.get(user_id)
            if not user_email:
                return False
            
            subject = "🧪 Exchange Rate App 테스트 이메일"
            body = f"""
안녕하세요!

이것은 Exchange Rate Travel App의 테스트 이메일입니다.

📧 이메일 설정이 정상적으로 작동하고 있습니다.
📅 발송 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

환율 알림 서비스를 이용해 주셔서 감사합니다!

---
Exchange Rate Travel App Team
            """
            
            # MVP에서는 로그로 출력
            logger.info("=" * 50)
            logger.info("🧪 테스트 이메일")
            logger.info(f"받는 사람: {user_email}")
            logger.info(f"제목: {subject}")
            logger.info(f"내용:\n{body}")
            logger.info("=" * 50)
            
            return True
            
        except Exception as e:
            logger.error(f"테스트 이메일 발송 실패: {e}")
            return False
    
    def add_user_email(self, user_id: str, email: str):
        """사용자 이메일 추가 (MVP용)"""
        self.user_emails[user_id] = email
        logger.info(f"사용자 이메일 등록: {user_id} -> {email}")
    
    def get_user_email(self, user_id: str) -> Optional[str]:
        """사용자 이메일 조회"""
        return self.user_emails.get(user_id)