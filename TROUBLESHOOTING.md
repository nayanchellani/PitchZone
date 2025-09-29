# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to fetch" / "Unexpected token '<'" Errors

**Problem**: Frontend can't connect to backend API

**Solutions**:

#### Step 1: Check if Backend is Running
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
MongoDB Connected: localhost:27017
```

#### Step 2: Test Backend Manually
Open browser and go to: http://localhost:5000

You should see:
```json
{
  "message": "Welcome to PitchZone API!",
  "status": "Server is running successfully"
}
```

#### Step 3: Check MongoDB Connection
Make sure MongoDB is running:
```bash
# On Windows
net start MongoDB

# On Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 2. Database Connection Issues

**Error**: `Database connection error`

**Solutions**:

#### Option A: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Verify connection: `mongo` or use MongoDB Compass

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create cluster and get connection string
3. Update `server/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchzone
```

### 3. Port Conflicts

**Error**: `EADDRINUSE: address already in use`

**Solutions**:
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port in server/.env
PORT=5001
```

### 4. CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution**: Make sure frontend and backend ports match in `server/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

### 5. Authentication Issues

**Error**: `Access denied. No token provided`

**Solutions**:
1. Make sure you're logged in
2. Check localStorage for token:
```javascript
// In browser console
console.log(localStorage.getItem('token'));
```
3. Re-login if token is missing

### 6. Admin User Issues

**Error**: Can't login as admin

**Solutions**:
```bash
cd server
npm run create-admin
```

Use credentials:
- Email: admin@pitchzone.com
- Password: admin123

## Step-by-Step Debugging

### 1. Backend Check
```bash
cd server
npm install
npm run create-admin
npm run dev
```

### 2. Frontend Check
```bash
cd client
npm install
npm run dev
```

### 3. Browser Check
1. Open http://localhost:5173
2. Open Developer Tools (F12)
3. Check Console for errors
4. Check Network tab for failed requests

### 4. API Test
Test API endpoints manually:
- http://localhost:5000/ (should return JSON)
- http://localhost:5000/api/pitches (should return pitches)

## Environment Setup

### server/.env
```
MONGO_URI=mongodb://localhost:27017/pitchzone
JWT_SECRET=pitchzone_super_secret_jwt_key_2024_make_it_very_long_and_random
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Required Dependencies

#### Server
```bash
cd server
npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator nodemon
```

#### Client
```bash
cd client
npm install
```

## Quick Fix Commands

```bash
# Reset everything
cd server && npm run dev &
cd client && npm run dev

# Kill all node processes
pkill -f node

# Reset MongoDB (if needed)
mongo
> use pitchzone
> db.dropDatabase()
```

## Still Having Issues?

1. **Check Console Logs**: Look for specific error messages
2. **Verify Ports**: Backend on 5000, Frontend on 5173
3. **Check MongoDB**: Make sure it's running and accessible
4. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)
5. **Restart Everything**: Stop all processes and restart

## Success Indicators

✅ Backend: `Server running on http://localhost:5000`
✅ MongoDB: `MongoDB Connected: localhost:27017`
✅ Frontend: `Local: http://localhost:5173`
✅ API Test: http://localhost:5000 returns JSON
✅ Login Works: Can create account and login
✅ Data Loads: Dashboard shows real user data