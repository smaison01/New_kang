@echo off
set ROOT=%~dp0

echo Killing existing processes on port 8080 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)

start "Backend"  cmd /k "%ROOT%_run-backend.cmd"
start "Frontend" cmd /k "%ROOT%_run-frontend.cmd"
echo Backend  : http://localhost:8080
echo Frontend : http://localhost:5173
