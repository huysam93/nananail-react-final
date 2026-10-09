@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ===================================================
echo   NanaNail - Tu dong Build Frontend va Copy Dist
echo ===================================================
echo.

:: Di chuyen den thu muc goc chua file bat
cd /d "%~dp0"

echo [1/3] Di chuyen vao thu muc frontend...
cd frontend
if not exist "package.json" (
    echo [LOI] Khong tim thay thu muc frontend hoac package.json!
    pause
    exit /b 1
)

echo [2/3] Dang build Frontend bang Vite...
call npx vite build
if errorlevel 1 (
    echo.
    echo [LOI] Qua trinh build frontend that bai! Vui long kiem tra lai code.
    cd ..
    pause
    exit /b 1
)

echo.
echo [3/3] Dang dong bo dist sang backend\dist...
cd ..
if not exist "frontend\dist" (
    echo [LOI] Khong tim thay thu muc frontend\dist sau khi build!
    pause
    exit /b 1
)

:: Xoa sach backend\dist cu de tranh ton dong file hash cu
if exist "backend\dist" (
    rmdir /s /q "backend\dist"
)
mkdir "backend\dist"

:: Copy toan bo file tu frontend\dist sang backend\dist
xcopy /e /i /y /q "frontend\dist\*" "backend\dist\"

if errorlevel 1 (
    echo [LOI] Copy file sang backend\dist that bai!
    pause
    exit /b 1
)

echo.
echo ===================================================
echo   THANH CONG! Frontend da duoc build va copy sang:
echo   backend\dist
echo.
echo   San sang de deploy hoac chay backend!
echo ===================================================
echo.
pause
