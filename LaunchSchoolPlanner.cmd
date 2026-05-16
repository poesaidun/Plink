@echo off
setlocal

if "%LOCALAPPDATA%"=="" set "LOCALAPPDATA=%USERPROFILE%\AppData\Local"
set "APPDIR=%LOCALAPPDATA%\SchoolPlanner"

if not exist "%APPDIR%" mkdir "%APPDIR%" >nul 2>nul

copy /Y "%~dp0index.html" "%APPDIR%\index.html" >nul
copy /Y "%~dp0styles.css" "%APPDIR%\styles.css" >nul
copy /Y "%~dp0app.js" "%APPDIR%\app.js" >nul
copy /Y "%~dp0plink.png" "%APPDIR%\plink.png" >nul
copy /Y "%~dp0plink-user.js" "%APPDIR%\plink-user.js" >nul
copy /Y "%~dp0plink-update.js" "%APPDIR%\plink-update.js" >nul
copy /Y "%~dp0manifest.json" "%APPDIR%\manifest.json" >nul
copy /Y "%~dp0service-worker.js" "%APPDIR%\service-worker.js" >nul
copy /Y "%~dp0README.md" "%APPDIR%\README.md" >nul

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$appDir = Join-Path $env:LOCALAPPDATA 'SchoolPlanner'; $json = ConvertTo-Json -Compress @{ name = $env:USERNAME }; Set-Content -LiteralPath (Join-Path $appDir 'plink-user.js') -Value ('window.PLINK_USER = ' + $json + ';') -Encoding UTF8"

set "APPURL=file:///%APPDIR:\=/%/index.html"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if exist "%EDGE%" (
  start "" "%EDGE%" "--app=%APPURL%"
) else (
  start "" "%APPDIR%\index.html"
)

endlocal
exit /b 0
