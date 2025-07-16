# 🚀 백엔드 배포 가이드

## Railway 배포 단계별 가이드

### 1. 사전 준비사항

#### A. Supabase 프로젝트 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase_schema.sql` 파일을 SQL Editor에서 실행
3. 다음 정보 메모:
   - `SUPABASE_URL`: https://your-project.supabase.co
   - `SUPABASE_SERVICE_KEY`: 서비스 키 (Settings > API)

#### B. ExchangeRate API 키 발급
1. [ExchangeRate-API](https://exchangerate-api.com) 가입
2. 무료 API 키 발급
3. `EXCHANGE_RATE_API_KEY` 메모

#### C. 이메일 서비스 설정 (선택사항)
1. [Resend](https://resend.com) 가입
2. API 키 발급
3. `RESEND_API_KEY` 메모

### 2. Railway 배포

#### A. Railway 계정 설정
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login
```

#### B. 프로젝트 배포
```bash
# 백엔드 디렉토리로 이동
cd backend

# Railway 프로젝트 초기화
railway init

# 배포
railway up
```

#### C. 환경 변수 설정
Railway 대시보드에서 다음 환경 변수들을 설정:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here

# ExchangeRate API
EXCHANGE_RATE_API_KEY=your_api_key_here

# Email Service (선택사항)
RESEND_API_KEY=your_resend_key_here

# App Settings
SECRET_KEY=your_super_secret_key_here
DEBUG=false
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000

# Railway 자동 설정
PORT=8000
```

### 3. 배포 확인

#### A. 헬스 체크
```bash
curl https://your-app.railway.app/health
```

응답:
```json
{"status": "healthy"}
```

#### B. API 문서 확인
브라우저에서 접속:
```
https://your-app.railway.app/docs
```

### 4. 프론트엔드 연동

프론트엔드 환경 변수 업데이트:
```env
VITE_API_BASE_URL=https://your-app.railway.app
```

### 5. 배포 후 테스트

#### A. 인증 테스트
```bash
# 회원가입
curl -X POST https://your-app.railway.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 로그인
curl -X POST https://your-app.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### B. 알림 설정 테스트
```bash
# 알림 설정 생성 (로그인 후 토큰 사용)
curl -X POST https://your-app.railway.app/alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currency_from": "USD",
    "currency_to": "KRW", 
    "target_rate": 1300,
    "condition": "below"
  }'
```

### 6. 모니터링 및 로그

#### A. Railway 로그 확인
```bash
railway logs
```

#### B. 모니터링 서비스 시작
```bash
curl -X POST https://your-app.railway.app/alerts/monitoring/start
```

### 7. 도메인 설정 (선택사항)

1. Railway 대시보드 > Settings > Domains
2. 커스텀 도메인 추가
3. DNS 설정 업데이트

### 8. 보안 강화

#### A. CORS 설정 확인
```python
# app/main.py에서 CORS_ORIGINS 환경변수 확인
CORS_ORIGINS=https://your-domain.com,https://your-frontend.vercel.app
```

#### B. JWT 서명 검증 (프로덕션)
```python
# app/api/auth.py에서 서명 검증 활성화
payload = jwt.decode(token, secret_key, algorithms=["HS256"])
```

## 🔧 트러블슈팅

### 일반적인 문제들

#### 1. 502 Bad Gateway
- `start.py`의 포트 설정 확인
- Railway 환경변수 `PORT` 확인

#### 2. 데이터베이스 연결 오류
- Supabase URL과 Service Key 확인
- 네트워크 연결 상태 확인

#### 3. CORS 오류
- `CORS_ORIGINS` 환경변수에 프론트엔드 도메인 추가
- 프로토콜(http/https) 정확히 입력

#### 4. 인증 오류
- JWT 토큰 형식 확인 (`Bearer <token>`)
- 토큰 만료 시간 확인

## 📊 성능 최적화

### 1. 데이터베이스 최적화
- 인덱스 활용
- 쿼리 최적화
- 연결 풀링

### 2. 캐싱 전략
- Redis 추가 (선택사항)
- 환율 데이터 캐싱

### 3. 모니터링
- Railway 메트릭 확인
- 로그 모니터링
- 에러 추적

## 🆘 지원

배포 중 문제가 발생하면:
1. Railway 문서 확인
2. 로그 분석
3. GitHub Issues에 문의

---

🎉 배포 완료 후 프론트엔드와 연동하여 전체 시스템을 테스트하세요!