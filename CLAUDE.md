# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git 작업 규칙 (필수)

- **사용자가 명시적으로 요청할 때만** `git commit`, `git push`를 수행합니다. 작업이 끝나도 자동으로 커밋/푸시하지 마세요.
- 커밋/푸시를 진행할 때는 [docs/History.md](docs/History.md) 파일에 변경 내역을 추가해 최신화한 뒤 함께 커밋합니다(이 갱신을 빠뜨리지 마세요).

## 프로젝트 개요

Pocket은 개인 재무 관리용 React SPA 입니다. 가계부, 자산(CMA), 부채(마이너스 통장), 주식 포트폴리오, 대시보드를 한 곳에서 다룹니다. Supabase(PostgreSQL + Auth)를 백엔드로 사용하며 Vercel에 배포됩니다(라이브 URL: https://pocket-silk.vercel.app).

## 명령어

```bash
npm install        # 최초 1회 의존성 설치
npm run dev        # Vite 개발 서버 (http://localhost:3000, 자동 오픈)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 로컬 미리보기
```

테스트 러너는 설정되어 있지 않습니다(스크립트도 없음). 테스트가 필요해도 사용자가 명시적으로 요청하기 전에 테스트 프레임워크를 도입하지 마세요.

## 환경 설정

- 루트의 `.env` 파일에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 가 필요합니다(템플릿: [env-template.txt](env-template.txt)). 누락 시 [src/lib/supabase.js](src/lib/supabase.js)가 콘솔 에러를 남기고 모든 데이터 페칭이 실패합니다.
- `.env`는 git에 커밋하지 마세요.

## 아키텍처 핵심

### 레이어 구조 (반드시 준수)

```
Pages (src/pages/*.jsx)
   ↓ 호출
Services (src/services/*Service.js)   ← Supabase 접근은 여기서만
   ↓ 사용
Supabase Client (src/lib/supabase.js)
   ↓
Supabase Cloud (PostgreSQL + Auth)
```

페이지 컴포넌트에서 `supabase` 클라이언트를 직접 import 하지 말고, 항상 도메인별 서비스(`transactionService`, `assetService`, `debtService`, `stockService`, `backupService`, `yahooFinance`)를 통과시킵니다. 새 도메인 데이터를 추가할 때도 같은 패턴을 따르세요.

### 라우팅과 인증

- 진입점: [src/main.jsx](src/main.jsx) → `AuthProvider` → `SettingsProvider` → React Router → [src/App.jsx](src/App.jsx).
- [src/App.jsx](src/App.jsx)의 `PrivateRoute`가 `/login`을 제외한 모든 라우트를 보호합니다. 신규 페이지는 `Layout` 자식 라우트로 추가하면 자동으로 인증 가드와 사이드바를 상속합니다.
- 인증 상태는 [src/context/AuthContext.jsx](src/context/AuthContext.jsx)의 `useAuth()` 훅으로 사용. 전역 UI 설정(다크모드, 시작 페이지, 주식 기본 탭, 예산 목표 등)은 [src/context/SettingsContext.jsx](src/context/SettingsContext.jsx)의 `useSettings()`.

### Yahoo Finance 프록시 (CORS 우회 — 환경별로 경로가 다름)

[src/services/yahooFinance.js](src/services/yahooFinance.js)는 두 환경에서 다른 엔드포인트를 사용합니다:
- 로컬: [vite.config.js](vite.config.js)의 `/api/yahoo` 프록시 → `query1.finance.yahoo.com`
- 프로덕션: Vercel Function [api/yahoo-finance.js](api/yahoo-finance.js)

한국 종목은 `.KS`(KOSPI) 우선 시도 후 404 시 `.KQ`(KOSDAQ)로 자동 폴백합니다. 종목 코드 처리 로직을 손볼 때 이 폴백을 깨뜨리지 않도록 주의하세요.

### Supabase 스키마

DDL은 [supabase/schema.sql](supabase/schema.sql) (RLS 포함, 운영용)과 [supabase/schema-no-auth.sql](supabase/schema-no-auth.sql) (간소화). 테이블 구조 변경 시 두 파일을 함께 갱신하세요. RLS 정책이 활성화되어 있으므로 신규 테이블에는 적절한 정책을 함께 작성해야 데이터 접근이 가능합니다.

### 상태/데이터 일관성

- 가계부의 "확정" 버튼은 현재 달 데이터를 다음 달로 복사합니다(수입/변동지출은 항목만, 고정지출은 금액까지). 날짜 유효성(예: 1/30 → 2/28) 처리가 들어 있으니 [src/pages/Budget.jsx](src/pages/Budget.jsx) 수정 시 이 규칙을 보존하세요.
- 대시보드는 1분 간격으로 주식 현재가를 자동 새로고침합니다.
- 백업/복구는 [src/services/backupService.js](src/services/backupService.js)에서 모든 도메인 테이블을 한 번에 export/import 합니다. 신규 도메인 테이블을 추가하면 이 서비스에도 등록해야 백업이 누락되지 않습니다.

## 배포

`git push` → main 브랜치가 Vercel에 자동 빌드/배포(`npm run build` → `dist/` + `api/`의 Vercel Functions). [vercel.json](vercel.json)이 SPA 라우팅 리라이트를 담당합니다. 수동 배포 명령은 없습니다.

## 추가 컨텍스트

- 상세한 페이지·서비스별 기능 설명은 [project-structure.md](project-structure.md)를 참고. 일부 정보는 시간이 지나면서 어긋날 수 있으니 코드와 충돌 시 코드를 우선합니다.
- 제품 요구사항은 [prd.md](prd.md), 환경 설정 체크리스트는 [home.md](home.md).

## 예정된 마이그레이션 / 알림

### Supabase Data API 기본 동작 변경 (2026-10-30 기존 프로젝트 적용)
2026-05-08 Supabase 공지 메일 수신. 핵심 내용:
- **2026-05-30**: 신규 Supabase 프로젝트에서 `public` 스키마 테이블이 Data API에 자동 노출되지 않음. 명시적 `GRANT` 필요.
- **2026-10-30**: 기존 프로젝트(=Pocket 포함)에도 적용. 단 **기존 테이블은 현재 grant를 유지** → 동작에 즉시 지장 없음.

**현재 영향**: 없음. Pocket의 transactions/assets/debts/stocks/settings 5개 테이블은 그대로 동작.

**대비 작업 (2026-10-30 전까지, 우선순위 낮음)**:
[supabase/schema.sql](supabase/schema.sql)에 명시적 GRANT 추가. 새 테이블을 추가할 때도 같은 패턴 사용:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON <table_name> TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON <table_name> TO service_role;
-- 익명 접근이 필요하면 anon에도 SELECT만 부여 (Pocket은 인증 필수라 anon 불필요)
```

**증상**: GRANT 누락 시 PostgREST가 `42501` 에러와 함께 정확한 GRANT 문을 응답으로 돌려줌. 그때 보고 추가해도 됨.

**참고**: Supabase Dashboard → Security Advisor 에서 기존 테이블 상태 점검 가능.
