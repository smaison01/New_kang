# Work Log

## 2026-05-28 — 게시판 CRUD 프로젝트 초기 구성

### 한 일

#### 환경 세팅
- GitHub CLI (gh 2.93.0) winget 설치
- GitHub 계정 (smaison01) 로그인 및 `New_kang` 레포 생성 (public)
- 로컬 프로젝트 git init → remote 연결 → 첫 push (main 브랜치)
- Git 2.54.0 winget 설치 (git 미설치 상태였음)
- Microsoft OpenJDK 21 winget 설치
- Node.js LTS (v24.16.0) winget 설치
- Maven: winget 미지원 → Maven Wrapper (.mvn/wrapper) 방식으로 대체

#### 백엔드 (Spring Boot 3.3.0 / Java 21)
- `backend/` 디렉토리에 Maven 프로젝트 구성
- 의존성: spring-boot-starter-web, spring-boot-starter-data-jpa, h2, lombok
- 인메모리 H2 DB 사용 (재시작 시 데이터 초기화됨)
- CORS 설정: `@CrossOrigin(origins = "http://localhost:5173")`
- REST API: GET/POST/PUT/DELETE `/api/posts`, `/api/posts/{id}`

#### 프론트엔드 (React + Vite)
- `npx create vite@latest frontend --template react` 로 생성
- axios 설치하여 API 통신
- App.jsx: 목록 테이블 + 작성/수정 폼 + 상세 보기 단일 페이지
- App.css: 커스텀 스타일 (테이블, 폼, 버튼)

#### 실행 스크립트
- `start-backend.cmd` — 백엔드 서버 기동
- `start-frontend.cmd` — 프론트엔드 개발 서버 기동
- `start-all.cmd` — 백엔드 + 프론트엔드 동시 기동

---

## 2026-05-28 — start-all.cmd 오류 수정

### 문제
`start-all.cmd` 실행 시 아래 두 가지 오류 발생:
1. **한글 깨짐(인코딩 오류)** — cmd 파일을 UTF-8로 저장했는데 Windows cmd.exe는 CP949(EUC-KR)를 기대함. `echo 백엔드...` 같은 한글이 깨지면서 명령어로 잘못 해석됨
2. **따옴표 중첩 오류** — `cmd /k "cd /d "%~dp0backend" && ..."` 처럼 큰따옴표 안에 큰따옴표가 또 들어가서 파싱 실패

### 해결
- cmd 파일에서 **한글 완전 제거** (영문만 사용)
- `%~dp0`를 먼저 `set ROOT=%~dp0`로 변수에 담아 따옴표 중첩 없이 경로 전달

### 교훈
> **Windows .cmd 파일에는 한글(비ASCII) 문자를 쓰지 말 것.**  
> 경로 변수는 `set VAR=%~dp0` 로 미리 분리한 뒤 `cmd /k "..."` 안에서 사용할 것.
