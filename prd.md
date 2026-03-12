# Pocket - 개인 재무 관리 프로그램 PRD

## 1. 프로젝트 개요

### 1.1 목적
개인의 수입/지출, 부채, 주식을 통합적으로 관리할 수 있는 가계부 애플리케이션

### 1.2 목표
- 월별 수입/지출 현황을 한눈에 파악
- 부채 관리를 통한 재무 상태 추적
- 보유 주식의 실시간 손익 확인
- 장기적인 재무 상태 분석을 위한 통계 제공

---

## 2. 핵심 기능

### 2.1 가계부 관리

#### 2.1.1 고정 비용 관리
**기능 설명**
- 매월 정기적으로 발생하는 고정 지출 항목을 사전에 등록하고 관리

**주요 기능**
- 고정 지출 항목 등록 (항목명, 금액, 출금일)
- 항목별 출금 완료 체크 기능
- 미출금 항목 확인 기능
- 고정 지출 항목 수정/삭제

**예시**
- 월세, 관리비, 통신비, 보험료, 구독 서비스 등

#### 2.1.2 변동 비용 관리
**기능 설명**
- 카드 사용 등 변동적으로 발생하는 지출 관리

**주요 기능**
- 예정 지출 항목 등록 (항목명, 금액, 예정일)
- 출금 완료 체크 기능
- 변동 지출 항목 추가/수정/삭제

**예시**
- 카드 결제액, 일회성 지출 등

#### 2.1.3 수입 관리
**기능 설명**
- 월급, 부수입 등 수입 내역 관리

**주요 기능**
- 수입 항목 등록 (항목명, 금액, 입금일)
- 입금 완료 체크 기능
- 수입 항목 추가/수정/삭제

#### 2.1.4 월별 수지 계산
**기능 설명**
- 해당 월의 총 수입과 총 지출을 계산하여 수지 현황 표시

**표시 항목**
- 총 수입
- 총 지출 (고정 비용 + 변동 비용)
- 수지 (수입 - 지출)
- 잔액 상태 표시 (흑자/적자)

#### 2.1.5 월간 데이터 복사 (확정 버튼) 🆕
**기능 설명**
- 수동으로 현재 달 데이터를 다음 달로 복사

**주요 기능**
- 월 선택 옆 **"확정" 버튼** 클릭 시 실행
- **덮어쓰기 방식**: 다음 달 기존 데이터 삭제 후 현재 달 데이터 복사
- 복사 규칙:
  - 수입: 항목 복사, 금액 0원
  - 고정지출: 항목 복사, 금액 복사
  - 변동지출: 항목 복사, 금액 0원
- 날짜 유효성 자동 체크 (예: 1/30 → 2/28로 조정)
- 확인 팝업으로 실수 방지

#### 2.1.5 통계 기능
**기능 설명**
- 월별 수입/지출 추이를 시각적으로 표시

**주요 기능**
- 월별 수입/지출 그래프
- 월별 수지 추이 차트
- 지출 카테고리별 비중 (선택)
- 기간별 비교 (3개월, 6개월, 1년)

---

### 2.2 자산 관리 (CMA)

#### 2.2.1 CMA 통장 입출금 관리
**기능 설명**
- CMA 통장의 입금/출금 내역을 기록하고 잔액을 추적

**주요 기능**
- 입금 내역 등록 (날짜, 금액, 내용/메모)
- 출금 내역 등록 (날짜, 금액, 내용/메모)
- 현재 잔액 자동 계산 및 표시
- 입출금 내역 수정/삭제
- 잔액 추이 차트 (AreaChart)

**표시 항목**
- 총 입금액
- 총 출금액
- 현재 잔액 (입금 - 출금)
- 거래 내역 리스트 (시간순)
- 잔액 추이 그래프

---

### 2.3 부채 관리

#### 2.3.1 마이너스 통장 관리
**기능 설명**
- 마이너스 통장의 대출/상환 내역을 기록하고 잔액을 추적

**주요 기능**
- 대출 내역 등록
  - 날짜
  - 금액
  - 내용/메모
- 상환 내역 등록
  - 날짜
  - 금액
  - 내용/메모
- 현재 잔액 자동 계산 및 표시
- 대출/상환 내역 수정/삭제

**표시 항목**
- 총 대출액
- 총 상환액
- 현재 부채 잔액
- 거래 내역 리스트 (시간순)

#### 2.3.2 부채 통계
**기능 설명**
- 부채 추이를 시각적으로 표시

**주요 기능**
- 월별 부채 잔액 추이 그래프
- 월별 대출/상환 금액 비교
- 기간별 부채 증감 분석

---

### 2.4 주식 관리

#### 2.4.1 보유 주식 관리
**기능 설명**
- 보유 중인 주식 정보를 입력하고 현재 손익을 확인
- **국장(한국)과 미장(미국) 동시 지원**

**주요 기능**
- 주식 정보 등록
  - 시장 구분 (🇰🇷 국장 / 🇺🇸 미장)
  - **국장**: 기업명 (종목코드) - 예: 삼성전자 (005930)
  - **미장**: 기업명 (티커) - 예: Apple (AAPL)
  - 보유 수량
  - 평균 매수가(평단가)
  - 통화 (KRW/USD)
- 주식 정보 수정
  - 추가 매수 시 평단가 자동 계산
  - 일부 매도 시 수량/평단가 조정
- 주식 정보 삭제

#### 2.4.2 손익 계산
**기능 설명**
- 현재가와 평단가를 비교하여 평가 손익 표시
- 국장과 미장 주식을 통합하여 포트폴리오 관리

**표시 항목**
- 종목별 정보
  - 시장 구분 (🇰🇷/🇺🇸)
  - **종목 표시**
    - 국장: 기업명 (종목코드) - 예: 삼성전자 (005930)
    - 미장: 기업명 (티커) - 예: Apple (AAPL)
  - 보유 수량
  - 평균 매수가 (원화 또는 달러)
  - 현재가 (자동 조회, 원화 또는 달러)
  - **개별 종목은 원래 통화로 표시**
    - 국장: 원화 (₩)
    - 미장: 달러 ($)
  - 평가 금액 (원화 또는 달러)
  - 손익 금액 (원화 또는 달러)
  - 손익률 (%)
  - 손익 상태 표시 (플러스/마이너스)
- 전체 포트폴리오 요약 (통합)
  - **모든 금액 원화로 통합 표시**
  - 국장 총 투자금액 (원화)
  - 미장 총 투자금액 (달러 → 원화 환산)
  - 총 투자금액 (원화 통합)
  - 총 평가금액 (원화 통합)
  - 총 손익 (원화 통합)
  - 수익률 (%)
- 데이터 상태
  - 마지막 업데이트 시간
  - 현재 환율 (1 USD = xxx KRW)
  - 새로고침 버튼

**현재가 자동 조회**
- **야후 파이낸스 (Yahoo Finance) 통합**
  - 국장/미장 모두 지원 (하나의 소스로 통합)
  - 방식: 웹 크롤링
  - 데이터: 15-20분 지연 (무료 서비스 한계)
  - 인증: 불필요
  - **국장 (한국 주식)**
    - API 형식: 종목코드.KS (KOSPI), 종목코드.KQ (KOSDAQ)
    - 화면 표시: 기업명 (종목코드)
    - 예시: 삼성전자 (005930), 카카오 (035720)
  - **미장 (미국 주식)**
    - API 형식: 티커 심볼
    - 화면 표시: 기업명 (티커)
    - 예시: Apple (AAPL), Tesla (TSLA), NVIDIA (NVDA)
- **환율 정보**
  - USD/KRW 환율 자동 조회 (야후 파이낸스 또는 환율 API)
  - 개별 종목: 원래 통화로 표시 (국장-원화, 미장-달러)
  - 통합 포트폴리오 요약: 모두 원화로 환산하여 표시
- **자동 새로고침**
  - 페이지 접속 시마다 최신 데이터 조회
  - 선택적 자동 새로고침 (1분, 5분, 10분 간격)
  - 수동 새로고침 버튼 제공
  - 장 운영 시간 표시 (현재 장 중인지 확인)

---

## 3. 화면 구성 (예상)

### 3.1 메인 화면
- 월별 가계부 요약
- 부채 현황 요약
- 주식 포트폴리오 요약

### 3.2 자산 관리
- CMA 입출금 내역 리스트
- 입금/출금 구분 표시
- 현재 잔액 표시
- 잔액 추이 차트 (AreaChart)

### 3.3 가계부 상세
- 수입 목록
- 고정 지출 목록
- 변동 지출 목록
- 월별 수지 계산 결과

### 3.4 가계부 통계
- 월별 수입/지출 그래프
- 수지 추이 차트

### 3.5 부채 관리
- 대출/상환 내역 리스트
- 현재 잔액 표시
- 부채 통계 그래프

### 3.6 주식 관리
- 시장별 탭 (국장/미장)
- 보유 주식 목록
  - **국장**: 삼성전자 (005930), NAVER (035420) 등 → 원화(₩) 표시
  - **미장**: Apple (AAPL), Tesla (TSLA) 등 → 달러($) 표시
  - 시장 구분 표시 (🇰🇷/🇺🇸)
  - 각 종목은 원래 통화로 표시
- 종목별 손익 현황 (현재가 표시)
- 전체 포트폴리오 요약
  - 시장별 소계 (국장-원화, 미장-달러)
  - **통합 합계 (모두 원화로 환산)**
- 환율 정보 표시 (1 USD = xxx KRW)
- 새로고침 버튼 (수동 업데이트)
- 마지막 업데이트 시간 표시
- 자동 새로고침 설정 (선택)

---

## 4. 프로젝트 파일 구조 및 메뉴 매핑

### 4.1 라우팅 구조

| 경로 | 페이지 | 메뉴명 | 인증 필요 |
|------|--------|--------|-----------|
| `/login` | Login.jsx | 로그인 | X |
| `/` | Dashboard.jsx | 대시보드 | O |
| `/budget` | Budget.jsx | 가계부 | O |
| `/asset` | Asset.jsx | 자산 관리 | O |
| `/debt` | Debt.jsx | 부채 관리 | O |
| `/stock` | Stock.jsx | 주식 관리 | O |
| `/settings` | Settings.jsx | 설정 | O |

### 4.2 파일-메뉴 매핑 트리

```
src/
├── main.jsx                          # 앱 진입점 (ReactDOM, Provider 래핑)
├── App.jsx                           # 라우팅 설정 (Routes, PrivateRoute)
│
├── components/
│   └── Layout.jsx                    # [공통] 사이드바 네비게이션 + 레이아웃 + 로그아웃
│
├── context/
│   ├── AuthContext.jsx               # [인증] Supabase Auth, signIn/signOut 상태 관리
│   └── SettingsContext.jsx           # [설정] 다크모드, 시작 페이지, 예산 목표
│
├── pages/
│   ├── Login.jsx                     # [인증] /login - 이메일/비밀번호 로그인
│   ├── Dashboard.jsx                 # [대시보드] / - 수입·지출·자산·부채·주식 요약, 차트
│   ├── Budget.jsx                    # [가계부] /budget - 수입/고정지출/변동지출 CRUD, 월별 관리
│   ├── Asset.jsx                     # [자산관리] /asset - CMA 입출금 CRUD, 잔액 추이 차트
│   ├── Debt.jsx                      # [부채관리] /debt - 대출/상환 CRUD, 잔액 추이, 상환률
│   ├── Stock.jsx                     # [주식관리] /stock - 국장/미장 포트폴리오, 실시간 가격
│   └── Settings.jsx                  # [설정] /settings - 계정, 백업/복구, 다크모드, 시작 페이지
│
├── services/
│   ├── transactionService.js         # [가계부] Supabase CRUD + 마이그레이션
│   ├── assetService.js               # [자산관리] Supabase CRUD + 마이그레이션
│   ├── debtService.js                # [부채관리] Supabase CRUD + 마이그레이션
│   ├── stockService.js               # [주식관리] Supabase CRUD + 순서 변경 + 마이그레이션
│   ├── backupService.js              # [설정] 전체 데이터 JSON 백업/복구
│   └── yahooFinance.js               # [주식관리] 야후 파이낸스 현재가, 환율, 차트 데이터
│
├── data/
│   └── dummyData.js                  # [공통] 유틸 함수 (formatCurrency, formatPercent 등)
│
├── lib/
│   └── supabase.js                   # [공통] Supabase 클라이언트 설정 + 연결 테스트
│
└── styles/
    └── index.css                     # [공통] 전역 CSS 스타일

api/
└── yahoo-finance.js                  # [주식관리] Vercel Serverless Function (야후 API 프록시)
```

### 4.3 메뉴별 관련 파일 요약

| 메뉴 | 페이지 | 서비스 | 컨텍스트 |
|------|--------|--------|----------|
| 대시보드 | Dashboard.jsx | transactionService, assetService, debtService, stockService, yahooFinance | SettingsContext |
| 가계부 | Budget.jsx | transactionService | SettingsContext |
| 자산 관리 | Asset.jsx | assetService | - |
| 부채 관리 | Debt.jsx | debtService | - |
| 주식 관리 | Stock.jsx | stockService, yahooFinance | SettingsContext |
| 설정 | Settings.jsx | backupService | AuthContext, SettingsContext |
| 로그인 | Login.jsx | - | AuthContext |
| 공통 레이아웃 | Layout.jsx | - | AuthContext, SettingsContext |

---

## 5. 데이터 관리

### 5.1 데이터 항목
- 가계부 데이터 (월별)
- 자산(CMA) 입출금 내역
- 부채 거래 내역
- 주식 보유 정보
  - 시장 구분 (KR/US)
  - 기업명
  - 종목코드/티커 (국장: 005930, 미장: AAPL)
  - 보유 수량
  - 평균 매수가
  - 통화 (KRW/USD)
- 주식 거래 내역 (선택)

### 5.2 저장 방식

#### 클라우드 데이터베이스 (Supabase)
- 어디서나 접근 가능
- 자동 백업
- 실시간 동기화
- 무료 플랜 사용 (개인 사용 충분)
- PostgreSQL 기반

#### 인증 시스템 (Supabase Auth)
- 로그인/회원가입
- 개인 데이터 보호
- Row Level Security (사용자별 데이터 격리)

---

#### 저장되는 데이터 (Supabase DB)

**1. 가계부 데이터**
- 수입 내역 (항목명, 금액, 입금일, 입금 완료 여부)
- 고정 지출 내역 (항목명, 금액, 출금일, 출금 완료 여부)
- 변동 지출 내역 (항목명, 금액, 예정일, 출금 완료 여부)
- 월별 데이터 구분

**2. 자산(CMA) 데이터**
- 입금 내역 (날짜, 금액, 내용)
- 출금 내역 (날짜, 금액, 내용)

**3. 부채 관리 데이터**
- 대출 내역 (날짜, 금액, 내용)
- 상환 내역 (날짜, 금액, 내용)

**4. 주식 보유 정보**
- 시장 구분 (KR/US)
- 기업명 (예: 삼성전자, Apple)
- 종목코드/티커 (예: 005930, AAPL)
- 보유 수량
- 평균 매수가
- 통화 (KRW/USD)
- 매수일 (선택)

**5. 사용자 정보**
- 사용자 ID (Supabase Auth)
- 설정 정보 (테마, 자동 새로고침 등)

---

#### 저장되지 않는 데이터 (실시간 조회)

**주식 현재가 정보**
- 현재가 → 야후 파이낸스에서 매번 조회
- 평가금액 → 현재가 × 보유 수량 (계산)
- 손익 금액 → (현재가 - 평균 매수가) × 수량 (계산)
- 손익률 → ((현재가 - 평균 매수가) / 평균 매수가) × 100 (계산)
- **개별 종목은 원래 통화로 표시**

**환율 정보**
- USD/KRW 환율 → 매번 조회
- **통합 포트폴리오 요약에만 환율 적용**
  - 국장 총액 (원화) + 미장 총액 (달러 → 원화 환산)
  - 전체 포트폴리오를 원화로 통합 표시

**이유:**
- 항상 최신 정보 제공
- 저장 공간 절약
- 불필요한 히스토리 데이터 없음
- 개별 종목은 원래 통화로 보는게 더 직관적

---

#### 예상 데이터베이스 테이블 구조

**transactions (가계부)**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- type: VARCHAR (income/fixed/variable)
- name: VARCHAR (항목명)
- amount: DECIMAL (금액)
- date: DATE (날짜)
- is_completed: BOOLEAN (완료 여부)
- month: VARCHAR (월 구분, 예: 2025-01)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**assets (자산 관리)**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- type: VARCHAR (deposit/withdrawal)
- amount: DECIMAL (금액)
- date: DATE (날짜)
- description: TEXT (내용/메모)
- created_at: TIMESTAMP
```

**debts (부채 관리)**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- type: VARCHAR (borrow/repay)
- amount: DECIMAL (금액)
- description: TEXT (내용)
- date: DATE (날짜)
- created_at: TIMESTAMP
```

**stocks (주식 보유)**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- market: VARCHAR (KR/US)
- stock_name: VARCHAR (기업명)
- stock_code: VARCHAR (종목코드/티커)
- quantity: INTEGER (보유 수량)
- avg_price: DECIMAL (평균 매수가)
- currency: VARCHAR (KRW/USD)
- purchase_date: DATE (매수일, 선택)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**settings (사용자 설정)**
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- theme: VARCHAR (light/dark)
- auto_refresh_interval: INTEGER (자동 새로고침 간격, 초)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## 6. 개발 우선순위

### Phase 1 (MVP) ✅ 완료
1. ✅ 가계부 기본 기능 (수입/지출 등록, 출금 체크, 월별 수지 계산)
2. ✅ 자산 관리 기본 기능 (CMA 입출금 관리, 잔액 추이)
3. ✅ 부채 관리 기본 기능 (대출/상환 내역 등록, 잔액 계산)
4. ✅ 주식 관리 기본 기능
   - 보유 주식 등록 (국장/미장 구분)
   - 현재가 자동 조회 (야후 파이낸스)
   - 손익 계산 및 표시 (개별 종목: 원래 통화, 통합: 원화)
   - 환율 정보 조회 (USD/KRW)
5. ✅ Supabase 연동 (전체 CRUD)
6. ✅ 로그인 기능 (Supabase Auth)

### Phase 2 ✅ 완료 (2026-01-01)
1. ✅ UI/UX 개선 (반응형 디자인, 모달 최적화, 카드 뷰)
2. ✅ 데이터 백업/복구 기능 (JSON 내보내기/가져오기)
3. ✅ Vercel 배포 (CI/CD, Serverless Functions)

### Phase 3 (진행 예정)
1. 통계 기능 추가 (월별 수입/지출 그래프, 카테고리 분석)
2. 주식 자동 새로고침 기능 (1분/5분/10분 간격)
3. 예산 설정 및 알림 기능

### Phase 4 (향후)
1. 주식 고급 기능 (실시간 연동, 거래 내역, 배당금, 알림)
2. 지출 카테고리 분석
3. 다중 계좌 관리

---

## 7. 기술 스택

### 프론트엔드
- **React 18** + **Vite 5** (웹 애플리케이션)
- HTML5, CSS3, JavaScript (ES Modules)
- 주요 라이브러리:
  - `react-router-dom` v6 - SPA 라우팅
  - `recharts` v2 - 차트/그래프
  - `lucide-react` - 아이콘
  - `@supabase/supabase-js` v2 - Supabase 클라이언트

### 백엔드 & 데이터베이스
- **Supabase** (BaaS - Backend as a Service)
  - PostgreSQL 데이터베이스
  - RESTful API 자동 생성
  - 실시간 구독 기능
  - Row Level Security (데이터 보안)

### 인증
- **Supabase Auth** (간단한 인증) ← 2026-01-01 완료!
  - 이메일/비밀번호 로그인만 사용
  - 개인 사용 목적 (단일 계정)
  - 회원가입 없이 Supabase 대시보드에서 계정 생성
  - PrivateRoute로 인증된 사용자만 접근 가능

### 호스팅 & 배포
- **Vercel** (프론트엔드 호스팅) ← 2026-01-01 배포 완료!
  - GitHub 연동 자동 배포 (CI/CD)
  - 무료 HTTPS
  - 글로벌 CDN
  - Edge Functions 지원
  - 도메인: https://pocket-silk.vercel.app
  - `git push` → 자동 빌드/배포
  - Netlify 크레딧 소진으로 Vercel로 전환

### 외부 API
- **야후 파이낸스 (Yahoo Finance)** (국장/미장 주식 현재가 - 웹 크롤링)
  - 국장: 종목코드.KS / 종목코드.KQ → 화면: 기업명 (종목코드) - 원화 표시
  - 미장: 티커 심볼 → 화면: 기업명 (티커) - 달러 표시
  - 환율 정보 포함 (USD/KRW)
    - 통합 포트폴리오 요약에만 적용
  - **Vercel Functions** 사용 (CORS 우회, 서버리스)
    - 로컬: Vite 프록시 (`/api/yahoo`)
    - 프로덕션: Vercel Functions (`/api/yahoo-finance`)
  - **KOSPI/KOSDAQ 자동 판별** 🆕
    - `.KS` (KOSPI) 먼저 시도, 404 시 `.KQ` (KOSDAQ)로 재시도
    - ETF(TIGER, KODEX 등)와 코스닥 종목 모두 자동 처리

### 비용
- **완전 무료** ✅
  - Supabase 무료 플랜 (500MB DB, 충분)
  - Vercel 무료 플랜
  - GitHub 무료

---

## 8. 비기능적 요구사항

### 8.1 사용성
- 직관적인 UI
- 빠른 데이터 입력 및 수정
- ✅ **반응형 디자인** (모든 기기에서 최적화) ← **2026-01-01 완료!**
  - ✅ **PC/노트북**: 넓은 화면 활용, 다중 컬럼 레이아웃
  - ✅ **모바일**: 세로 스크롤 최적화, 터치 친화적 UI
    - 주식 목록: 테이블 → 카드 뷰 전환
    - 모달: 전체 화면 너비 사용, 버튼 크기 최적화
    - 네비게이션: 햄버거 메뉴
  - ✅ 화면 크기에 따라 자동으로 레이아웃 변경

### 8.2 보안
- 개인 재무 정보 보호
- Supabase Row Level Security (사용자별 데이터 격리)
- HTTPS 암호화 통신
- 인증된 사용자만 접근

### 8.3 성능
- 빠른 로딩 속도
- 원활한 데이터 조회
- 효율적인 주식 현재가 업데이트

### 8.4 접근성
- 어디서나 접근 가능 (인터넷 연결 필요)
- 여러 기기에서 동일한 데이터 확인 가능
- 자동 백업 및 데이터 손실 방지

---

## 9. 향후 고려사항

### 가계부
- 다중 계좌 관리
- 카테고리별 예산 설정
- 정기 지출 자동 등록
- 영수증 사진 첨부
- 가족 구성원 공유 기능
- 금융 목표 설정 및 추적
- 은행/카드사 API 연동 자동 동기화

### 주식
- **다른 시장 지원 (Phase 3 이후)**
  - 야후 파이낸스로 전 세계 거래소 지원 가능
  - 추가 가능 시장:
    - 🇯🇵 일본 (도쿄증권거래소) - 접미사 .T
    - 🇨🇳 중국 (상하이/심천) - 접미사 .SS / .SZ
    - 🇭🇰 홍콩 - 접미사 .HK
    - 🇬🇧 영국 (런던) - 접미사 .L
    - 🇩🇪 독일 (프랑크푸르트) - 접미사 .DE
    - 🇫🇷 프랑스 (파리) - 접미사 .PA
    - 기타 주요 거래소
  - 구현 난이도: 낮음 (접미사만 추가, 코드 거의 동일)
  - 환율 처리 필요 (JPY, CNY, EUR, GBP 등)
- 주식 알림 기능 (목표가 도달 시)
- 포트폴리오 백테스팅
- 차트 및 기술적 분석 기능
- 증권사 API 연동 (실시간 체결가 15-20분 → 1초 이내)
- 한국 주식 상세 정보 (네이버 금융 추가 크롤링)

---

## 10. 개발 가이드 (초보자용)

> **주의**: 이 프로젝트는 개발 지식이 없는 사용자를 위해 작성되었습니다.
> 모든 단계를 천천히, 자세하게 설명합니다.

### 10.1 개발 전 준비사항

#### 필요한 계정 및 도구

1. **GitHub 계정** (코드 저장소)
   - 가입: https://github.com
   - 무료

2. **Vercel 계정** (웹 호스팅)
   - 가입: https://vercel.com
   - GitHub 계정으로 로그인 가능
   - 무료

3. **Supabase 계정** (데이터베이스)
   - 가입: https://supabase.com
   - GitHub 계정으로 로그인 가능
   - 무료

4. **Cursor** (AI 코드 편집기)
   - https://cursor.sh
   - AI 코딩 도우미 (Claude/GPT 통합)
   - 무료 (이미 설치되어 있음)

5. **Node.js 설치** (개발 환경)
   - 다운로드: https://nodejs.org
   - LTS 버전 설치 (장기 지원 버전)
   - 무료

6. **Git 설치** (버전 관리)
   - 다운로드: https://git-scm.com
   - 무료

---

#### 환경 설정 확인 방법

터미널에서 다음 명령어로 설치 확인:

```bash
# Git 설치 확인
git --version

# Node.js 설치 확인
node --version

# npm 설치 확인
npm --version

# GitHub 계정 설정 확인
git config --global user.name
git config --global user.email
```

**설치가 안 되어 있다면:**
- Git: https://git-scm.com/download/win
- Node.js: https://nodejs.org (LTS 버전)
- GitHub 계정 설정:
  ```bash
  git config --global user.name "본인GitHub아이디"
  git config --global user.email "본인이메일"
  ```

---

#### 여러 PC에서 작업하는 경우

**집과 회사 등 여러 PC에서 작업할 때:**

1. **각 PC마다 동일하게 설치**
   - Git, Node.js, Cursor
   - GitHub 계정 설정 (`git config`)

2. **작업 흐름**
   - PC A에서 작업 → `git push` (GitHub에 저장)
   - PC B로 이동 → `git pull` (최신 코드 가져오기) → 작업 → `git push`
   - PC A로 돌아옴 → `git pull` → 작업 계속

3. **주의사항**
   - 작업 시작 전: 항상 `git pull`
   - 작업 끝날 때: 항상 `git push`
   - 동시에 여러 PC에서 같은 파일 수정 금지

4. **환경변수 파일 (`.env`)**
   - GitHub에 올라가지 않음
   - 각 PC마다 수동으로 생성 필요
   - Supabase API 키 등 민감 정보 포함

**자세한 내용은 `home.md` 파일 참고**

---

### 10.2 개발 순서 (단계별)

#### Phase 1: 환경 설정 ✅ 완료!
1. ✅ 모든 계정 가입 및 로그인
2. ✅ Node.js, Git 설치 (Cursor는 이미 설치됨)
3. ✅ GitHub에 새 저장소 생성
4. ✅ Supabase 프로젝트 생성
5. ✅ `.env` 파일 생성 및 설정

#### Phase 2: 프로젝트 초기 설정 ✅ 완료!
1. ✅ React 프로젝트 생성 (Vite 사용)
2. ✅ 라이브러리 설치 (Supabase, React Router, Recharts, Lucide)
3. ✅ 기본 레이아웃 및 네비게이션 구성
4. ✅ 더미 데이터로 UI 구현
5. ✅ 로컬 개발 서버 실행 확인

#### Phase 3: 전체 기능 개발 + UI/UX ✅ 완료!
1. ✅ 대시보드 페이지 (요약 카드, 차트, 최근 활동)
2. ✅ 가계부 페이지 (3열 레이아웃: 수입/고정지출/변동지출, Supabase CRUD)
3. ✅ 자산 관리 페이지 (CMA 입출금, 잔액 추이 차트)
4. ✅ 부채 관리 페이지 (대출/상환, 잔액 추이 차트)
5. ✅ 주식 관리 페이지 (국장/미장 탭, 야후 파이낸스 연동, 포트폴리오)
6. ✅ 설정 페이지 (계정, 백업/복구, 다크모드, 시작 페이지)
7. ✅ Supabase 연동 (전체 테이블 CRUD) ← **2025-12-31 완료!**
8. ✅ 로그인 기능 구현 (Supabase Auth) ← **2026-01-01 완료!**

#### Phase 4: UI/UX 개선 + 배포 ✅ 완료! (2026-01-01)
1. ✅ 반응형 디자인 적용 (PC/모바일)
2. ✅ 모바일 최적화 (모달, 카드 뷰, 금액 버튼)
3. ✅ 데이터 백업/복구 기능 (JSON 내보내기/가져오기)
4. ✅ Vercel 배포 (Netlify에서 전환)
5. ✅ Vercel Functions 설정 (야후 파이낸스 프록시)
6. ✅ 환경변수 설정, SPA 라우팅 (vercel.json)
7. ✅ 도메인: https://pocket-silk.vercel.app

#### Phase 5: 통계 및 고급 기능 (진행 예정)
1. 월별 수입/지출 통계 그래프
2. 부채 추이 그래프
3. 주식 자동 새로고침 기능
4. 예산 설정 및 알림 기능

---

### 10.3 개발 시 주의사항

#### 초보자를 위한 팁
1. **한 번에 하나씩**
   - 모든 기능을 동시에 만들지 말고 하나씩 완성
   - 작은 기능부터 시작 (예: 로그인 → 수입 입력)

2. **자주 저장하고 테스트**
   - 코드 수정 후 바로 테스트
   - GitHub에 자주 업로드 (백업 목적)

3. **에러 메시지 읽기**
   - 에러가 나면 당황하지 말기
   - 에러 메시지를 복사해서 구글 검색
   - ChatGPT나 Claude에게 물어보기

4. **주석 달기**
   - 코드에 한글로 설명 추가
   - 나중에 다시 봐도 이해할 수 있게

5. **백업**
   - GitHub에 정기적으로 업로드
   - 로컬에도 백업 폴더 생성

---

### 10.4 도움받을 수 있는 곳

1. **공식 문서**
   - React: https://react.dev
   - Supabase: https://supabase.com/docs
   - Vercel: https://vercel.com/docs

2. **커뮤니티**
   - Stack Overflow (영어)
   - 생활코딩 (한국어)
   - 인프런, 노마드코더 (한국어 강의)

3. **AI 도우미**
   - ChatGPT, Claude (코드 질문)
   - GitHub Copilot (코드 자동 완성)

---

### 10.5 단계별 체크리스트

#### ✅ 환경 설정 (PC마다 확인)

**현재 PC:**
- [x] GitHub 계정 생성 및 로그인 ✅
- [ ] Vercel 계정 생성
- [x] Supabase 계정 생성 ✅
- [x] Cursor 설치 ✅
- [x] Node.js 설치 ✅
- [x] Git 설치 ✅
- [x] Git 계정 설정 (`git config`) ✅

**집 또는 회사의 다른 PC:**
- [ ] Cursor 설치
- [ ] Node.js 설치
- [ ] Git 설치
- [ ] Git 계정 설정 (`git config`)
- [ ] GitHub에 로그인
- [ ] 프로젝트 `git clone`
- [ ] `.env` 파일 생성

#### ✅ 프로젝트 시작
- [x] GitHub 저장소 생성 ✅ (https://github.com/chajunghun83/Pocket)
- [x] 로컬 Git 저장소 초기화 ✅
- [x] PRD 및 문서 GitHub 업로드 ✅
- [x] Supabase 프로젝트 생성 ✅ (https://gzxbckioutctwxbevqmk.supabase.co)
- [x] `.env` 파일 생성 및 Supabase 연결 정보 설정 ✅
- [x] React 프로젝트 생성 ✅ (Vite + React)
- [x] 로컬에서 실행 확인 ✅ (http://localhost:3000)

#### ✅ UI 개발 (더미 데이터)
- [x] 대시보드 페이지 ✅
- [x] 가계부 페이지 ✅ (3열 레이아웃)
- [x] 자산 관리 페이지 ✅ (CMA 입출금)
- [x] 부채 관리 페이지 ✅
- [x] 주식 관리 페이지 ✅
- [x] 설정 페이지 ✅

#### ✅ Supabase 연동 (2025-12-31 완료!)
- [x] Supabase 클라이언트 설정 ✅
- [x] 가계부 CRUD ✅ (transactionService.js)
- [x] 자산관리 CRUD ✅ (assetService.js)
- [x] 부채관리 CRUD ✅ (debtService.js)
- [x] 주식관리 CRUD ✅ (stockService.js)
- [x] 자동 마이그레이션 ✅
- [x] 로그인 기능 ✅ (AuthContext.jsx, Login.jsx) ← **2026-01-01 완료!**

#### ✅ 배포 (2026-01-01 완료!)
- [x] Netlify 배포 성공 ✅ (초기)
- [x] Vercel로 전환 ✅ (Netlify 크레딧 소진)
- [x] GitHub 연동 자동 배포 (CI/CD) ✅
- [x] Vercel Functions 설정 ✅
- [x] 환경변수 설정 ✅
- [x] SPA 라우팅 (vercel.json) ✅
- [x] 웹에서 접속 확인 ✅
- **URL**: https://pocket-silk.vercel.app

---

### 10.6 예상 비용

| 항목 | 비용 |
|------|------|
| GitHub | 무료 |
| Vercel | 무료 |
| Supabase | 무료 |
| 도메인 (선택) | 연간 1-2만원 |
| **총 비용** | **0원** (도메인 제외) |

---

### 10.7 개발 후 유지보수

1. **정기 백업**
   - GitHub에 자동 백업됨
   - Supabase도 자동 백업

2. **업데이트**
   - 기능 추가 시 GitHub에 push
   - Vercel이 자동으로 재배포

3. **문제 발생 시**
   - GitHub 이전 버전으로 되돌리기 가능
   - Supabase 백업에서 데이터 복구 가능

---

### 10.8 도움말

개발 중 막히는 부분이 있으면:
1. 에러 메시지 전체를 복사
2. 어떤 작업을 하다가 에러가 났는지 설명
3. AI에게 질문하거나 커뮤니티에 도움 요청

**걱정하지 마세요!** 
- 천천히 하나씩 따라하면 됩니다
- 모든 단계마다 자세한 가이드를 제공할 예정입니다
- 에러는 누구나 겪습니다 - 당황하지 말고 검색하세요!

