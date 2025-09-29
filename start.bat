@echo off
echo Starting PitchZone Development Environment...
echo.

echo [1/3] Starting MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found or already running
)

echo [2/3] Starting Backend Server...
cd server
start "Backend" cmd /k "npm run dev"
cd ..

echo [3/3] Starting Frontend...
cd client
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Development environment started!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin Login: admin@pitchzone.com / admin123
echo.
echo Press any key to exit...
pause >nul