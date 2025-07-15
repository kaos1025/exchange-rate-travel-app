import logging
from datetime import datetime
from typing import Dict, Optional
from ..models.alert import AlertSetting
from ..config import settings
import resend
from ..database import get_supabase

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotificationService:
    """알림 발송 서비스"""
    
    def __init__(self):
        # Resend API 설정
        if settings.resend_api_key:
            resend.api_key = settings.resend_api_key
        
        self.sender_email = "noreply@exchangeapp.com"
        self.supabase = get_supabase()
        
        # 개발용 기본 이메일 매핑
        self.fallback_emails = {
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
            user_email = await self._get_user_email(user_id)
            if not user_email:
                logger.warning(f"사용자 이메일을 찾을 수 없습니다: {user_id}")
                return False
            
            # 이메일 내용 생성
            subject = self._create_alert_subject(alert_setting, current_rate)
            html_body = self._create_alert_html_body(alert_setting, current_rate, triggered_at)
            
            # 실제 이메일 발송
            if settings.resend_api_key:
                return await self._send_email_with_resend(user_email, subject, html_body)
            else:
                # 개발 환경에서는 로그로 출력
                logger.info("=" * 60)
                logger.info("📧 환율 알림 이메일")
                logger.info(f"받는 사람: {user_email}")
                logger.info(f"제목: {subject}")
                logger.info(f"내용:\n{html_body}")
                logger.info("=" * 60)
                return True
            
        except Exception as e:
            logger.error(f"이메일 발송 실패: {e}")
            return False
    
    def _create_alert_subject(self, alert_setting: AlertSetting, current_rate: float) -> str:
        """알림 이메일 제목 생성"""
        condition_text = "상승" if alert_setting.condition == "above" else "하락"
        return f"🚨 환율 알림: {alert_setting.currency_from}/{alert_setting.currency_to} {condition_text}"
    
    def _create_alert_html_body(
        self, 
        alert_setting: AlertSetting, 
        current_rate: float, 
        triggered_at: datetime
    ) -> str:
        """알림 이메일 HTML 본문 생성"""
        condition_text = "이상" if alert_setting.condition == "above" else "이하"
        icon = "📈" if alert_setting.condition == "above" else "📉"
        
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>환율 알림</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }}
        .content {{ background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .rate-info {{ background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }}
        .footer {{ text-align: center; color: #666; font-size: 12px; }}
        .highlight {{ color: #667eea; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{icon} 환율 알림</h1>
        <p>설정하신 환율 조건에 도달했습니다!</p>
    </div>
    
    <div class="content">
        <div class="rate-info">
            <h3>📊 환율 정보</h3>
            <p><strong>통화쌍:</strong> {alert_setting.currency_from} → {alert_setting.currency_to}</p>
            <p><strong>목표 환율:</strong> {alert_setting.target_rate} {condition_text}</p>
            <p><strong>현재 환율:</strong> <span class="highlight">{current_rate:.6f}</span></p>
            <p><strong>발생 시간:</strong> {triggered_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        <p>💡 현재 환율이 설정하신 목표 환율 <strong>{alert_setting.target_rate}{condition_text}</strong>에 도달했습니다.</p>
        <p>환율 정보를 확인하고 필요한 조치를 취하세요.</p>
    </div>
    
    <div class="footer">
        <p>Exchange Rate Travel App<br>
        <a href="https://your-app-domain.com">앱에서 설정 변경하기</a></p>
        <p>이 이메일은 자동으로 발송되었습니다.</p>
    </div>
</body>
</html>
        """
        
        return html_body.strip()
    
    async def _send_email_with_resend(self, to_email: str, subject: str, html_body: str) -> bool:
        """Resend API를 사용한 이메일 발송"""
        try:
            params = {
                "from": self.sender_email,
                "to": [to_email],
                "subject": subject,
                "html": html_body
            }
            
            response = resend.Emails.send(params)
            
            if response.get('id'):
                logger.info(f"이메일 발송 성공: {to_email} (ID: {response['id']})")
                return True
            else:
                logger.error(f"이메일 발송 실패: {response}")
                return False
                
        except Exception as e:
            logger.error(f"이메일 발송 실패 ({to_email}): {e}")
            return False
    
    async def _get_user_email(self, user_id: str) -> Optional[str]:
        """사용자 이메일 조회"""
        try:
            # Supabase에서 사용자 정보 조회
            response = self.supabase.table("user_profiles").select("*").eq("id", user_id).execute()
            
            if response.data:
                # 사용자 프로필에서 이메일 가져오기 (실제로는 auth.users 테이블에서)
                auth_response = self.supabase.auth.admin.get_user_by_id(user_id)
                if auth_response.user:
                    return auth_response.user.email
            
            # 폴백으로 하드코딩된 이메일 사용
            return self.fallback_emails.get(user_id)
            
        except Exception as e:
            logger.error(f"사용자 이메일 조회 실패 ({user_id}): {e}")
            return self.fallback_emails.get(user_id)
    
    async def send_test_email(self, user_id: str) -> bool:
        """테스트 이메일 발송"""
        try:
            user_email = await self._get_user_email(user_id)
            if not user_email:
                return False
            
            subject = "🧪 Exchange Rate App 테스트 이메일"
            html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; }}
        .content {{ background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 테스트 이메일</h1>
    </div>
    <div class="content">
        <p>안녕하세요!</p>
        <p>이것은 Exchange Rate Travel App의 테스트 이메일입니다.</p>
        <p>📧 이메일 설정이 정상적으로 작동하고 있습니다.</p>
        <p>📅 발송 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        <p>환율 알림 서비스를 이용해 주셔서 감사합니다!</p>
    </div>
    <div style="text-align: center; color: #666;">
        <p>Exchange Rate Travel App Team</p>
    </div>
</body>
</html>
            """
            
            if settings.resend_api_key:
                return await self._send_email_with_resend(user_email, subject, html_body)
            else:
                logger.info("=" * 50)
                logger.info("🧪 테스트 이메일")
                logger.info(f"받는 사람: {user_email}")
                logger.info(f"제목: {subject}")
                logger.info("=" * 50)
                return True
            
        except Exception as e:
            logger.error(f"테스트 이메일 발송 실패: {e}")
            return False
    
    def add_user_email(self, user_id: str, email: str):
        """사용자 이메일 추가 (개발용)"""
        self.fallback_emails[user_id] = email
        logger.info(f"사용자 이메일 등록: {user_id} -> {email}")
    
    async def get_user_email(self, user_id: str) -> Optional[str]:
        """사용자 이메일 조회"""
        return await self._get_user_email(user_id)