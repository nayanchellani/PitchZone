const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authenticateToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        success: false 
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.',
        success: false 
      });
    }


    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.',
        success: false 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.',
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during authentication.',
      success: false 
    });
  }
};


const requireEntrepreneur = (req, res, next) => {
  if (req.user && req.user.role === 'entrepreneur') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Entrepreneur role required.',
      success: false 
    });
  }
};


const requireInvestor = (req, res, next) => {
  if (req.user && req.user.role === 'investor') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Investor role required.',
      success: false 
    });
  }
};


const requireAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'entrepreneur' || req.user.role === 'investor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Authentication required.',
      success: false 
    });
  }
};


const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin role required.',
      success: false 
    });
  }
};


const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {

    next();
  }
};

module.exports = {
  authenticateToken,
  requireEntrepreneur,
  requireInvestor,
  requireAuth,
  requireAdmin,
  optionalAuth
};