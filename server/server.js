const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const authRoutes = require('./routes/auth');
const pitchRoutes = require('./routes/pitches');
const adminRoutes = require('./routes/admin');


const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://pitch-zone.vercel.app/',

].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/admin', adminRoutes);


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


app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 API endpoints available at: http://localhost:${PORT}/api`);
  });
});


process.on('unhandledRejection', (err) => {
  console.log('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});