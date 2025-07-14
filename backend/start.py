#!/usr/bin/env python3
import os
import sys
import uvicorn

if __name__ == "__main__":
    # Railway에서 PORT 환경변수를 안전하게 처리
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}")
    
    # FastAPI 앱 시작
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )