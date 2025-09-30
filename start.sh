#!/bin/bash

echo "Starting PitchZone Development Environment..."
echo

echo "[1/3] Starting MongoDB..."
# Try to start MongoDB (different commands for different systems)
if command -v brew &> /dev/null; then
    brew services start mongodb-community 2>/dev/null || echo "MongoDB already running or not installed via brew"
elif command -v systemctl &> /dev/null; then
    sudo systemctl start mongod 2>/dev/null || echo "MongoDB already running or not installed"
else
    echo "Please start MongoDB manually"
fi

echo "[2/3] Starting Backend Server..."
cd server
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null || \
echo "Please run 'cd server && npm run dev' in a new terminal"
cd ..

echo "[3/3] Starting Frontend..."
cd client
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null || \
echo "Please run 'cd client && npm run dev' in a new terminal"
cd ..

echo
echo "✅ Development environment started!"
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Admin Login: admin@pitchzone.com / admin123"
echo
echo "If terminals didn't open automatically, run these commands manually:"
echo "Terminal 1: cd server && npm run dev"
echo "Terminal 2: cd client && npm run dev"