# PitchZone Admin System Setup

## Overview
This system provides a complete admin backend with full access to manage users, pitches, and all backend operations.

## Features
- **Admin Dashboard**: Complete overview of system statistics
- **User Management**: View, edit, and delete users
- **Pitch Management**: View, edit, and delete pitches
- **Role-based Authentication**: Secure admin-only access
- **Database Integration**: All data stored in MongoDB
- **Registration Flow**: Users redirected to login after account creation

## Setup Instructions

### 1. Backend Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/pitchzone
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   This will create an admin user with:
   - **Email**: admin@pitchzone.com
   - **Password**: admin123
   - **Role**: admin
   
   If the admin user already exists, the script will show the existing credentials.

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

## Admin Access

### Login Credentials
- **Email**: admin@pitchzone.com
- **Password**: admin123
- **URL**: http://localhost:3000/login

### Admin Dashboard Features

1. **Dashboard Overview**
   - Total users count
   - Entrepreneurs count
   - Investors count
   - Total pitches count
   - Recent activity

2. **User Management**
   - View all users with pagination
   - Filter by role (entrepreneur/investor)
   - Search by username, email, or full name
   - Delete users (except admin users)
   - View user details and associated pitches

3. **Pitch Management**
   - View all pitches with pagination
   - Filter by status
   - Search by title, description, or industry
   - Delete pitches
   - View pitch details

## API Endpoints

### Admin Routes (Require Admin Authentication)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with pagination
- `GET /api/admin/users/:id` - Get single user details
- `PUT /api/admin/users/:id` - Update user details
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/pitches` - Get all pitches with pagination
- `GET /api/admin/pitches/:id` - Get single pitch details
- `PUT /api/admin/pitches/:id` - Update pitch details
- `DELETE /api/admin/pitches/:id` - Delete pitch
- `POST /api/admin/create-user` - Create new user

### Authentication Flow
1. **Registration**: Users create account → Redirected to login page
2. **Login**: Users login → Redirected based on role:
   - Admin → `/admin` (Admin Dashboard)
   - Others → `/home` (Regular Dashboard)

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-based Access Control**: Admin-only routes protected
3. **Password Hashing**: Bcrypt with salt rounds
4. **Input Validation**: Express-validator for all inputs
5. **CORS Configuration**: Proper cross-origin setup

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (entrepreneur/investor/admin),
  fullName: String,
  bio: String,
  linkedinUrl: String,
  companyName: String,
  industry: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Pitch Model
```javascript
{
  title: String,
  description: String,
  industry: String,
  fundingGoal: Number,
  entrepreneur: ObjectId (ref: User),
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Investor Access Code
For investor registration, use the access code: `INVESTOR_ACCESS_2024`

## Troubleshooting

1. **Admin user already exists**: If you see this message, the admin user is already created
2. **Database connection error**: Make sure MongoDB is running
3. **JWT errors**: Check if JWT_SECRET is set in .env file
4. **CORS errors**: Ensure frontend is running on http://localhost:3000

## Security Notes

⚠️ **Important**: Change the default admin password after first login!

The system is configured for development. For production:
1. Use strong, unique passwords
2. Configure proper CORS origins
3. Use HTTPS
4. Set secure JWT secrets
5. Configure proper database security

## Support

For issues or questions, check the console logs for detailed error messages.