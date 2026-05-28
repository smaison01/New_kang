@echo off
echo Starting frontend dev server: http://localhost:5173
cd /d "%~dp0frontend"
call npm run dev
pause
