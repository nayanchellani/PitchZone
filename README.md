# 🚀 PitchZone - Virtual Shark Tank Platform

A full-stack web application where entrepreneurs can pitch their ideas and investors can discover and invest in promising startups.

## 🎯 Features

- **User Authentication**: Secure login/signup for entrepreneurs and investors
- **Pitch Management**: Create, view, and manage startup pitches
- **Investment System**: Investors can invest in pitches they like
- **Admin Dashboard**: Complete admin panel for managing users and pitches
- **Profile Management**: Comprehensive user profiles with completion tracking
- **Real-time Data**: All data stored and retrieved from MongoDB database

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Modern CSS with custom animations
- Responsive design

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pitchzone
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
MONGO_URI=mongodb://localhost:27017/pitchzone
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

Create admin user:
```bash
npm run create-admin
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: Login with admin@pitchzone.com / admin123

## 📱 Usage

### For Entrepreneurs
1. **Sign Up**: Create an account as an entrepreneur
2. **Complete Profile**: Fill in your personal and company information
3. **Create Pitch**: Submit your startup pitch with funding goals
4. **Track Progress**: Monitor investments and feedback

### For Investors
1. **Sign Up**: Create an account as an investor (use access code: `INVESTOR_ACCESS_2024`)
2. **Browse Pitches**: Explore available startup pitches
3. **Invest**: Invest in promising startups
4. **Track Portfolio**: Monitor your investments

### For Admins
1. **Login**: Use admin credentials
2. **Dashboard**: View system statistics
3. **Manage Users**: View, edit, or delete users
4. **Manage Pitches**: Oversee all pitches in the system

## 🎨 Design Features

### Color Scheme
- **Primary Dark**: #0B0C10 (Very Dark Gray/Near Black)
- **Secondary Dark**: #1F2833 (Dark Slate Gray/Blue)
- **Light Gray**: #C5C6C7 (Light Gray)
- **Vibrant Cyan**: #66FCF1 (Vibrant Cyan/Aqua)
- **Teal**: #45A29E (Teal/Seafoam Green)

### Animations
- **Auth Buttons**: Smooth underline animation on hover
- **Action Buttons**: Background fill animation with scale effect
- **Cards**: Lift effect with glow shadows
- **Transitions**: Consistent 0.3-0.4s smooth transitions

## 📁 Project Structure

```
pitchzone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Pages/         # React components
│   │   ├── components/    # Reusable components
│   │   └── App.css        # Styles
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── scripts/          # Utility scripts
└── docs/                 # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Pitches
- `GET /api/pitches` - Get all pitches
- `POST /api/pitches/create` - Create new pitch
- `GET /api/pitches/:id` - Get pitch details
- `POST /api/pitches/:id/invest` - Invest in pitch
- `GET /api/pitches/my/pitches` - Get user's pitches

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pitches` - Get all pitches
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/pitches/:id` - Delete pitch

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS protection
- Protected admin routes

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Make sure backend is running on port 5000
   - Check MongoDB connection
   - Verify CORS settings

2. **Database connection errors**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Try using MongoDB Atlas for cloud database

3. **Authentication issues**
   - Clear browser localStorage
   - Re-login with correct credentials
   - Check JWT_SECRET in .env

### Debug Steps
1. Check browser console for errors
2. Verify backend logs for API errors
3. Test API endpoints manually
4. Ensure all dependencies are installed

## 📝 Environment Variables

### Server (.env)
```env
MONGO_URI=mongodb://localhost:27017/pitchzone
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting guide
2. Review the console logs
3. Ensure all services are running
4. Verify environment variables

---

**Happy Pitching! 🚀**