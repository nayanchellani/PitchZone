const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const pitchRoutes = require('./routes/pitches');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL // Production frontend URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/admin', adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PitchZone API!',
    status: 'Server is running successfully',
    endpoints: {
      auth: '/api/auth',
      pitches: '/api/pitches',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 API endpoints available at: http://localhost:${PORT}/api`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});