@echo off
title PitchZone Startup
color 0A

echo.
echo ========================================
echo    PitchZone Development Startup
echo ========================================
echo.

echo [STEP 1] Checking system...
node diagnose.js
echo.

echo [STEP 2] Installing dependencies...
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)

echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [STEP 3] Creating admin user...
cd server
call npm run create-admin
cd ..

echo.
echo [STEP 4] Starting servers...
echo Starting backend server...
cd server
start "PitchZone Backend" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak > nul

echo Starting frontend...
cd client
start "PitchZone Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo    Startup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin:    admin@pitchzone.com / admin123
echo.
echo Press any key to exit this window...
pause > nul