# 집 PC 환경 설정 체크리스트

> **현재 PC (회사 또는 집)**: React 프로젝트 생성 완료! ✅
> 
> ### 완료된 작업들:
> - [x] Git 설치 ✅ (v2.47.1)
> - [x] Node.js 설치 ✅ (v22.16.0)
> - [x] GitHub 계정 설정 ✅ (chajunghun83)
> - [x] **GitHub 저장소 생성 완료** ✅
>   - URL: https://github.com/cha-830624/Pocket
> - [x] **Supabase 프로젝트 생성 완료** ✅
>   - Project URL: https://gzxbckioutctwxbevqmk.supabase.co
> - [x] **`.env` 파일 생성 완료** ✅
> - [x] **React 프로젝트 생성 완료** ✅
>   - Vite + React
>   - 로컬 실행: http://localhost:3000
> - [x] **UI 개발 완료 (더미 데이터)** ✅
>   - 대시보드, 가계부, 부채 관리, 주식 관리, 설정 페이지
> 
> ### 다음 단계:
> - [ ] Supabase 연동 (실제 데이터 저장)
> - [ ] 로그인 기능 구현

---

## 📊 전체 진행 상황

```
Phase 1: 환경 설정 ✅ 완료!
├─ GitHub 저장소 생성 ✅
├─ Supabase 프로젝트 생성 ✅
├─ .env 파일 설정 ✅
└─ 문서 작업 완료 ✅

Phase 2: React 프로젝트 생성 ✅ 완료!
├─ Vite로 React 프로젝트 생성 ✅
├─ 라이브러리 설치 ✅ (Supabase, Router, Recharts, Lucide)
├─ 기본 레이아웃 구성 ✅
└─ 로컬 실행 확인 ✅ (http://localhost:3000)

Phase 3: UI 개발 ✅ 완료! (더미 데이터)
├─ 대시보드 페이지 ✅
├─ 가계부 페이지 ✅ (3열: 수입/고정지출/변동지출)
├─ 부채 관리 페이지 ✅
├─ 주식 관리 페이지 ✅
└─ 설정 페이지 ✅

Phase 4: Supabase 연동 ⬅️ 다음 단계!
├─ 로그인 기능
├─ 가계부 CRUD
├─ 부채 관리 CRUD
└─ 주식 관리 CRUD

Phase 5: 배포
└─ Vercel 배포
```

---

## 다른 PC에서 확인할 사항

### 1단계: 설치 확인

집(또는 회사) PC에서 Cursor를 열고 터미널에서 다음 명령어를 실행하세요:

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

---

## 예상 결과

### ✅ 모두 설치되어 있는 경우

```
git version 2.47.1.windows.2
v22.16.0
10.9.2
chajunghun83
nocarrot83@timbel.net
```

→ **완료!** 바로 프로젝트 시작 가능

---

### ❌ 설치되지 않은 경우

#### Git이 없는 경우 (`git: command not found`)

1. https://git-scm.com/download/win 접속
2. "Download for Windows" 클릭
3. 다운로드된 파일 실행
4. 기본 설정으로 계속 "Next" 클릭
5. 설치 완료 후 Cursor 재시작
6. 다시 `git --version` 확인

#### Node.js가 없는 경우 (`node: command not found`)

1. https://nodejs.org 접속
2. "LTS" 버전 다운로드 (왼쪽 버튼)
3. 다운로드된 파일 실행
4. 기본 설정으로 계속 "Next" 클릭
5. 설치 완료 후 Cursor 재시작
6. 다시 `node --version` 확인

#### GitHub 계정이 설정 안 된 경우 (아무것도 출력 안 됨)

터미널에서 다음 명령어 실행:

```bash
git config --global user.name "chajunghun83"
git config --global user.email "nocarrot83@timbel.net"
```

확인:
```bash
git config --global user.name
git config --global user.email
```

---

## 2단계: 계정 확인

### GitHub 계정
- [ ] https://github.com 접속
- [ ] `chajunghun83` 계정으로 로그인

### Vercel 계정
- [ ] https://vercel.com 접속
- [ ] GitHub 계정으로 로그인 (Sign in with GitHub)

### Supabase 계정
- [ ] https://supabase.com 접속
- [ ] 로그인 확인

---

## 3단계: 프로젝트 동기화 (✅ GitHub 저장소 생성 완료!)

### GitHub에서 프로젝트 가져오기

```bash
# 프로젝트 저장될 폴더로 이동 (예시)
cd D:\work

# GitHub에서 프로젝트 복사
git clone https://github.com/cha-830624/Pocket.git

# 프로젝트 폴더로 이동
cd Pocket

# 필요한 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

> **참고**: 저장소 이름이 대문자 "Pocket"입니다!

---

## 4단계: 환경변수 설정 (.env 파일) ✅ 완료!

프로젝트 폴더에 `.env` 파일이 생성되어 있습니다:

```
VITE_SUPABASE_URL=https://gzxbckioutctwxbevqmk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **주의**: 
> - 이 파일은 GitHub에 올라가지 않습니다! (.gitignore에 포함됨)
> - 다른 PC에서 작업할 때는 `env-template.txt`를 참고해서 `.env` 파일을 다시 만들어야 합니다!

---

## 작업 흐름 (두 PC 사용 시)

### PC A (현재)에서 작업 후

```bash
# 작업 내용 저장
git add .
git commit -m "작업 내용 설명"
git push
```

### PC B (집/회사)에서 작업 시작

```bash
# 프로젝트 폴더로 이동
cd Pocket

# 최신 코드 가져오기
git pull

# 작업 시작...
```

### PC B에서 작업 후

```bash
# 작업 내용 저장
git add .
git commit -m "작업 내용 설명"
git push
```

### 다시 PC A로 돌아왔을 때

```bash
# 최신 코드 가져오기
git pull

# 작업 계속...
```

---

## 주의사항 ⚠️

### ✅ 해야 할 것
- 작업 시작 전: 항상 `git pull`
- 작업 끝날 때: 항상 `git add . && git commit && git push`
- 자주 저장하고 push

### ❌ 하지 말아야 할 것
- push 안 하고 PC 바꾸기
- 동시에 두 PC에서 같은 파일 수정
- `.env` 파일을 GitHub에 올리기

---

## 빠른 체크리스트

### 현재 PC (완료된 작업)
- [x] Git 설치됨 ✅
- [x] Node.js 설치됨 ✅
- [x] GitHub 계정 설정됨 ✅
- [x] GitHub에 로그인됨 ✅
- [ ] Vercel 계정 생성됨 (배포 시 필요)
- [x] Supabase 계정 확인됨 ✅
- [x] Supabase 프로젝트 생성됨 ✅
- [x] `.env` 파일 생성됨 ✅
- [x] React 프로젝트 생성 ✅
- [x] `npm install` 완료 ✅
- [x] `npm run dev` 실행 확인 ✅ (http://localhost:3000)

### 다른 PC에서 확인할 사항 (집 PC) ✅ 완료!
- [x] Git 설치 ✅ (v2.52.0)
- [x] Node.js 설치 ✅ (v24.12.0)
- [x] GitHub 계정 설정 ✅ (chajunghun83)
- [x] GitHub 연결 ✅
- [x] 프로젝트 clone ✅ (C:\work\Pocket)
- [x] `.env` 파일 생성 ✅
- [x] npm install 완료 ✅
- [x] 개발 서버 실행 확인 ✅ (http://localhost:3000)

---

## 문제 해결

### "git: command not found"
→ Git 설치 필요: https://git-scm.com

### "node: command not found"
→ Node.js 설치 필요: https://nodejs.org

### "permission denied" 또는 "access denied"
→ GitHub 로그인 필요: `git config --global` 설정 확인

### "conflict" 또는 "merge error"
→ 두 PC에서 동시에 수정한 경우
→ 해결: 파일 확인 후 수동으로 병합 또는 하나 선택

---

## 도움말

막히는 부분이 있으면:
1. 에러 메시지 전체 복사
2. Cursor AI에게 질문
3. 또는 me에게 알려주세요!

**집 PC에서도 동일하게 확인하시면 됩니다!** 🏠💻

