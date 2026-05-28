@echo off
set ROOT=%~dp0
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot\bin
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot

echo Killing existing processes on port 8080 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)

start "Backend"  cmd /k "set JAVA_HOME=%JAVA_HOME% && set PATH=%PATH% && cd /d %ROOT%backend && mvnw.cmd spring-boot:run"
start "Frontend" cmd /k "set PATH=%PATH% && cd /d %ROOT%frontend && npm run dev"
echo Backend  : http://localhost:8080
echo Frontend : http://localhost:5173
