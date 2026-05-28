@echo off
set MAVEN_DIR=%~dp0.mvn\wrapper\apache-maven
set MAVEN_ZIP=%~dp0.mvn\wrapper\apache-maven.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip

if not exist "%MAVEN_DIR%\bin\mvn.cmd" (
    echo Downloading Maven 3.9.9...
    powershell -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'"
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%~dp0.mvn\wrapper\tmp' -Force"
    move "%~dp0.mvn\wrapper\tmp\apache-maven-3.9.9" "%MAVEN_DIR%"
    rmdir "%~dp0.mvn\wrapper\tmp"
    del "%MAVEN_ZIP%"
    echo Maven download complete.
)

"%MAVEN_DIR%\bin\mvn.cmd" %*
