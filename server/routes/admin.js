const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Pitch = require('../models/Pitch');

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });
    const totalInvestors = await User.countDocuments({ role: 'investor' });
    const totalPitches = await Pitch.countDocuments();
    
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent pitches (last 10)
    const recentPitches = await Pitch.find()
      .populate('entrepreneur', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalEntrepreneurs,
          totalInvestors,
          totalPitches
        },
        recentUsers,
        recentPitches
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;

    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user details
// @access  Admin only
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's pitches if entrepreneur
    let pitches = [];
    if (user.role === 'entrepreneur') {
      pitches = await Pitch.find({ entrepreneur: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        pitches
      }
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user details
// @access  Admin only
router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, email, role, bio, linkedinUrl, companyName, industry } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (bio !== undefined) user.bio = bio;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (companyName !== undefined) user.companyName = companyName;
    if (industry !== undefined) user.industry = industry;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin only
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete user's pitches if entrepreneur
    if (user.role === 'entrepreneur') {
      await Pitch.deleteMany({ entrepreneur: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// @route   GET /api/admin/pitches
// @desc    Get all pitches with pagination and filtering
// @access  Admin only
router.get('/pitches', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const pitches = await Pitch.find(query)
      .populate('entrepreneur', 'username fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Pitch.countDocuments(query);

    res.json({
      success: true,
      data: {
        pitches,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Admin get pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pitches'
    });
  }
});

// @route   GET /api/admin/pitches/:id
// @desc    Get single pitch details
// @access  Admin only
router.get('/pitches/:id', async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id)
      .populate('entrepreneur', 'username fullName email companyName');
    
    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    res.json({
      success: true,
      data: pitch
    });
  } catch (error) {
    console.error('Admin get pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pitch details'
    });
  }
});

// @route   PUT /api/admin/pitches/:id
// @desc    Update pitch details
// @access  Admin only
router.put('/pitches/:id', async (req, res) => {
  try {
    const { title, description, industry, fundingGoal, status } = req.body;
    
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    // Update fields
    if (title !== undefined) pitch.title = title;
    if (description !== undefined) pitch.description = description;
    if (industry !== undefined) pitch.industry = industry;
    if (fundingGoal !== undefined) pitch.fundingGoal = fundingGoal;
    if (status !== undefined) pitch.status = status;

    await pitch.save();

    res.json({
      success: true,
      message: 'Pitch updated successfully',
      data: pitch
    });
  } catch (error) {
    console.error('Admin update pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pitch'
    });
  }
});

// @route   DELETE /api/admin/pitches/:id
// @desc    Delete pitch
// @access  Admin only
router.delete('/pitches/:id', async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id);
    
    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    await Pitch.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pitch deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pitch'
    });
  }
});

// @route   POST /api/admin/create-user
// @desc    Create new user (admin function)
// @access  Admin only
router.post('/create-user', async (req, res) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username is already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      fullName: fullName || username
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

module.exports = router;