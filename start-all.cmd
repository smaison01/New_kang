@echo off
set ROOT=%~dp0
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot\bin
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
start "Backend"  cmd /k "set JAVA_HOME=%JAVA_HOME% && set PATH=%PATH% && cd /d %ROOT%backend && mvnw.cmd spring-boot:run"
start "Frontend" cmd /k "set PATH=%PATH% && cd /d %ROOT%frontend && npm run dev"
echo Backend  : http://localhost:8080
echo Frontend : http://localhost:5173
