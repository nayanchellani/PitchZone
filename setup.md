# PitchZone Setup Guide

## Quick Start

### 1. Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   copy .env.example .env
   ```
   
   Edit the `.env` file with your MongoDB connection string if needed.

4. **Create admin user:**
   ```bash
   npm run create-admin
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm start
   ```

## Admin Access

### Default Admin Credentials:
- **Email:** admin@pitchzone.com
- **Password:** admin123
- **Login URL:** http://localhost:3000/login

⚠️ **Important:** Change the admin password after first login!

## User Flow

1. **Registration:** Users create account → Redirected to login page
2. **Login:** Users login → Redirected based on role:
   - Admin → `/admin` (Admin Dashboard)
   - Others → `/home` (User Dashboard)

## Investor Registration

Investors need the access code: `INVESTOR_ACCESS_2024`

## Troubleshooting

- Make sure MongoDB is running (if using local MongoDB)
- Check that both frontend (port 3000) and backend (port 5000) are running
- Verify the .env file has correct database connection string
- Check browser console for any errors

## Features

### Admin Dashboard:
- View system statistics
- Manage users (view, delete)
- Manage pitches (view, delete)
- WordPress-style admin interface

### User Features:
- Role-based registration (Entrepreneur/Investor)
- Secure authentication
- Dashboard based on user role
- Pitch creation and management