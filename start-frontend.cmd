@echo off
echo 프론트엔드 개발 서버를 시작합니다 (http://localhost:5173)
cd /d "%~dp0frontend"
call npm run dev
pause
