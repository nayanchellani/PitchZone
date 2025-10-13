# 🔐 Admin Access Instructions

## Admin Credentials

### Default Admin Login:

- **Email:** `admin@pitchzone.com`
- **Password:** `admin123`
- **Login URL:** http://localhost:3000/login

## Setup Steps

### 1. Start the Backend Server

```bash
cd server
npm install
npm run create-admin
npm run dev
```

The `create-admin` script will:

- Create the admin user if it doesn't exist
- Show existing credentials if admin already exists
- Display the login information

### 2. Start the Frontend

```bash
cd client
npm install
npm start
```

### 3. Access Admin Panel

1. Go to http://localhost:3000/login
2. Enter admin credentials:
   - Email: `admin@pitchzone.com`
   - Password: `admin123`
3. You'll be automatically redirected to `/admin`

## Admin Dashboard Features

### 📊 Dashboard Overview

- Total users count
- Entrepreneurs count
- Investors count
- Total pitches count

### 👥 User Management

- View all users with pagination
- Filter by role (entrepreneur/investor/admin)
- Search by username, email, or full name
- Delete users (except admin users)
- View user details

### 🎯 Pitch Management

- View all pitches with pagination
- Filter by status
- Search by title, description, or industry
- Delete pitches
- View pitch details

## Authentication Flow Fixed

✅ **Registration Flow:**

- Users create account → Redirected to login page
- Success message displayed

✅ **Login Flow:**

- Admin users → Redirected to `/admin`
- Regular users → Redirected to `/home`
- Invalid credentials → Error message shown

✅ **Route Protection:**

- Admin routes require admin role
- User routes require authentication
- Automatic redirects based on user role

## Security Features

- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Protected admin routes
- Input validation on all forms

## Troubleshooting

### Can't Login as Admin?

1. Make sure you ran `npm run create-admin`
2. Check the console output for admin credentials
3. Verify MongoDB is running
4. Check browser network tab for API errors

### Admin User Already Exists?

- The script will show existing credentials
- Use the displayed email/password to login

### Database Connection Issues?

- Make sure MongoDB is running
- Check the `.env` file has correct MONGO_URI
- For local MongoDB: `mongodb://localhost:27017/pitchzone`

### CORS Errors?

- Make sure frontend is on http://localhost:3000
- Make sure backend is on http://localhost:5000
- Check both servers are running

## Change Admin Password

⚠️ **Important:** Change the default password after first login!

1. Login to admin panel
2. Go to user management
3. Find your admin user
4. Update the password
5. Or create a new admin user and delete the default one

## Investor Access Code

For testing investor registration: `INVESTOR_ACCESS_2024`

---

**Need Help?** Check the browser console and server logs for detailed error messages.
