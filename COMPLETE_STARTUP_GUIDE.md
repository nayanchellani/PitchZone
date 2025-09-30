# 🚀 COMPLETE STARTUP GUIDE - PitchZone

## ⚡ EXACT STEPS TO GET EVERYTHING WORKING

### 🔥 STEP 1: Start Backend Server

Open **Terminal 1** and run these commands **exactly**:

```bash
cd server
npm install
npm run create-admin
npm run dev
```

**✅ SUCCESS INDICATORS:**
```
🚀 Server running on http://localhost:5000
📱 API endpoints available at: http://localhost:5000/api
MongoDB Connected: localhost:27017
```

**❌ IF YOU SEE ERRORS:**

**Error: "MongoDB connection error"**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Error: "Port 5000 already in use"**
```bash
npx kill-port 5000
npm run dev
```

### 🔥 STEP 2: Test Backend (CRITICAL!)

Open browser and go to: **http://localhost:5000**

**✅ MUST SEE THIS:**
```json
{
  "message": "Welcome to PitchZone API!",
  "status": "Server is running successfully",
  "endpoints": {
    "auth": "/api/auth",
    "pitches": "/api/pitches",
    "users": "/api/users"
  }
}
```

**❌ IF YOU SEE HTML ERROR PAGE:** Backend is not running correctly!

### 🔥 STEP 3: Start Frontend

Open **Terminal 2** (NEW TERMINAL) and run:

```bash
cd client
npm install
npm run dev
```

**✅ SUCCESS INDICATORS:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 🔥 STEP 4: Test the Application

1. **Go to**: http://localhost:5173
2. **Click**: "Create Account"
3. **Fill form** and submit
4. **Should redirect** to login page
5. **Login** with your credentials
6. **Should see** dashboard with real data

## 🎯 TROUBLESHOOTING SPECIFIC ISSUES

### Issue: "Login button has no CSS"

**Cause**: CSS not loading properly
**Fix**:
```bash
# In client directory
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "404 on /api/auth/login"

**Cause**: Backend not running or wrong port
**Fix**:
1. Make sure backend shows "Server running on http://localhost:5000"
2. Test http://localhost:5000 in browser (should show JSON)
3. If not working, restart backend

### Issue: "Network error"

**Cause**: Frontend can't reach backend
**Fix**:
1. Backend MUST be on port 5000
2. Frontend MUST be on port 5173
3. Both must be running simultaneously

## 🔧 EMERGENCY RESET

If nothing works, run these commands:

```bash
# Kill all processes
pkill -f node

# Clean backend
cd server
rm -rf node_modules package-lock.json
npm install

# Clean frontend
cd ../client
rm -rf node_modules package-lock.json
npm install

# Start backend
cd ../server
npm run create-admin
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

## 📋 SUCCESS CHECKLIST

- [ ] Backend terminal shows "Server running on http://localhost:5000"
- [ ] http://localhost:5000 shows JSON response (not HTML error)
- [ ] MongoDB shows "Connected" message
- [ ] Frontend runs on http://localhost:5173
- [ ] Can create account without errors
- [ ] Can login without "Network error"
- [ ] Dashboard loads with real user data
- [ ] Login/Create buttons have proper styling

## 🎨 CSS STYLING VERIFICATION

The buttons should look like this:
- **Login/Create buttons**: Teal background with underline animation on hover
- **Action buttons**: Transparent with cyan border, fill animation on hover
- **All buttons**: Smooth transitions and proper spacing

If buttons look unstyled:
1. Check if App.css is loading
2. Clear browser cache (Ctrl+Shift+R)
3. Restart frontend server

## 🔑 ADMIN ACCESS

After successful setup:
- **URL**: http://localhost:5173/login
- **Email**: admin@pitchzone.com
- **Password**: admin123

## 📞 FINAL VERIFICATION

1. ✅ Backend: http://localhost:5000 (JSON response)
2. ✅ Frontend: http://localhost:5173 (React app)
3. ✅ Login works without network errors
4. ✅ Buttons have proper CSS styling
5. ✅ Dashboard shows real data

**If all checkboxes are ✅, your application is working perfectly!**