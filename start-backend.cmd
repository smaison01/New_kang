@echo off
echo 백엔드 서버를 시작합니다 (http://localhost:8080)
cd /d "%~dp0backend"
mvnw.cmd spring-boot:run
pause
