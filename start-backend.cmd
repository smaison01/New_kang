@echo off
echo Starting backend server: http://localhost:8080
cd /d "%~dp0backend"
mvnw.cmd spring-boot:run
pause
