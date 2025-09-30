@echo off
title PitchZone Setup Check and Start
color 0A

echo.
echo ========================================
echo    PitchZone Setup Check and Start
echo ========================================
echo.

echo [STEP 1] Checking setup...
node check-setup.js
echo.

echo [STEP 2] Do you want to start the servers? (Y/N)
set /p choice=Enter your choice: 

if /i "%choice%"=="Y" (
    echo.
    echo [STEP 3] Installing dependencies...
    
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
    echo [STEP 4] Creating admin user...
    cd server
    call npm run create-admin
    cd ..
    
    echo.
    echo [STEP 5] Starting servers...
    echo Starting backend server...
    cd server
    start "PitchZone Backend" cmd /k "echo Backend Server && npm run dev"
    cd ..
    
    timeout /t 5 /nobreak > nul
    
    echo Starting frontend...
    cd client
    start "PitchZone Frontend" cmd /k "echo Frontend Server && npm run dev"
    cd ..
    
    echo.
    echo ========================================
    echo    Servers Started!
    echo ========================================
    echo.
    echo Backend:  http://localhost:5000
    echo Frontend: http://localhost:5173
    echo Admin:    admin@pitchzone.com / admin123
    echo.
    echo IMPORTANT: Test backend first!
    echo 1. Go to http://localhost:5000 (should show JSON)
    echo 2. Then go to http://localhost:5173 (your app)
    echo.
) else (
    echo.
    echo Setup check complete. To start manually:
    echo 1. cd server && npm run dev
    echo 2. cd client && npm run dev
    echo.
)

echo Press any key to exit...
pause > nul