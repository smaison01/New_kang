@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
set PATH=%PATH%;C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot\bin
cd /d "%~dp0backend"
mvnw.cmd spring-boot:run
