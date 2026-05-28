@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET %%i=
@FOR %%i IN ("%~dp0.") DO @SET __MVNW_LAUNCHER_PROJECT_BASEDIR__=%%~fi

@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_MAVEN_MANAGER_URL__=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar

@SET __MVNW_PROPERTIES_FILE_DIR__=%__MVNW_LAUNCHER_PROJECT_BASEDIR__%\.mvn\wrapper

@IF NOT EXIST "%__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.properties" (
    @ECHO Could not find %__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.properties, downloading...
)

@SET MAVEN_PROJECTBASEDIR=%__MVNW_LAUNCHER_PROJECT_BASEDIR__%

@SET JAVA_HOME_CANDIDATES=
@FOR /F "usebackq tokens=*" %%i IN (`where java 2^>NUL`) DO @SET JAVA_HOME_CANDIDATES=%%~dpi..

@IF "%JAVA_HOME%"=="" (
    @FOR %%i IN (%JAVA_HOME_CANDIDATES%) DO @IF NOT "%JAVA_HOME%"=="" @GOTO :mvn_find_jvm_done
    @FOR %%i IN (%JAVA_HOME_CANDIDATES%) DO @SET JAVA_HOME=%%i
    :mvn_find_jvm_done
)

@SET JAVA_EXECUTABLE=%JAVA_HOME%\bin\java.exe
@IF NOT EXIST "%JAVA_EXECUTABLE%" SET JAVA_EXECUTABLE=java

@IF NOT EXIST "%__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.jar" (
    "%JAVA_EXECUTABLE%" -cp "%__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %* 2>NUL
    IF ERRORLEVEL 1 (
        "%JAVA_EXECUTABLE%" -jar "%__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %*
    )
) ELSE (
    "%JAVA_EXECUTABLE%" -jar "%__MVNW_PROPERTIES_FILE_DIR__%\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %*
)
