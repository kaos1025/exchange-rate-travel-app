# 배포 가이드

## 사전 준비사항

1. **Supabase 프로젝트 생성**
   - https://supabase.com 에서 새 프로젝트 생성
   - 데이터베이스 스키마 설정 (supabase_schema.sql 실행)
   - API 키 및 URL 확인

2. **ExchangeRate API 키 발급**
   - https://exchangerate-api.com 에서 무료 API 키 발급

3. **이메일 서비스 설정**
   - SendGrid 또는 Resend API 키 발급

## 백엔드 배포 (Railway)

### 1. Railway 계정 생성 및 프로젝트 설정
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 생성
railway new
```

### 2. 환경 변수 설정
Railway 대시보드에서 다음 환경 변수 설정:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
EXCHANGE_RATE_API_KEY=your_api_key
SENDGRID_API_KEY=your_sendgrid_key
SECRET_KEY=your_secret_key
DEBUG=false
CORS_ORIGINS=https://your-frontend-domain.vercel.app
PORT=8000
HOST=0.0.0.0
```

### 3. 배포
```bash
# 백엔드 디렉토리에서
cd backend
railway deploy
```

## 백엔드 배포 (Render)

### 1. Render 계정 생성 및 서비스 설정
- https://render.com 에서 계정 생성
- New Web Service 생성
- GitHub 저장소 연결

### 2. 설정값
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment**: Python 3.11

### 3. 환경 변수 설정 (Railway와 동일)

## 프론트엔드 배포 (Vercel)

### 1. Vercel 계정 생성 및 프로젝트 설정
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 루트에서 배포
vercel
```

### 2. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 설정:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app
VITE_ENVIRONMENT=production
```

### 3. 빌드 설정
- **Framework Preset**: Vite
- **Root Directory**: frontend
- **Build Command**: npm run build
- **Output Directory**: dist

## 배포 후 확인사항

### 1. 백엔드 API 테스트
```bash
# Health check
curl https://your-backend-domain.up.railway.app/health

# Exchange rates 엔드포인트 테스트
curl https://your-backend-domain.up.railway.app/exchange/rates
```

### 2. 프론트엔드 접속 확인
- https://your-frontend-domain.vercel.app 접속
- 로그인/회원가입 기능 테스트
- 환율 조회 기능 테스트
- 알림 설정 기능 테스트

### 3. 통합 테스트
- 프론트엔드에서 백엔드 API 호출 확인
- CORS 설정 확인
- 실시간 환율 업데이트 확인

## 문제해결

### 1. CORS 에러
- 백엔드 환경변수에 프론트엔드 도메인 추가
- `CORS_ORIGINS` 설정 확인

### 2. 환경변수 누락
- 배포 플랫폼에서 환경변수 설정 확인
- .env.example 파일 참조

### 3. 빌드 에러
- requirements.txt 의존성 확인
- Python 버전 호환성 확인

## 모니터링 및 로그

### Railway
- 대시보드에서 실시간 로그 확인
- 메트릭스 및 사용량 모니터링

### Vercel
- 함수 로그 및 성능 메트릭 확인
- 배포 히스토리 관리

### Render
- 로그 탭에서 애플리케이션 로그 확인
- 성능 지표 모니터링