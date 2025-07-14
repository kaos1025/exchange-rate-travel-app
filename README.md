# Exchange Rate Travel App

환율 정보와 여행 맥락을 연결한 실시간 알림 서비스 MVP

## 🚀 기능

- **실시간 환율 모니터링**: 주요 통화쌍 실시간 환율 조회
- **환율 알림 설정**: 목표 환율 도달 시 이메일 알림
- **환율 계산기**: 다양한 통화간 환율 계산
- **여행 맥락 정보**: 환율과 연결된 현지 물가 정보
- **사용자 인증**: Supabase Auth를 통한 안전한 로그인

## 🛠 기술 스택

### Frontend
- **React** + **Vite** - 모던 프론트엔드 개발
- **Tailwind CSS** - 유틸리티 우선 스타일링
- **Radix UI** - 접근성을 고려한 UI 컴포넌트
- **Recharts** - 데이터 시각화
- **React Router** - 클라이언트 사이드 라우팅

### Backend
- **FastAPI** - 고성능 Python 웹 프레임워크
- **Supabase** - PostgreSQL 기반 백엔드 서비스
- **ExchangeRate-API** - 실시간 환율 데이터
- **Resend** - 이메일 알림 서비스
- **Uvicorn** - ASGI 서버

## 📂 프로젝트 구조

```
exchange-rate-travel-app/
├── backend/              # FastAPI 백엔드
│   ├── app/
│   │   ├── api/         # API 엔드포인트
│   │   ├── models/      # 데이터 모델
│   │   ├── services/    # 비즈니스 로직
│   │   └── utils/       # 유틸리티 함수
│   ├── Dockerfile       # 컨테이너 설정
│   └── requirements.txt # Python 의존성
├── frontend/            # React 프론트엔드
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── services/   # API 호출 로직
│   │   └── hooks/      # 커스텀 훅
│   └── package.json    # Node.js 의존성
└── docs/               # 문서
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- Python 3.11+
- Supabase 계정
- ExchangeRate-API 키

### 1. 저장소 클론

```bash
git clone https://github.com/kaos1025/exchange-rate-travel-app.git
cd exchange-rate-travel-app
```

### 2. 백엔드 설정

```bash
cd backend

# 가상 환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력

# 개발 서버 실행
uvicorn app.main:app --reload
```

### 3. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력

# 개발 서버 실행
npm run dev
```

### 4. 데이터베이스 설정

Supabase 프로젝트에서 `supabase_schema.sql` 파일을 실행하여 데이터베이스 스키마를 생성합니다.

## 🌐 배포

### 프론트엔드 배포 (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 환경 변수 설정 (Vercel 대시보드에서)
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_API_BASE_URL
```

### 백엔드 배포 (Railway)

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인 및 배포
railway login
railway deploy

# 환경 변수 설정 (Railway 대시보드에서)
# 모든 .env.example 변수들
```

자세한 배포 가이드는 [docs/deployment.md](docs/deployment.md)를 참조하세요.

## 🧪 테스트

### 백엔드 테스트
```bash
cd backend
python test_exchange_api.py
```

### 프론트엔드 빌드 테스트
```bash
cd frontend
npm run build
```

## 📊 API 엔드포인트

### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/me` - 사용자 정보

### 환율
- `GET /exchange/rates` - 현재 환율 조회
- `GET /exchange/convert` - 환율 계산

### 알림
- `GET /alerts` - 알림 설정 목록
- `POST /alerts` - 알림 설정 생성
- `PUT /alerts/{id}` - 알림 설정 수정
- `DELETE /alerts/{id}` - 알림 설정 삭제

## 🔧 개발 상태

### ✅ 완료된 기능
- 기본 인증 시스템
- 환율 조회 및 계산
- 알림 설정 관리
- 반응형 UI
- 배포 설정

### 🚧 향후 개선사항
- 푸시 알림 지원
- 환율 예측 기능
- 소셜 로그인
- 모바일 앱
- 여행 상품 연동

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 관련 문의: [GitHub Issues](https://github.com/kaos1025/exchange-rate-travel-app/issues)

---

🤖 Generated with [Claude Code](https://claude.ai/code)
