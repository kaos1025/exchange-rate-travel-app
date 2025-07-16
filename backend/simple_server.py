#!/usr/bin/env python3
"""
간단한 백엔드 서버 - 데이터베이스 없이 작동
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn

app = FastAPI(title="Exchange Rate Travel App (Simple)", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 목업 환율 데이터
MOCK_RATES = {
    "USD": {
        "KRW": 1340.5,
        "JPY": 150.0,
        "EUR": 0.85,
        "GBP": 0.79,
        "CNY": 7.24,
        "AUD": 1.52,
        "CAD": 1.35
    },
    "KRW": {
        "USD": 1/1340.5,
        "JPY": 150.0/1340.5,
        "EUR": 0.85/1340.5,
        "GBP": 0.79/1340.5,
        "CNY": 7.24/1340.5,
        "AUD": 1.52/1340.5,
        "CAD": 1.35/1340.5
    },
    "EUR": {
        "USD": 1/0.85,
        "KRW": 1340.5/0.85,
        "JPY": 150.0/0.85,
        "GBP": 0.79/0.85,
        "CNY": 7.24/0.85,
        "AUD": 1.52/0.85,
        "CAD": 1.35/0.85
    }
}

@app.get("/")
def read_root():
    return {"message": "Exchange Rate Travel App API (Simple Version)", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/exchange/rates")
def get_exchange_rates():
    """환율 정보 조회"""
    return {
        "base": "USD",
        "rates": MOCK_RATES["USD"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/exchange/convert")
def convert_currency(
    from_currency: str = "USD",
    to_currency: str = "KRW", 
    amount: float = 100.0
):
    """환율 변환"""
    try:
        # 기본 USD 기준으로 변환
        if from_currency == "USD":
            rate = MOCK_RATES["USD"].get(to_currency, 1.0)
        elif to_currency == "USD":
            rate = MOCK_RATES[from_currency].get("USD", 1.0) if from_currency in MOCK_RATES else 1.0
        else:
            # USD를 경유한 변환
            usd_from_rate = MOCK_RATES[from_currency].get("USD", 1.0) if from_currency in MOCK_RATES else 1.0
            usd_to_rate = MOCK_RATES["USD"].get(to_currency, 1.0)
            rate = usd_from_rate * usd_to_rate
        
        converted_amount = amount * rate
        
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate": rate,
            "converted_amount": converted_amount,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": f"변환 실패: {str(e)}"}

@app.get("/exchange/currencies")
def get_supported_currencies():
    """지원 통화 목록"""
    currencies = ["USD", "KRW", "JPY", "EUR", "GBP", "CNY", "AUD", "CAD"]
    return {
        "currencies": currencies,
        "count": len(currencies)
    }

if __name__ == "__main__":
    print("🚀 간단한 백엔드 서버 시작")
    print("🌐 서버 주소: http://localhost:8000")
    print("📖 API 문서: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False  # reload 비활성화
    )