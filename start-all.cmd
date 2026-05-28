@echo off
echo 백엔드 서버를 시작합니다...
start "Backend" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo 프론트엔드 서버를 시작합니다...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo 백엔드: http://localhost:8080
echo 프론트엔드: http://localhost:5173
