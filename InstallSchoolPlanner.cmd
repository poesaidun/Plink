@echo off
setlocal

if "%LOCALAPPDATA%"=="" set "LOCALAPPDATA=%USERPROFILE%\AppData\Local"
set "APPDIR=%LOCALAPPDATA%\SchoolPlanner"
set "SHORTCUT=%USERPROFILE%\Desktop\Plink.lnk"

if not exist "%APPDIR%" mkdir "%APPDIR%" >nul 2>nul

copy /Y "%~dp0index.html" "%APPDIR%\index.html" >nul
copy /Y "%~dp0styles.css" "%APPDIR%\styles.css" >nul
copy /Y "%~dp0app.js" "%APPDIR%\app.js" >nul
copy /Y "%~dp0plink.png" "%APPDIR%\plink.png" >nul
copy /Y "%~dp0plink-user.js" "%APPDIR%\plink-user.js" >nul
copy /Y "%~dp0plink-update.js" "%APPDIR%\plink-update.js" >nul
copy /Y "%~dp0README.md" "%APPDIR%\README.md" >nul
copy /Y "%~dp0StartSchoolPlanner.vbs" "%APPDIR%\StartSchoolPlanner.vbs" >nul

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$appDir = Join-Path $env:LOCALAPPDATA 'SchoolPlanner'; $json = ConvertTo-Json -Compress @{ name = $env:USERNAME }; Set-Content -LiteralPath (Join-Path $appDir 'plink-user.js') -Value ('window.PLINK_USER = ' + $json + ';') -Encoding UTF8"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$shortcutPath = [Environment]::GetFolderPath('Desktop') + '\Plink.lnk'; $appDir = Join-Path $env:LOCALAPPDATA 'SchoolPlanner'; $shell = New-Object -ComObject WScript.Shell; $shortcut = $shell.CreateShortcut($shortcutPath); $shortcut.TargetPath = Join-Path $env:WINDIR 'System32\wscript.exe'; $shortcut.Arguments = '""' + (Join-Path $appDir 'StartSchoolPlanner.vbs') + '""'; $shortcut.WorkingDirectory = $appDir; $edge = Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'; if (-not (Test-Path $edge)) { $edge = Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe' }; if (Test-Path $edge) { $shortcut.IconLocation = $edge + ',0' } else { $shortcut.IconLocation = Join-Path $env:WINDIR 'System32\shell32.dll,14' }; $shortcut.Save()"

start "" "%APPDIR%\StartSchoolPlanner.vbs"

endlocal
exit /b 0
