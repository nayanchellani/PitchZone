# Development Setup Instructions

## Quick Start Guide

### 1. Start Backend Server

```bash
cd server
npm install
npm run create-admin
npm run dev
```

The backend will run on: http://localhost:5000

### 2. Start Frontend (in a new terminal)

```bash
cd client
npm install
npm run dev
```

The frontend will run on: http://localhost:5173 (or another port if 5173 is busy)

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Login**: 
  - Email: admin@pitchzone.com
  - Password: admin123

### 4. Test the Setup

1. Go to http://localhost:5173
2. Click "Create Account" to register a new user
3. After registration, login with your credentials
4. You should see the dashboard with real data

### Troubleshooting

If you see "Failed to fetch" errors:

1. **Check Backend**: Make sure the backend is running on port 5000
2. **Check Frontend**: Make sure the frontend is running on port 5173
3. **Check MongoDB**: Make sure MongoDB is running locally
4. **Check Console**: Look for any error messages in browser console

### Database Setup

If you don't have MongoDB installed locally:

1. **Install MongoDB**: https://www.mongodb.com/try/download/community
2. **Start MongoDB**: `mongod` (or use MongoDB Compass)
3. **Alternative**: Use MongoDB Atlas (cloud) and update MONGO_URI in server/.env

### Environment Variables

Make sure your `server/.env` file has:

```
MONGO_URI=mongodb://localhost:27017/pitchzone
JWT_SECRET=pitchzone_super_secret_jwt_key_2024_make_it_very_long_and_random
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```