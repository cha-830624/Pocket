# 🗂️ Pocket 프로젝트 구조

> **작성일**: 2026-01-01 (업데이트)  
> **프로젝트**: 개인 자산 관리 앱 (Pocket)  
> **배포 URL**: https://pocket-silk.vercel.app

---

## 📊 메뉴 및 경로 구조

```
Pocket App (https://pocket-silk.vercel.app)
│
├─ 🔐 로그인 (Login) 🆕
│   ├─ 경로: /login
│   ├─ 파일: src/pages/Login.jsx
│   └─ 설명: 이메일/비밀번호 로그인 (Supabase Auth)
│
├─ 🏠 대시보드 (Dashboard) [인증 필요]
│   ├─ 경로: /
│   ├─ 파일: src/pages/Dashboard.jsx
│   └─ 설명: 전체 자산 현황 및 요약 정보
│
├─ 📒 가계부 (Budget) [인증 필요]
│   ├─ 경로: /budget
│   ├─ 파일: src/pages/Budget.jsx
│   └─ 설명: 수입/고정지출/변동지출 관리 (3열 구조)
│
├─ 🏦 자산 관리 (Asset) [인증 필요]
│   ├─ 경로: /asset
│   ├─ 파일: src/pages/Asset.jsx
│   └─ 설명: CMA 통장 입출금 관리
│
├─ 💳 부채 관리 (Debt) [인증 필요]
│   ├─ 경로: /debt
│   ├─ 파일: src/pages/Debt.jsx
│   └─ 설명: 마이너스 통장 대출/상환 추적
│
├─ 📈 주식 관리 (Stock) [인증 필요]
│   ├─ 경로: /stock
│   ├─ 파일: src/pages/Stock.jsx
│   └─ 설명: 보유 주식 및 투자 현황
│
└─ ⚙️ 설정 (Settings) [인증 필요]
    ├─ 경로: /settings
    ├─ 파일: src/pages/Settings.jsx
    └─ 설명: 사용자 설정 및 환경 설정
```

---

## 📁 전체 프로젝트 디렉토리 구조

```
C:\work\Pocket\
│
├─ 📄 설정 파일
│   ├─ .env                    # Supabase 환경변수 (보안 파일)
│   ├─ .gitignore              # Git 제외 파일 목록
│   ├─ env-template.txt        # .env 파일 템플릿
│   ├─ package.json            # 프로젝트 의존성 관리
│   ├─ package-lock.json       # 의존성 버전 잠금
│   ├─ vite.config.js          # Vite 설정 (로컬 프록시)
│   ├─ vercel.json             # Vercel 설정 (SPA 라우팅) 🆕
│   └─ index.html              # HTML 진입점
│
├─ 📚 문서
│   ├─ README.md               # 프로젝트 소개
│   ├─ home.md                 # 환경 설정 체크리스트
│   ├─ prd.md                  # 제품 요구사항 문서
│   ├─ backup_251229.md        # 12/29 백업
│   ├─ backup_251230.md        # 12/30 백업
│   ├─ backup_251231.md        # 12/31 백업 (Supabase 연동)
│   └─ project-structure.md    # 이 문서 (프로젝트 구조)
│
├─ 📂 public\                  # 정적 파일
│   └─ favicon.svg             # 파비콘
│
├─ 📂 supabase\                # Supabase 관련 파일
│   ├─ schema.sql              # 전체 스키마 (RLS 포함)
│   └─ schema-no-auth.sql      # 간소화 스키마 (인증 없음)
│
├─ 📂 api\                     # Vercel Functions 🆕
│   └─ yahoo-finance.js        # Yahoo Finance API 프록시
│
└─ 📂 src\                     # 소스 코드
    │
    ├─ main.jsx                # 앱 진입점 (React 렌더링)
    ├─ App.jsx                 # 라우팅 설정
    │
    ├─ 📂 pages\               # 페이지 컴포넌트
    │   ├─ Login.jsx           # 🔐 로그인 페이지 🆕
    │   ├─ Dashboard.jsx       # 🏠 대시보드 페이지
    │   ├─ Budget.jsx          # 📒 가계부 페이지 (Supabase 연동)
    │   ├─ Asset.jsx           # 🏦 자산 관리 페이지 (Supabase 연동)
    │   ├─ Debt.jsx            # 💳 부채 관리 페이지 (Supabase 연동)
    │   ├─ Stock.jsx           # 📈 주식 관리 페이지 (Supabase 연동)
    │   └─ Settings.jsx        # ⚙️ 설정 페이지
    │
    ├─ 📂 components\          # 재사용 가능한 컴포넌트
    │   └─ Layout.jsx          # 전체 레이아웃 (사이드바 포함)
    │
    ├─ 📂 context\             # React Context
    │   ├─ AuthContext.jsx     # 인증 상태 관리 (Supabase Auth) 🆕
    │   └─ SettingsContext.jsx # 전역 설정 (다크모드, 시작페이지 등)
    │
    ├─ 📂 data\                # 데이터 관리
    │   └─ dummyData.js        # 더미 데이터 (마이그레이션용)
    │
    ├─ 📂 lib\                 # 라이브러리 설정 🆕
    │   └─ supabase.js         # Supabase 클라이언트 초기화
    │
    ├─ 📂 services\            # API 서비스 🆕
    │   ├─ transactionService.js  # 가계부 CRUD (Supabase)
    │   ├─ assetService.js        # 자산관리 CRUD (Supabase)
    │   ├─ debtService.js         # 부채관리 CRUD (Supabase)
    │   ├─ stockService.js        # 주식관리 CRUD (Supabase)
    │   ├─ backupService.js       # 데이터 백업/복구 서비스 🆕
    │   └─ yahooFinance.js        # Yahoo Finance API (주식 현재가)
    │
    └─ 📂 styles\              # 스타일
        └─ index.css           # 전역 스타일
```

---

## 🛣️ 라우팅 흐름

### 1. 진입점 (main.jsx)
```
main.jsx → AuthProvider → SettingsProvider → React Router → App.jsx 로드
```

### 2. 라우팅 (App.jsx)
```jsx
Routes
  ├─ Route path="/login" → Login (로그인 페이지)
  └─ Route path="/" → PrivateRoute → Layout (인증 필요)
      ├─ index → Dashboard (/)
      ├─ budget → Budget (/budget)
      ├─ asset → Asset (/asset)
      ├─ debt → Debt (/debt)
      ├─ stock → Stock (/stock)
      └─ settings → Settings (/settings)
```

### PrivateRoute 동작
```
사용자 접속 → 로그인 상태 확인
  ├─ 로그인 됨 → 해당 페이지 표시
  └─ 로그인 안됨 → /login으로 리다이렉트
```

### 3. 레이아웃 (Layout.jsx)
```
Layout
├─ 사이드바 메뉴 (다크 테마)
│   ├─ 🏠 대시보드 (/)
│   ├─ 📒 가계부 (/budget)
│   ├─ 🏦 자산 관리 (/asset)
│   ├─ 💳 부채 관리 (/debt)
│   ├─ 📈 주식 관리 (/stock)
│   ├─ ⚙️ 설정 (/settings)
│   └─ 🚪 로그아웃 버튼
└─ 메인 콘텐츠 영역 (각 페이지 렌더링)
```

---

## 🔄 데이터 흐름 (Supabase 연동)

```
┌─────────────────────────────────────────────────────────────┐
│                      React 페이지                           │
│  (Budget.jsx, Asset.jsx, Debt.jsx, Stock.jsx)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Services Layer                            │
│  transactionService.js, assetService.js,                   │
│  debtService.js, stockService.js                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Client                            │
│                   (lib/supabase.js)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Cloud Database                        │
│  (PostgreSQL - transactions, assets, debts, stocks)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 주요 라이브러리

| 라이브러리 | 용도 | 버전 |
|-----------|------|------|
| **React** | UI 프레임워크 | ^18.3.1 |
| **React Router** | 페이지 라우팅 | ^7.1.1 |
| **Vite** | 빌드 도구 | ^5.4.21 |
| **Supabase** | 백엔드 (데이터베이스, 인증) | ^2.49.2 |
| **Recharts** | 차트/그래프 | ^2.15.0 |
| **Lucide React** | 아이콘 | ^0.469.0 |

---

## 🔐 환경변수 (.env)

```bash
VITE_SUPABASE_URL=https://gzxbckioutctwxbevqmk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

> **주의**: `.env` 파일은 GitHub에 올라가지 않습니다! (`.gitignore`에 포함됨)

---

## 🎯 현재 상태

- ✅ **Phase 1**: 환경 설정 완료
- ✅ **Phase 2**: React 프로젝트 생성 완료
- ✅ **Phase 3**: UI 개발 완료 (더미 데이터)
- ✅ **Phase 4**: Supabase 연동 완료 ← **2025-12-31 완료!**
- ✅ **Phase 5**: 로그인 기능 완료 ← **2026-01-01 완료!**
- ✅ **Phase 6**: Vercel 배포 완료 ← **2026-01-01 완료!**

### 🌐 배포 정보
| 항목 | 내용 |
|------|------|
| 호스팅 | Vercel (이전: Netlify) |
| URL | https://pocket-silk.vercel.app |
| GitHub | https://github.com/cha-830624/Pocket |
| 자동 배포 | `git push` → 자동 빌드/배포 (CI/CD)
| Functions | Vercel Functions (Yahoo Finance 프록시)

---

## 🚀 개발 서버 실행

```bash
# 패키지 설치 (최초 1회)
npm install

# 개발 서버 시작
npm run dev

# 접속
http://localhost:3000
```

---

## 📝 파일별 주요 기능

### 페이지 컴포넌트

#### 1. Dashboard.jsx (대시보드)
- 기간 선택 탭 (전체/2025/2024)
- 기본 재무: 현금잔액, 수입, 지출, 부채, 저축률
- 투자 자산: 평가금액, 투자원금, 평가손익, 순자산
- 실시간 주식 가격 자동 새로고침 (1분마다)

#### 2. Budget.jsx (가계부) 🆕 Supabase 연동
- **3열 구조**: 수입 | 고정지출 | 변동지출
- 입금일/출금일 컬럼, 비고 상세 팝업
- 예산 목표 진행률 표시
- 월별 선택 기능
- **DB 연결 상태 표시** (DB 연결됨 / 로컬 모드)
- **확정 버튼** 🆕
  - 현재 달 → 다음 달로 수동 복사 (덮어쓰기)
  - 수입: 항목 복사, 금액 0원
  - 고정지출: 항목 복사, 금액 복사
  - 변동지출: 항목 복사, 금액 0원
  - 날짜 유효성 체크 (예: 1/30 → 2/28)

#### 3. Asset.jsx (자산 관리) 🆕 Supabase 연동
- CMA 통장 입출금 관리
- 잔액 추이 차트 (녹색)
- 저축 유지율, 월평균 저축
- 거래 내역 테이블

#### 4. Debt.jsx (부채 관리) 🆕 Supabase 연동
- 마이너스 통장 대출/상환 관리
- 잔액 추이 차트 (빨간색)
- 상환률 진행 표시
- 거래 내역 테이블

#### 5. Stock.jsx (주식 관리) 🆕 Supabase 연동
- 탭 구조: 전체 | 한국 | 미국
- Yahoo Finance 실시간 현재가 조회
- 이동평균선 (5/20/60/120일)
- 차트 기간: 30분/1일/1주/1달
- 포트폴리오 비중 차트
- 줌 인/아웃 기능

#### 6. Settings.jsx (설정)
- 로그인된 사용자 정보 표시
- **데이터 백업/복구** 🆕
  - JSON 파일로 내보내기 (백업)
  - JSON 파일에서 가져오기 (복구)
  - 데이터 통계 표시
- 다크모드 토글
- 시작 페이지 설정
- 주식 기본 탭 설정
- 예산 목표 설정
- 로그아웃 버튼

#### 7. Login.jsx (로그인) 🆕
- 이메일/비밀번호 입력 폼
- Supabase Auth 연동
- 로그인 성공 시 대시보드로 이동
- 에러 메시지 표시

### Context 파일

#### AuthContext.jsx 🆕
- `AuthProvider` - 인증 상태를 전역으로 제공
- `useAuth()` - 인증 관련 Hook
  - `user` - 현재 로그인된 사용자 정보
  - `loading` - 인증 상태 로딩 중
  - `signIn(email, password)` - 로그인
  - `signOut()` - 로그아웃

#### SettingsContext.jsx
- `SettingsProvider` - 설정 상태를 전역으로 제공
- `useSettings()` - 설정 관련 Hook
  - `settings` - 현재 설정 값
  - `updateSetting()` - 설정 변경
  - `toggleDarkMode()` - 다크모드 토글

### 서비스 파일 🆕

#### transactionService.js
- `getTransactions()` - 가계부 조회
- `addTransaction()` - 항목 추가
- `updateTransaction()` - 항목 수정
- `deleteTransaction()` - 항목 삭제
- `toggleCompleted()` - 완료 상태 변경
- `migrateTransactions()` - 초기 데이터 마이그레이션

#### assetService.js
- `getAssets()` - 자산 내역 조회
- `addAsset()` - 입출금 추가
- `updateAsset()` - 내역 수정
- `deleteAsset()` - 내역 삭제
- `migrateAssets()` - 마이그레이션

#### debtService.js
- `getDebts()` - 부채 내역 조회
- `addDebt()` - 대출/상환 추가
- `updateDebt()` - 내역 수정
- `deleteDebt()` - 내역 삭제
- `migrateDebts()` - 마이그레이션

#### stockService.js
- `getStocks()` - 보유 주식 조회
- `addStock()` - 종목 추가
- `updateStock()` - 종목 수정
- `deleteStock()` - 종목 삭제
- `migrateStocks()` - 마이그레이션

#### yahooFinance.js
- `fetchStockPrice()` - 개별 종목 현재가 조회
- `fetchMultipleStockPrices()` - 다중 종목 조회
- `fetchExchangeRate()` - USD/KRW 환율 조회
- `fetchChartData()` - 차트 데이터 조회
- **로컬**: Vite 프록시 (`/api/yahoo`)
- **프로덕션**: Vercel Functions (`/api/yahoo-finance`)
- **KOSPI/KOSDAQ 자동 판별** 🆕
  - 한국 주식: `.KS` (KOSPI) 먼저 시도
  - 404 에러 시 `.KQ` (KOSDAQ)로 자동 재시도
  - ETF, 코스닥 종목 모두 자동 처리

#### backupService.js 🆕
- `exportAllData()` - 모든 테이블 데이터 조회
- `downloadBackup()` - JSON 파일로 다운로드
- `importAllData()` - 백업 파일에서 데이터 복구
- `readBackupFile()` - 파일 읽기 및 파싱
- `getDataStats()` - 데이터 통계 조회

---

## 🔄 Git 작업 흐름

### 작업 시작 전
```bash
git pull  # 최신 코드 가져오기
```

### 작업 완료 후
```bash
git add .
git commit -m "작업 내용 설명"
git push
```

---

## 📞 도움이 필요하면

- **라이브 사이트**: https://pocket-silk.vercel.app
- **GitHub 저장소**: https://github.com/cha-830624/Pocket
- **Supabase 프로젝트**: https://gzxbckioutctwxbevqmk.supabase.co
- **Vercel 대시보드**: https://vercel.com/cha-projects/pocket

---

## 🚀 배포 프로세스

```bash
# 1. 코드 수정 후 커밋
git add .
git commit -m "변경 내용 설명"

# 2. GitHub에 푸시 (자동 배포 트리거)
git push

# 3. Vercel이 자동으로:
#    - 최신 코드 가져오기
#    - npm run build 실행
#    - dist 폴더 배포
#    - Vercel Functions 배포 (api/)
#    - 약 1-2분 후 반영
```

---

**마지막 업데이트**: 2026-01-06

