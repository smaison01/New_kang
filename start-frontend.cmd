@echo off
set PATH=%PATH%;C:\Program Files\nodejs
echo Starting frontend dev server: http://localhost:5173
cd /d "%~dp0frontend"
call npm run dev
pause
