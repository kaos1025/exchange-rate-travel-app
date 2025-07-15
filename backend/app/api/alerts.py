from fastapi import APIRouter, HTTPException, Query, Header, Depends
from typing import List, Optional
from ..models.alert import AlertSetting, AlertSettingCreate, AlertSettingUpdate, NotificationHistory
from ..services.alert_service import AlertService
from ..services.monitoring_service import get_monitoring_service
from ..services.notification import NotificationService
from .auth import get_current_user_id

router = APIRouter(tags=["alerts"])
alert_service = AlertService()
notification_service = NotificationService()

@router.get("/", response_model=List[AlertSetting])
async def get_user_alerts(user_id: str = Header(alias="X-User-ID")):
    """사용자의 모든 알림 설정 조회"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        alerts = await alert_service.get_user_alerts(user_id)
        return alerts
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 조회 실패: {str(e)}")

@router.post("/", response_model=AlertSetting)
async def create_alert(
    alert_data: AlertSettingCreate,
    user_id: str = Header(alias="X-User-ID")
):
    """새 알림 설정 생성"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        alert = await alert_service.create_alert_setting(user_id, alert_data)
        return alert
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 생성 실패: {str(e)}")

@router.get("/{alert_id}", response_model=AlertSetting)
async def get_alert(
    alert_id: str,
    user_id: str = Header(alias="X-User-ID")
):
    """특정 알림 설정 조회"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        alert = await alert_service.get_alert_by_id(alert_id)
        if not alert or alert.user_id != user_id:
            raise HTTPException(status_code=404, detail="알림을 찾을 수 없습니다")
        return alert
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 조회 실패: {str(e)}")

@router.put("/{alert_id}", response_model=AlertSetting)
async def update_alert(
    alert_id: str,
    alert_update: AlertSettingUpdate,
    user_id: str = Header(alias="X-User-ID")
):
    """알림 설정 수정"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        # 권한 확인
        existing_alert = await alert_service.get_alert_by_id(alert_id)
        if not existing_alert or existing_alert.user_id != user_id:
            raise HTTPException(status_code=404, detail="알림을 찾을 수 없습니다")
        
        updated_alert = await alert_service.update_alert_setting(alert_id, alert_update)
        if not updated_alert:
            raise HTTPException(status_code=404, detail="알림 수정에 실패했습니다")
        
        return updated_alert
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 수정 실패: {str(e)}")

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: str,
    user_id: str = Header(alias="X-User-ID")
):
    """알림 설정 삭제"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        # 권한 확인
        existing_alert = await alert_service.get_alert_by_id(alert_id)
        if not existing_alert or existing_alert.user_id != user_id:
            raise HTTPException(status_code=404, detail="알림을 찾을 수 없습니다")
        
        success = await alert_service.delete_alert_setting(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="알림 삭제에 실패했습니다")
        
        return {"message": "알림이 성공적으로 삭제되었습니다"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 삭제 실패: {str(e)}")

@router.get("/history/notifications", response_model=List[NotificationHistory])
async def get_notification_history(
    user_id: str = Header(alias="X-User-ID"),
    limit: int = Query(50, ge=1, le=100)
):
    """사용자의 알림 발송 이력 조회"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        history = await alert_service.get_user_notification_history(user_id, limit)
        return history
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 이력 조회 실패: {str(e)}")

@router.get("/statistics/summary")
async def get_alert_statistics(user_id: str = Header(alias="X-User-ID")):
    """사용자 알림 통계 조회"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        stats = await alert_service.get_alert_statistics(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"통계 조회 실패: {str(e)}")

@router.post("/test/trigger")
async def test_alert_trigger(user_id: str = Header(alias="X-User-ID")):
    """알림 조건 테스트 (개발용)"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        triggered_alerts = await alert_service.check_alert_conditions()
        user_triggered = [
            alert for alert in triggered_alerts 
            if alert['alert'].user_id == user_id
        ]
        
        return {
            "message": "알림 조건 확인 완료",
            "triggered_count": len(user_triggered),
            "triggered_alerts": user_triggered
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"알림 테스트 실패: {str(e)}")

@router.get("/monitoring/status")
async def get_monitoring_status():
    """모니터링 서비스 상태 조회"""
    try:
        monitoring_service = get_monitoring_service()
        status = await monitoring_service.get_monitoring_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"모니터링 상태 조회 실패: {str(e)}")

@router.post("/monitoring/start")
async def start_monitoring():
    """모니터링 서비스 시작"""
    try:
        monitoring_service = get_monitoring_service()
        monitoring_service.start_monitoring()
        return {"message": "모니터링 서비스가 시작되었습니다"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"모니터링 시작 실패: {str(e)}")

@router.post("/monitoring/stop")
async def stop_monitoring():
    """모니터링 서비스 중지"""
    try:
        monitoring_service = get_monitoring_service()
        monitoring_service.stop_monitoring()
        return {"message": "모니터링 서비스가 중지되었습니다"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"모니터링 중지 실패: {str(e)}")

@router.post("/monitoring/check")
async def manual_monitoring_check():
    """수동 모니터링 확인"""
    try:
        monitoring_service = get_monitoring_service()
        result = await monitoring_service.manual_check()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"수동 확인 실패: {str(e)}")

@router.post("/test/email")
async def send_test_email(user_id: str = Header(alias="X-User-ID")):
    """테스트 이메일 발송"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        success = await notification_service.send_test_email(user_id)
        if success:
            return {"message": "테스트 이메일이 발송되었습니다"}
        else:
            raise HTTPException(status_code=400, detail="이메일 발송에 실패했습니다")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"테스트 이메일 발송 실패: {str(e)}")

@router.post("/user/email")
async def register_user_email(
    email: str = Query(..., description="사용자 이메일 주소"),
    user_id: str = Header(alias="X-User-ID")
):
    """사용자 이메일 등록 (MVP용)"""
    if not user_id:
        raise HTTPException(status_code=401, detail="사용자 인증이 필요합니다")
    
    try:
        notification_service.add_user_email(user_id, email)
        return {"message": f"이메일이 등록되었습니다: {email}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이메일 등록 실패: {str(e)}")