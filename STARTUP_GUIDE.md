# 🚀 IMMEDIATE STARTUP GUIDE

## ⚡ Quick Fix - Follow These Steps Exactly

### Step 1: Start Backend Server

Open a terminal and run these commands **one by one**:

```bash
cd server
npm install
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
📱 API endpoints available at: http://localhost:5000/api
MongoDB Connected: localhost:27017
```

### Step 2: Test Backend (Important!)

Open your browser and go to: **http://localhost:5000**

You should see:
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

### Step 3: Create Admin User

In the same terminal (server directory):
```bash
npm run create-admin
```

**Expected Output:**
```
✅ Admin user created successfully!
📧 Email: admin@pitchzone.com
🔑 Password: admin123
```

### Step 4: Start Frontend

Open a **NEW terminal** and run:
```bash
cd client
npm install
npm run dev
```

**Expected Output:**
```
  Local:   http://localhost:5173/
  Network: use --host to expose
```

### Step 5: Test the Application

1. Go to **http://localhost:5173**
2. Click "Create Account"
3. Register as an entrepreneur or investor
4. Login with your credentials
5. You should see the dashboard with real data

---

## 🔧 If You Get Errors

### Error: "MongoDB connection error"

**Solution 1 - Install MongoDB Locally:**
1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Restart the backend server

**Solution 2 - Use MongoDB Atlas (Cloud):**
1. Go to https://cloud.mongodb.com
2. Create free account and cluster
3. Get connection string
4. Update `server/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchzone
```

### Error: "Port 5000 already in use"

```bash
# Kill process on port 5000
npx kill-port 5000
# Then restart server
npm run dev
```

### Error: "Module not found"

```bash
cd server
rm -rf node_modules
npm install
npm run dev
```

---

## 🎯 Success Checklist

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:5173
✅ MongoDB connected (see server logs)
✅ Admin user created
✅ Can access http://localhost:5000 in browser (shows JSON)
✅ Can create account and login
✅ Dashboard shows real user data

---

## 🆘 Still Having Issues?

### Check These:

1. **Server Terminal**: Look for error messages
2. **Browser Console**: F12 → Console tab for errors
3. **Network Tab**: F12 → Network tab to see failed requests
4. **MongoDB**: Make sure it's running

### Common Solutions:

```bash
# Restart everything
pkill -f node
cd server && npm run dev &
cd client && npm run dev

# Reset database (if needed)
mongo
> use pitchzone
> db.dropDatabase()
> exit
```

### Test API Manually:

```bash
# Test if server is responding
curl http://localhost:5000

# Test auth endpoint
curl http://localhost:5000/api/auth/me
```

---

## 📞 Emergency Commands

If nothing works, run these commands in order:

```bash
# 1. Kill all node processes
pkill -f node

# 2. Clean install backend
cd server
rm -rf node_modules package-lock.json
npm install

# 3. Clean install frontend  
cd ../client
rm -rf node_modules package-lock.json
npm install

# 4. Start backend
cd ../server
npm run create-admin
npm run dev

# 5. Start frontend (new terminal)
cd client
npm run dev
```

---

**The key is making sure the backend server is running FIRST and accessible at http://localhost:5000 before starting the frontend!**