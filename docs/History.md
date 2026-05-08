# 개발 히스토리

> 날짜별 개발 이력 누적 기록. 각 항목은 요약 위주로 짧게.
> 형식: `### YYYY-MM-DD` 헤더 아래 `- type: 요약` 목록.
> type 예시: feat / fix / refactor / docs / chore / style

---

## 2025

### 2025-12-29
- chore: 초기 커밋, PRD·환경 설정 문서 추가, GitHub·Supabase·.env 셋업 (Phase 1)
- feat: React 프로젝트 생성 및 더미 데이터 기반 UI 개발 완료 (Phase 2~3)

### 2025-12-30
- feat: 대시보드 개편, 설정 페이지 도입, 가계부/부채 UI 개선
- feat: 자산·부채·주식 페이지 추가/수정/삭제 + 콤마 포맷팅, 예산 목표 토글

### 2025-12-31
- feat: Supabase 연동 완료 — 가계부/자산/부채/주식 CRUD 전환 (Phase 4)

---

## 2026

### 2026-01-01
- feat: 로그인 기능(Supabase Auth) 추가, Netlify 1차 배포 (Phase 5)
- feat: 데이터 백업/복구 기능(`backupService.js`) + Settings 페이지 통합
- feat: 모바일 반응형 디자인 정비
- fix: Netlify Functions로 Yahoo Finance API 프록시 구현 → 이후 Vercel Functions로 마이그레이션
- fix: SPA 라우팅 설정(_redirects → vercel.json), Budget 기본 월을 현재로
- chore: Netlify 관련 파일 제거, 백업 파일 정리
- docs: prd.md, project-structure.md를 Vercel 기준으로 업데이트 (Phase 6)

### 2026-01-02
- feat: 가계부 월별 데이터 동기화 + 수동 "확정" 버튼(다음 달 덮어쓰기 복사)

### 2026-01-05
- feat: 주식 페이지 — 증권사 탭, 드래그앤드롭 정렬, MD 다운로드

### 2026-01-06
- fix: 한국 주식 KOSPI(.KS) → KOSDAQ(.KQ) 자동 폴백 로직 추가

### 2026-01-17
- feat: 가계부/대시보드 명확한 금액 표시, 요약 카드 개선(지출 통합·미확정 추가)
- style: 고정/변동 지출 헤더에서 완료 카운트 제거
- fix: 미국 주식(USD) 매입가/수량 소수점 입력 허용, 한국 주식은 정수만

### 2026-02-12
- fix: Supabase RLS 활성화 및 모든 접근 허용 정책 추가

### 2026-02-18
- refactor: 대시보드를 Supabase 연동으로 전환
- fix: 대시보드 최근 지출을 체크(확인)된 항목 기준으로 표시

### 2026-03-12
- fix: 자산/부채 잔액 추이 차트를 실제 데이터 기반으로 전환, PRD 최신화

### 2026-04-02
- refactor: 자산/부채 차트를 그라디언트 영역 차트로 통일, 요약 제거

### 2026-05-07
- chore: GitHub 저장소 URL 변경 (`chajunghun83/Pocket` → `cha-830624/Pocket`), 문서·git remote 갱신
- docs: CLAUDE.md 신규 작성, Git 작업 규칙(명시 요청 시에만 커밋·푸시, 커밋 시 History.md 갱신) 추가
- docs: docs/History.md 신설, 과거 개발 이력 요약 정리

### 2026-05-08
- security: Supabase RLS 정책을 `auth.uid() = user_id` 기반으로 강화, user_id DEFAULT 추가
- security: env-template.txt의 실제 Supabase URL·anon key를 placeholder로 교체
- security: Yahoo 프록시(api/yahoo-finance.js) symbol/interval/range 화이트리스트 검증 + origin 화이트리스트 적용
- fix: backupService 주식 복구 시 컬럼 매핑 오류(name/code/broker/memo/sort_order) 수정
- fix: Dashboard 1분 폴링이 stale closure로 종목 변경 미반영되던 문제 — `stocksRef` 패턴으로 수정
- fix: Stock 페이지 refreshPrices 의존성 순환 정리, priceLoaded 플래그로 "조회 중…" 표기
- fix: Budget 확정 가드를 ref→state 전환해 버튼 비활성/스피너 UI 반영
- feat: Settings 비밀번호 변경 기능 구현 (AuthContext에 updatePassword 추가)
- refactor: 활성 유틸을 src/utils/formatters.js로 분리 (dummyData.js는 호환 re-export 유지)
- refactor: schema.sql에 누락됐던 stocks.sort_order 컬럼 보강
- chore: Dashboard 가계부 fetch에 최근 2년 dateFrom 필터 적용 (transactionService 시그니처 확장)
- chore: Dashboard 잔액/부채 라벨이 기간 선택 시 "기간 순현금흐름/순부채 변동"으로 전환, 차트도 selectedPeriod 반영
- chore: Layout 시작페이지 redirect 깜빡임 완화, vite UA 보강, yahooFinance 주석 갱신, Budget console 디버그 게이트화
