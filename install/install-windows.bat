@echo off
REM ChatInc Marketing Pipeline installer - Windows
REM Double-click this file. No technical knowledge needed.

cd /d "%~dp0"
set MARKETPLACE_DIR=%~dp0..
set MARKETPLACE_DIR=%MARKETPLACE_DIR:~0,-1%

echo.
echo   ============================================================
echo     ChatInc Marketing Pipeline - Installer
echo   ============================================================
echo.
echo   This installs the Marketing Command Center on your computer.
echo   Takes about 20 seconds. No typing required.
echo.

where claude >nul 2>&1
if errorlevel 1 (
  echo   [X] Claude Code is not installed.
  echo.
  echo       Install Claude Code first:
  echo       https://docs.claude.com/en/docs/claude-code/quickstart
  echo.
  pause
  exit /b 1
)
echo   [OK] Claude Code detected
echo.

echo   ^> Adding marketing-pipeline marketplace from %MARKETPLACE_DIR%...
claude plugin marketplace add "%MARKETPLACE_DIR%"
echo   [OK] Marketplace added
echo.

echo   ^> Installing marketing-pipeline plugin...
claude plugin install marketing-pipeline@chatinc-plugins
echo   [OK] Plugin installed
echo.

set MARKETING_DIR=%USERPROFILE%\Documents\ChatInc-Marketing
mkdir "%MARKETING_DIR%\_libraries" 2>nul
echo   [OK] Marketing folder created at %MARKETING_DIR%
echo.

echo.
echo   ============================================================
echo     [OK] INSTALL COMPLETE
echo   ============================================================
echo.
echo   Next:
echo   1. Open Claude Code (Start Menu - search "Claude")
echo   2. Type: install marketing command center
echo   3. Click the dashboard link
echo   4. Click "+ New campaign" to start
echo.
echo   Updates: when admin sends a new version, run this installer again.
echo.
pause
