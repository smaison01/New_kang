@echo off
set ROOT=%~dp0
start "Backend"  cmd /k "cd /d %ROOT%backend && mvnw.cmd spring-boot:run"
start "Frontend" cmd /k "cd /d %ROOT%frontend && npm run dev"
echo Backend  : http://localhost:8080
echo Frontend : http://localhost:5173
