@echo off
echo ================================
echo HTML5 Game Packaging Tool
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Ask user what to build
echo What would you like to build?
echo 1) All platforms (Windows, Mac, Linux^)
echo 2) Windows only
echo 3) Mac only
echo 4) Linux only
echo 5) Just test locally (no build^)
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Building for all platforms...
    call npx pkg . --compress GZip
) else if "%choice%"=="2" (
    echo.
    echo Building for Windows...
    call npx pkg . --targets node18-win-x64 --compress GZip
) else if "%choice%"=="3" (
    echo.
    echo Building for Mac...
    call npx pkg . --targets node18-macos-x64 --compress GZip
) else if "%choice%"=="4" (
    echo.
    echo Building for Linux...
    call npx pkg . --targets node18-linux-x64 --compress GZip
) else if "%choice%"=="5" (
    echo.
    echo Starting local test server...
    echo Press Ctrl+C to stop
    node server.js
    goto :end
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo ================================
echo Build complete!
echo ================================
echo.
echo Your executables are in the 'dist' folder
dir dist
echo.
echo You can now distribute these files to players!

:end
pause
