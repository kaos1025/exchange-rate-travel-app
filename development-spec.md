# 환율 + 여행정보 통합 서비스 MVP 개발 명세서

## 프로젝트 개요
환율 정보와 여행 맥락을 연결한 실시간 알림 서비스 MVP 구축

## 기술 스택
- **백엔드**: Python (FastAPI)
- **프론트엔드**: React (Vite)
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **환율 API**: ExchangeRate-API (무료 플랜)
- **배포**: Vercel (프론트엔드), Railway/Render (백엔드)

## 프로젝트 구조
```
exchange-rate-travel-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── alert.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── exchange_rate.py
│   │   │   ├── travel_info.py
│   │   │   └── notification.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── exchange.py
│   │   │   └── alerts.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── helpers.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── ExchangeRate/
│   │   │   ├── AlertSettings/
│   │   │   └── TravelInfo/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── docs/
    ├── api.md
    ├── deployment.md
    └── user-guide.md
```

## 데이터베이스 스키마

### 1. 사용자 테이블 (Supabase Auth 기본 사용)
```sql
-- auth.users는 Supabase에서 자동 생성
-- 추가 프로필 정보만 별도 테이블로 관리

CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    preferred_currency VARCHAR(3) DEFAULT 'KRW',
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. 환율 알림 설정
```sql
CREATE TABLE alert_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    currency_from VARCHAR(3) NOT NULL,
    currency_to VARCHAR(3) NOT NULL,
    target_rate DECIMAL(15,6) NOT NULL,
    condition VARCHAR(10) CHECK (condition IN ('above', 'below')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_alert_settings_user_id ON alert_settings(user_id);
CREATE INDEX idx_alert_settings_active ON alert_settings(is_active) WHERE is_active = true;
```

### 3. 환율 이력
```sql
CREATE TABLE exchange_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    currency_from VARCHAR(3) NOT NULL,
    currency_to VARCHAR(3) NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_exchange_rates_currency_pair ON exchange_rates(currency_from, currency_to);
CREATE INDEX idx_exchange_rates_timestamp ON exchange_rates(timestamp);
```

### 4. 알림 발송 이력
```sql
CREATE TABLE notification_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_setting_id UUID REFERENCES alert_settings(id) ON DELETE CASCADE,
    triggered_rate DECIMAL(15,6) NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'email',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API 엔드포인트 설계

### 인증 관련
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보

### 환율 관련
- `GET /exchange/rates` - 현재 환율 조회
- `GET /exchange/rates/history` - 환율 이력 조회
- `GET /exchange/convert` - 환율 계산

### 알림 설정
- `GET /alerts` - 사용자 알림 설정 목록
- `POST /alerts` - 새 알림 설정 생성
- `PUT /alerts/{id}` - 알림 설정 수정
- `DELETE /alerts/{id}` - 알림 설정 삭제

### 여행 정보
- `GET /travel/context/{currency_pair}` - 환율 맥락 정보
- `GET /travel/prices/{country_code}` - 현지 물가 정보

## MVP 핵심 기능

### 1. 사용자 인증 시스템
- Supabase Auth를 활용한 간편 가입/로그인
- 소셜 로그인 (Google, GitHub)
- 사용자 프로필 관리

### 2. 환율 모니터링
- ExchangeRate-API 연동
- 주요 통화쌍 실시간 표시 (USD/KRW, JPY/KRW, EUR/KRW 등)
- 환율 계산기

### 3. 알림 설정
- 목표 환율 설정 (이상/이하)
- 이메일 알림 (초기에는 이메일만)
- 알림 설정 관리 (생성/수정/삭제/일시정지)

### 4. 여행 맥락 정보
- 환율 계산 시 현지 물가 예시
  - "1달러로 뉴욕에서 살 수 있는 것들"
  - "1만원으로 도쿄에서 살 수 있는 것들"
- 기본적인 현지 정보 (하드코딩으로 시작)

### 5. 대시보드
- 설정한 알림 목록
- 현재 환율 상태
- 간단한 환율 차트 (Chart.js)

## 개발 우선순위

### Phase 1: 기본 인프라 (1-2일)
1. 프로젝트 초기 설정
2. Supabase 연동 및 데이터베이스 스키마 생성
3. FastAPI 기본 구조 및 인증 엔드포인트
4. React 앱 기본 구조 및 라우팅

### Phase 2: 환율 기능 (2-3일)
1. ExchangeRate-API 연동
2. 환율 조회 및 표시 기능
3. 환율 계산기
4. 기본적인 환율 차트

### Phase 3: 알림 시스템 (2-3일)
1. 알림 설정 CRUD
2. 백그라운드 환율 모니터링
3. 이메일 알림 발송 (SendGrid/Resend)
4. 알림 이력 관리

### Phase 4: 여행 맥락 (1-2일)
1. 기본 여행 맥락 데이터 (하드코딩)
2. 환율과 여행 정보 연결
3. UI/UX 개선

### Phase 5: 배포 및 테스트 (1일)
1. 프론트엔드 배포 (Vercel)
2. 백엔드 배포 (Railway/Render)
3. 통합 테스트
4. 성능 최적화

## 환경 변수 설정

### 백엔드 (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# ExchangeRate API
EXCHANGE_RATE_API_KEY=your_api_key

# Email Service (SendGrid 또는 Resend)
SENDGRID_API_KEY=your_sendgrid_key
# 또는
RESEND_API_KEY=your_resend_key

# App Settings
SECRET_KEY=your_secret_key
DEBUG=false
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### 프론트엔드 (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

## 초기 더미 데이터

### 여행 맥락 정보 (하드코딩)
```python
TRAVEL_CONTEXT = {
    'USD': {
        'country': 'United States',
        'cities': {
            'New York': {
                'coffee': 5.0,
                'subway': 2.9,
                'bigmac': 5.5,
                'beer': 8.0
            },
            'Los Angeles': {
                'coffee': 4.5,
                'subway': 1.75,
                'bigmac': 5.0,
                'beer': 7.0
            }
        }
    },
    'JPY': {
        'country': 'Japan',
        'cities': {
            'Tokyo': {
                'coffee': 400,
                'subway': 160,
                'bigmac': 390,
                'beer': 300
            }
        }
    }
}
```

## 성공 지표
- 회원가입 완료율
- 알림 설정 생성율
- 알림 발송 성공률
- 사용자 재방문율
- 페이지 체류시간

## 현재 개발 상태 (2025-07-15)

### ✅ 완료된 항목
- 프론트엔드 기본 구조 및 컴포넌트
- 환율 조회 및 계산기 UI
- 여행 맥락 정보 표시 (하드코딩)
- Vercel 배포 설정 및 404 오류 해결
- 기본 UI/UX 컴포넌트 (Radix UI + Tailwind)

### 🚧 진행 중인 작업

#### 우선순위 높음 (즉시 착수 필요)
1. **백엔드 인증 시스템 완성**
   - Supabase Auth 완전 연동
   - JWT 토큰 처리
   - 인증 미들웨어 구현

2. **환율 알림 설정 기능 백엔드 구현**
   - 알림 설정 CRUD API 개발
   - 데이터베이스 스키마 적용
   - 알림 조건 검증 로직

3. **이메일 알림 발송 시스템 구현**
   - 백그라운드 환율 모니터링
   - 조건 만족 시 알림 발송
   - 알림 이력 관리

4. **백엔드 배포 완료**
   - Railway/Render 배포 설정
   - 환경 변수 구성
   - 프론트엔드-백엔드 연동

#### 우선순위 중간
5. **환율 차트 기능 추가**
   - Recharts를 이용한 시각화
   - 환율 이력 데이터 표시
   - 인터랙티브 차트 구현

6. **여행 맥락 정보 확장**
   - 더 많은 도시/국가 정보
   - 실시간 물가 정보 연동
   - 카테고리별 물가 정보

7. **UI/UX 개선**
   - 반응형 디자인 최적화
   - 로딩 애니메이션 추가
   - 에러 상태 개선

8. **에러 처리 및 로깅 시스템 개선**
   - 통합 에러 처리
   - 사용자 친화적 에러 메시지
   - 로깅 시스템 구축

#### 우선순위 낮음
9. **데이터베이스 스키마 최적화**
   - 인덱스 최적화
   - 쿼리 성능 개선
   - 데이터 정규화

10. **테스트 코드 작성 및 커버리지 개선**
    - 단위 테스트 작성
    - 통합 테스트 구현
    - E2E 테스트 설정

### 📋 상세 작업 계획

#### Phase 1: 백엔드 핵심 기능 완성 (3-4일)
- [ ] Supabase 데이터베이스 스키마 적용
- [ ] 인증 API 엔드포인트 완성
- [ ] 환율 조회 API 구현
- [ ] 알림 설정 CRUD API 개발
- [ ] 이메일 알림 서비스 구현

#### Phase 2: 배포 및 연동 (1-2일)
- [ ] 백엔드 배포 (Railway/Render)
- [ ] 프론트엔드-백엔드 API 연동
- [ ] 환경 변수 설정 및 보안 강화
- [ ] 통합 테스트 수행

#### Phase 3: 기능 확장 (2-3일)
- [ ] 환율 차트 구현
- [ ] 여행 맥락 정보 확장
- [ ] UI/UX 개선 및 애니메이션
- [ ] 에러 처리 개선

#### Phase 4: 최적화 및 안정화 (1-2일)
- [ ] 성능 최적화
- [ ] 테스트 코드 작성
- [ ] 문서화 완성
- [ ] 보안 검토

### 🔧 기술적 고려사항
- **백엔드 우선**: 현재 프론트엔드는 완성되었지만 실제 데이터를 받아올 백엔드 API가 필요
- **인증 시스템**: Supabase Auth와 FastAPI JWT 통합 필요
- **알림 시스템**: 백그라운드 작업을 위한 스케줄러 구현 필요
- **배포 전략**: 백엔드 배포 완료 후 프론트엔드 API 엔드포인트 수정 필요

## 다음 단계 (MVP 이후)
1. YouTube API 연동
2. Google Places API 연동
3. 푸시 알림 추가
4. 환율 예측 기능
5. 여행 상품 제휴

---

이 명세서를 기반으로 Claude Code에서 단계별 개발을 진행해주세요.