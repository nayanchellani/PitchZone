# 🚀 PitchZone Deployment Guide

## ✅ Pre-Deployment Checklist Complete

Your backend is **READY FOR DEPLOYMENT**! All requirements are met:

- ✅ Start script configured: `"start": "node server.js"`
- ✅ Dynamic PORT: `process.env.PORT || 5000`
- ✅ MongoDB URI from environment: `process.env.MONGO_URI`
- ✅ CORS configured with production support

---

## 📋 Deployment Steps

### **STEP 1: Deploy Backend (Render/Railway/Heroku)**

#### Option A: Render (Recommended - Free Tier)

1. **Create Account**: Go to [render.com](https://render.com) and sign up

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   ```
   Name: pitchzone-backend
   Region: Choose closest to you
   Branch: main (or master)
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchzone
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

6. **Copy Backend URL**: Save it (e.g., `https://pitchzone-backend.onrender.com`)

---

#### Option B: Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Set root directory to `server`
6. Deploy

---

### **STEP 2: Setup MongoDB Atlas (Cloud Database)**

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Free Cluster**:
   - Choose "Shared" (Free tier)
   - Select region closest to your backend
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `pitchzone_user`
   - Password: Generate strong password
   - Save credentials!

4. **Whitelist IP Addresses**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://pitchzone_user:<password>@cluster0.xxxxx.mongodb.net/pitchzone?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

6. **Update Backend Environment Variable**:
   - Go back to Render/Railway
   - Update `MONGO_URI` with your connection string

---

### **STEP 3: Deploy Frontend (Vercel)**

1. **Update API URL**:
   - Open `client/src/config/api.js`
   - Update:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pitchzone-backend.onrender.com/api';
   ```

2. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)

3. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select repository

4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://pitchzone-backend.onrender.com/api
   ```

6. **Deploy**: Click "Deploy"

7. **Copy Frontend URL**: Save it (e.g., `https://pitchzone.vercel.app`)

---

### **STEP 4: Update CORS**

1. Go back to your backend deployment (Render/Railway)
2. Update environment variable:
   ```
   FRONTEND_URL=https://pitchzone.vercel.app
   ```
3. Redeploy backend

---

## 🔧 Environment Variables Summary

### Backend (.env on Render/Railway):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchzone
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
FRONTEND_URL=https://pitchzone.vercel.app
```

### Frontend (.env on Vercel):
```env
VITE_API_URL=https://pitchzone-backend.onrender.com/api
```

---

## 🧪 Testing Deployment

1. **Test Backend**:
   ```bash
   curl https://pitchzone-backend.onrender.com
   ```
   Should return: `{"message": "Welcome to PitchZone API!"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try logging in
   - Check browser console for errors

3. **Test Database**:
   - Create a new account
   - Login
   - Create a pitch
   - Verify data persists

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**:
- Verify `FRONTEND_URL` is set correctly in backend
- Check CORS configuration in `server.js`
- Redeploy backend after changes

### Issue 2: MongoDB Connection Failed
**Error**: "MongoServerError: bad auth"

**Solution**:
- Verify MongoDB Atlas username/password
- Check connection string format
- Ensure IP whitelist includes 0.0.0.0/0

### Issue 3: 404 on API Calls
**Error**: "Cannot GET /api/auth/login"

**Solution**:
- Verify `VITE_API_URL` includes `/api`
- Check backend logs for route errors
- Ensure backend is running

### Issue 4: JWT Errors
**Error**: "jwt malformed" or "invalid token"

**Solution**:
- Clear browser localStorage
- Verify `JWT_SECRET` is set in backend
- Check token expiration (7 days default)

---

## 📊 Monitoring

### Backend Logs (Render):
- Go to your service → "Logs" tab
- Monitor for errors

### Frontend Logs (Vercel):
- Go to your project → "Deployments" → Click deployment → "Functions" tab

### Database Monitoring (MongoDB Atlas):
- Go to "Metrics" tab
- Monitor connections, operations, storage

---

## 🔒 Security Checklist

- ✅ Strong JWT_SECRET (min 32 characters)
- ✅ MongoDB user has limited permissions
- ✅ Environment variables not in code
- ✅ CORS restricted to your frontend domain
- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ .env files in .gitignore

---

## 🎉 You're Done!

Your PitchZone application is now live and accessible worldwide!

**Backend**: https://pitchzone-backend.onrender.com  
**Frontend**: https://pitchzone.vercel.app  
**Database**: MongoDB Atlas (Cloud)

---

## 📝 Notes

- **Free Tier Limitations**:
  - Render: Backend sleeps after 15 min inactivity (cold start ~30s)
  - Vercel: 100GB bandwidth/month
  - MongoDB Atlas: 512MB storage

- **Custom Domain** (Optional):
  - Vercel: Settings → Domains → Add custom domain
  - Follow DNS configuration instructions

- **Continuous Deployment**:
  - Both Vercel and Render auto-deploy on git push
  - Push to main/master branch to trigger deployment
