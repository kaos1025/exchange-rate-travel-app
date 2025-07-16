#!/usr/bin/env python3
"""
로컬 개발용 백엔드 서버 시작 스크립트
"""

import os
import sys
import uvicorn
from pathlib import Path

def setup_environment():
    """개발 환경 설정"""
    # 환경 변수가 없으면 기본값 설정
    env_vars = {
        'SUPABASE_URL': 'your_supabase_url_here',
        'SUPABASE_SERVICE_KEY': 'your_service_key_here', 
        'EXCHANGE_RATE_API_KEY': 'your_api_key_here',
        'SECRET_KEY': 'dev-secret-key-change-in-production',
        'DEBUG': 'true',
        'CORS_ORIGINS': 'http://localhost:3000,http://localhost:5173',
        'PORT': '8000',
        'HOST': '0.0.0.0'
    }
    
    for key, default_value in env_vars.items():
        if not os.getenv(key):
            os.environ[key] = default_value
            print(f"⚠️  환경 변수 {key}가 설정되지 않았습니다. 기본값 사용: {default_value}")

def check_requirements():
    """필요한 패키지 설치 확인"""
    try:
        import fastapi
        import uvicorn
        import supabase
        print("✅ 필요한 패키지가 모두 설치되어 있습니다.")
        return True
    except ImportError as e:
        print(f"❌ 필요한 패키지가 설치되지 않았습니다: {e}")
        print("다음 명령어로 설치하세요:")
        print("pip install -r requirements.txt")
        return False

def main():
    """메인 함수"""
    print("🚀 환율 여행 앱 백엔드 서버 시작")
    print("=" * 50)
    
    # 요구사항 확인
    if not check_requirements():
        sys.exit(1)
    
    # 환경 설정
    setup_environment()
    
    # 서버 설정
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8000))
    
    print(f"🌐 서버 주소: http://{host}:{port}")
    print(f"📖 API 문서: http://{host}:{port}/docs")
    print(f"💻 개발 모드: {os.getenv('DEBUG', 'false').lower() == 'true'}")
    print("=" * 50)
    
    # 중요한 환경 변수 상태 확인
    env_status = {
        'SUPABASE_URL': '✅' if 'supabase.co' in os.getenv('SUPABASE_URL', '') else '❌',
        'EXCHANGE_RATE_API_KEY': '✅' if len(os.getenv('EXCHANGE_RATE_API_KEY', '')) > 10 else '❌',
        'CORS_ORIGINS': '✅' if os.getenv('CORS_ORIGINS') else '❌'
    }
    
    print("환경 변수 상태:")
    for env_var, status in env_status.items():
        print(f"  {status} {env_var}")
    
    if '❌' in env_status.values():
        print("\n⚠️  일부 환경 변수가 올바르게 설정되지 않았습니다.")
        print("프로덕션 기능이 제한될 수 있습니다.")
    
    print("\n🔄 서버를 시작합니다...")
    
    try:
        # FastAPI 앱 시작
        uvicorn.run(
            "app.main:app",
            host=host,
            port=port,
            reload=True,  # 개발 모드에서 자동 재시작
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 서버가 중지되었습니다.")
    except Exception as e:
        print(f"❌ 서버 시작 중 오류 발생: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()