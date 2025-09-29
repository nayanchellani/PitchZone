# PitchZone Backend API

A Node.js + Express backend for PitchZone - Virtual Shark Tank Experience.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. **Clone and navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your actual values:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchzone
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

4. **Start the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection config
├── middleware/
│   └── auth.js              # Authentication & authorization middleware
├── models/
│   ├── User.js              # User model (entrepreneurs & investors)
│   └── Pitch.js             # Pitch model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── pitches.js           # Pitch management routes
│   └── users.js             # User management routes
├── utils/
│   ├── validation.js        # Validation utilities
│   └── response.js          # API response utilities
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── server.js                # Main server file
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Headers
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **entrepreneur**: Can create and manage pitches
- **investor**: Can invest in pitches and leave feedback

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| POST | `/logout` | Logout user | Private |

### Pitch Routes (`/api/pitches`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/create` | Create new pitch | Entrepreneur |
| GET | `/` | Get all pitches | Public |
| GET | `/:id` | Get single pitch | Public |
| POST | `/:id/invest` | Invest in pitch | Investor |
| POST | `/:id/feedback` | Leave feedback | Investor |
| GET | `/my/pitches` | Get user's pitches | Entrepreneur |
| PUT | `/:id` | Update pitch | Entrepreneur (own) |
| DELETE | `/:id` | Close pitch | Entrepreneur (own) |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile/:id` | Get user profile | Public |
| GET | `/investors` | Get investors list | Private |
| GET | `/entrepreneurs` | Get entrepreneurs list | Private |
| GET | `/my/investments` | Get user's investments | Investor |
| GET | `/stats` | Get platform statistics | Public |

## 📝 API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "entrepreneur",
  "fullName": "John Doe"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Pitch
```bash
POST /api/pitches/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "AI Notes Summarizer",
  "description": "An app that converts lecture notes into flashcards using AI",
  "targetAmount": 50000,
  "category": "Technology",
  "equityOffered": 10
}
```

### Invest in Pitch
```bash
POST /api/pitches/:id/invest
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 5000
}
```

### Leave Feedback
```bash
POST /api/pitches/:id/feedback
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "Great idea! Love the AI integration.",
  "rating": 5
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (entrepreneur | investor),
  fullName: String,
  bio: String,
  linkedinUrl: String,
  // ... other fields
}
```

### Pitch Model
```javascript
{
  title: String,
  description: String,
  targetAmount: Number,
  raisedAmount: Number (default: 0),
  entrepreneur: ObjectId (User ref),
  investors: [{ userId: ObjectId, amount: Number }],
  feedback: [{ userId: ObjectId, message: String, rating: Number }],
  status: String (Active | Funded | Closed | Paused),
  // ... other fields
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- CORS protection
- Environment variable protection

## 🚦 Error Handling

The API returns standardized error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [...], // Optional validation errors
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Response Format

All API responses follow this format:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {...}, // Optional data
  "pagination": {...}, // Optional pagination info
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)
4. Update CORS settings for production frontend URL

## 📞 Support

For issues and questions, please check the API documentation or contact the development team.