import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, exchange, alerts
from app.services.monitoring_service import get_monitoring_service

app = FastAPI(title="Exchange Rate Travel App", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + [
        "https://exchange-rate-travel-app-frontend.vercel.app",
        "https://exchange-rate-travel-app-frontend-kaos1025s-projects.vercel.app",
        "https://exchange-rate-travel-app-frontend-git-master-kaos1025s-projects.vercel.app",
        "*"  # 임시로 모든 origin 허용
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(exchange.router, tags=["exchange"])
app.include_router(alerts.router, tags=["alerts"])

# 앱 시작 시 모니터링 서비스 자동 시작
@app.on_event("startup")
async def startup_event():
    """앱 시작 시 자동으로 모니터링 서비스 시작"""
    monitoring_service = get_monitoring_service()
    monitoring_service.start_monitoring()
    print("🚀 모니터링 서비스가 자동으로 시작되었습니다 (매일 00:00 환율 데이터 수집)")

@app.get("/")
def read_root():
    return {"message": "Exchange Rate Travel App API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)