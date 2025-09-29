const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      success: false,
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Custom validation functions
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

const validatePitchData = (pitchData) => {
  const errors = [];
  
  if (!pitchData.title || pitchData.title.length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  
  if (!pitchData.description || pitchData.description.length < 20) {
    errors.push('Description must be at least 20 characters long');
  }
  
  if (!pitchData.targetAmount || pitchData.targetAmount < 1000) {
    errors.push('Target amount must be at least ₹1,000');
  }
  
  if (pitchData.equityOffered && (pitchData.equityOffered < 0.1 || pitchData.equityOffered > 100)) {
    errors.push('Equity offered must be between 0.1% and 100%');
  }
  
  return errors;
};

const validateUserData = (userData) => {
  const errors = [];
  
  if (!userData.username || userData.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!userData.role || !['entrepreneur', 'investor'].includes(userData.role)) {
    errors.push('Role must be either entrepreneur or investor');
  }
  
  return errors;
};

module.exports = {
  handleValidationErrors,
  isValidObjectId,
  isValidEmail,
  isStrongPassword,
  sanitizeInput,
  validatePitchData,
  validateUserData
};