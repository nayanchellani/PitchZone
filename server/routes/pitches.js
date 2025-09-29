const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Pitch = require('../models/Pitch');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireEntrepreneur, 
  requireInvestor, 
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/pitches/create
// @desc    Create a new pitch (Entrepreneur only)
// @access  Private (Entrepreneur)
router.post('/create', [
  authenticateToken,
  requireEntrepreneur,
  // Validation middleware
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('targetAmount')
    .isNumeric()
    .isFloat({ min: 1000, max: 100000000 })
    .withMessage('Target amount must be between ₹1,000 and ₹10 crores'),
  body('category')
    .optional()
    .isIn(['Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Food & Beverage', 'Entertainment', 'Other'])
    .withMessage('Invalid category'),
  body('equityOffered')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Equity offered must be between 0.1% and 100%')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const { title, description, targetAmount, category, equityOffered, stage, deadline } = req.body;

    // Check if entrepreneur already has an active pitch
    const existingPitch = await Pitch.findOne({
      entrepreneur: req.user._id,
      status: 'Active'
    });

    if (existingPitch) {
      return res.status(400).json({
        message: 'You already have an active pitch. Please close it before creating a new one.',
        success: false
      });
    }

    // Create new pitch
    const pitch = new Pitch({
      title,
      description,
      targetAmount,
      entrepreneur: req.user._id,
      category: category || 'Other',
      equityOffered,
      stage,
      deadline: deadline ? new Date(deadline) : undefined
    });

    await pitch.save();

    // Populate entrepreneur details
    await pitch.populate('entrepreneur', 'username email fullName');

    res.status(201).json({
      message: 'Pitch created successfully',
      success: true,
      pitch
    });

  } catch (error) {
    console.error('Create pitch error:', error);
    res.status(500).json({
      message: 'Server error while creating pitch',
      success: false
    });
  }
});

// @route   GET /api/pitches
// @desc    Get all pitches (with optional filtering)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      status = 'Active', 
      category, 
      sortBy = 'createdAt', 
      order = 'desc',
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get pitches with pagination
    const pitches = await Pitch.find(query)
      .populate('entrepreneur', 'username email fullName')
      .populate('investors.userId', 'username fullName')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalPitches = await Pitch.countDocuments(query);
    const totalPages = Math.ceil(totalPitches / parseInt(limit));

    res.json({
      message: 'Pitches retrieved successfully',
      success: true,
      pitches,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPitches,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get pitches error:', error);
    res.status(500).json({
      message: 'Server error while fetching pitches',
      success: false
    });
  }
});

// @route   GET /api/pitches/:id
// @desc    Get single pitch details
// @access  Public
router.get('/:id', [
  optionalAuth,
  param('id').isMongoId().withMessage('Invalid pitch ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
        success: false
      });
    }

    const pitch = await Pitch.findById(req.params.id)
      .populate('entrepreneur', 'username email fullName bio companyName')
      .populate('investors.userId', 'username fullName')
      .populate('feedback.userId', 'username fullName');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
        success: false
      });
    }

    // Increment view count (only if not the owner)
    if (!req.user || req.user._id.toString() !== pitch.entrepreneur._id.toString()) {
      pitch.views += 1;
      await pitch.save();
    }

    res.json({
      message: 'Pitch retrieved successfully',
      success: true,
      pitch
    });

  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({
      message: 'Server error while fetching pitch',
      success: false
    });
  }
});

// @route   POST /api/pitches/:id/invest
// @desc    Invest in a pitch (Investor only)
// @access  Private (Investor)
router.post('/:id/invest', [
  authenticateToken,
  requireInvestor,
  param('id').isMongoId().withMessage('Invalid pitch ID'),
  body('amount')
    .isNumeric()
    .isFloat({ min: 100 })
    .withMessage('Investment amount must be at least ₹100')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const { amount } = req.body;
    const pitchId = req.params.id;

    // Find the pitch
    const pitch = await Pitch.findById(pitchId)
      .populate('entrepreneur', 'username email fullName');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
        success: false
      });
    }

    // Check if pitch is active
    if (pitch.status !== 'Active') {
      return res.status(400).json({
        message: 'This pitch is no longer accepting investments',
        success: false
      });
    }

    // Check if investor is trying to invest in their own pitch
    if (pitch.entrepreneur._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot invest in your own pitch',
        success: false
      });
    }

    // Add investment
    await pitch.addInvestment(req.user._id, parseFloat(amount));

    // Populate the updated pitch
    await pitch.populate('investors.userId', 'username fullName');

    res.json({
      message: 'Investment successful',
      success: true,
      pitch,
      investment: {
        amount: parseFloat(amount),
        investor: req.user.username
      }
    });

  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({
      message: 'Server error while processing investment',
      success: false
    });
  }
});

// @route   POST /api/pitches/:id/feedback
// @desc    Leave feedback on a pitch (Investor only)
// @access  Private (Investor)
router.post('/:id/feedback', [
  authenticateToken,
  requireInvestor,
  param('id').isMongoId().withMessage('Invalid pitch ID'),
  body('message')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Feedback must be between 5 and 500 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const { message, rating } = req.body;
    const pitchId = req.params.id;

    // Find the pitch
    const pitch = await Pitch.findById(pitchId);

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
        success: false
      });
    }

    // Check if user already left feedback
    const existingFeedback = pitch.feedback.find(
      fb => fb.userId.toString() === req.user._id.toString()
    );

    if (existingFeedback) {
      return res.status(400).json({
        message: 'You have already left feedback for this pitch',
        success: false
      });
    }

    // Add feedback
    await pitch.addFeedback(req.user._id, message, rating);

    // Populate the updated pitch
    await pitch.populate('feedback.userId', 'username fullName');

    res.json({
      message: 'Feedback added successfully',
      success: true,
      feedback: {
        message,
        rating,
        user: req.user.username
      }
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      message: 'Server error while adding feedback',
      success: false
    });
  }
});

// @route   GET /api/pitches/my/pitches
// @desc    Get current user's pitches (Entrepreneur only)
// @access  Private (Entrepreneur)
router.get('/my/pitches', [
  authenticateToken,
  requireEntrepreneur
], async (req, res) => {
  try {
    const pitches = await Pitch.findByEntrepreneur(req.user._id);

    res.json({
      message: 'Your pitches retrieved successfully',
      success: true,
      pitches
    });

  } catch (error) {
    console.error('Get my pitches error:', error);
    res.status(500).json({
      message: 'Server error while fetching your pitches',
      success: false
    });
  }
});

// @route   PUT /api/pitches/:id
// @desc    Update pitch (Entrepreneur only - own pitch)
// @access  Private (Entrepreneur)
router.put('/:id', [
  authenticateToken,
  requireEntrepreneur,
  param('id').isMongoId().withMessage('Invalid pitch ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const pitch = await Pitch.findById(req.params.id);

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
        success: false
      });
    }

    // Check if user owns this pitch
    if (pitch.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only update your own pitches',
        success: false
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'stage', 'equityOffered'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedPitch = await Pitch.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('entrepreneur', 'username email fullName');

    res.json({
      message: 'Pitch updated successfully',
      success: true,
      pitch: updatedPitch
    });

  } catch (error) {
    console.error('Update pitch error:', error);
    res.status(500).json({
      message: 'Server error while updating pitch',
      success: false
    });
  }
});

// @route   DELETE /api/pitches/:id
// @desc    Delete/Close pitch (Entrepreneur only - own pitch)
// @access  Private (Entrepreneur)
router.delete('/:id', [
  authenticateToken,
  requireEntrepreneur,
  param('id').isMongoId().withMessage('Invalid pitch ID')
], async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id);

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
        success: false
      });
    }

    // Check if user owns this pitch
    if (pitch.entrepreneur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own pitches',
        success: false
      });
    }

    // Instead of deleting, mark as closed
    pitch.status = 'Closed';
    await pitch.save();

    res.json({
      message: 'Pitch closed successfully',
      success: true
    });

  } catch (error) {
    console.error('Delete pitch error:', error);
    res.status(500).json({
      message: 'Server error while closing pitch',
      success: false
    });
  }
});

module.exports = router;