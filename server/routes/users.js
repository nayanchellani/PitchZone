const express = require('express');
const { param, validationResult } = require('express-validator');
const User = require('../models/User');
const Pitch = require('../models/Pitch');
const { authenticateToken, requireInvestor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid user ID',
        success: false
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    // Get user's pitches if entrepreneur
    let userPitches = [];
    if (user.role === 'entrepreneur') {
      userPitches = await Pitch.find({ entrepreneur: user._id })
        .select('title description targetAmount raisedAmount status createdAt')
        .sort({ createdAt: -1 });
    }

    res.json({
      message: 'User profile retrieved successfully',
      success: true,
      user: user.getPublicProfile(),
      pitches: userPitches
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching user profile',
      success: false
    });
  }
});

// @route   GET /api/users/investors
// @desc    Get list of investors (for entrepreneurs to see potential investors)
// @access  Private
router.get('/investors', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get investors
    const investors = await User.find({ role: 'investor' })
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count
    const totalInvestors = await User.countDocuments({ role: 'investor' });
    const totalPages = Math.ceil(totalInvestors / parseInt(limit));

    res.json({
      message: 'Investors retrieved successfully',
      success: true,
      investors,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalInvestors,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({
      message: 'Server error while fetching investors',
      success: false
    });
  }
});

// @route   GET /api/users/entrepreneurs
// @desc    Get list of entrepreneurs (for investors to see)
// @access  Private
router.get('/entrepreneurs', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get entrepreneurs with their active pitches
    const entrepreneurs = await User.find({ role: 'entrepreneur' })
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get their active pitches
    const entrepreneursWithPitches = await Promise.all(
      entrepreneurs.map(async (entrepreneur) => {
        const activePitches = await Pitch.find({
          entrepreneur: entrepreneur._id,
          status: 'Active'
        }).select('title targetAmount raisedAmount');

        return {
          ...entrepreneur.toObject(),
          activePitches
        };
      })
    );

    // Get total count
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });
    const totalPages = Math.ceil(totalEntrepreneurs / parseInt(limit));

    res.json({
      message: 'Entrepreneurs retrieved successfully',
      success: true,
      entrepreneurs: entrepreneursWithPitches,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEntrepreneurs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get entrepreneurs error:', error);
    res.status(500).json({
      message: 'Server error while fetching entrepreneurs',
      success: false
    });
  }
});

// @route   GET /api/users/my/investments
// @desc    Get current user's investments (Investor only)
// @access  Private (Investor)
router.get('/my/investments', [
  authenticateToken,
  requireInvestor
], async (req, res) => {
  try {
    // Find all pitches where user has invested
    const pitchesWithInvestments = await Pitch.find({
      'investors.userId': req.user._id
    })
    .populate('entrepreneur', 'username email fullName')
    .sort({ 'investors.investedAt': -1 });

    // Extract investment details
    const investments = pitchesWithInvestments.map(pitch => {
      const userInvestment = pitch.investors.find(
        inv => inv.userId.toString() === req.user._id.toString()
      );

      return {
        pitch: {
          _id: pitch._id,
          title: pitch.title,
          description: pitch.description,
          targetAmount: pitch.targetAmount,
          raisedAmount: pitch.raisedAmount,
          status: pitch.status,
          entrepreneur: pitch.entrepreneur,
          fundingPercentage: pitch.fundingPercentage
        },
        investment: {
          amount: userInvestment.amount,
          investedAt: userInvestment.investedAt
        }
      };
    });

    // Calculate total invested
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investment.amount, 0);

    res.json({
      message: 'Your investments retrieved successfully',
      success: true,
      investments,
      summary: {
        totalInvestments: investments.length,
        totalAmountInvested: totalInvested,
        activeInvestments: investments.filter(inv => inv.pitch.status === 'Active').length
      }
    });

  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      message: 'Server error while fetching investments',
      success: false
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get platform statistics
    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });
    const totalInvestors = await User.countDocuments({ role: 'investor' });
    
    const totalPitches = await Pitch.countDocuments();
    const activePitches = await Pitch.countDocuments({ status: 'Active' });
    const fundedPitches = await Pitch.countDocuments({ status: 'Funded' });
    
    // Calculate total funding
    const fundingStats = await Pitch.aggregate([
      {
        $group: {
          _id: null,
          totalTargetAmount: { $sum: '$targetAmount' },
          totalRaisedAmount: { $sum: '$raisedAmount' }
        }
      }
    ]);

    const stats = {
      users: {
        total: totalUsers,
        entrepreneurs: totalEntrepreneurs,
        investors: totalInvestors
      },
      pitches: {
        total: totalPitches,
        active: activePitches,
        funded: fundedPitches,
        successRate: totalPitches > 0 ? ((fundedPitches / totalPitches) * 100).toFixed(1) : 0
      },
      funding: {
        totalTarget: fundingStats[0]?.totalTargetAmount || 0,
        totalRaised: fundingStats[0]?.totalRaisedAmount || 0,
        averageRaised: totalPitches > 0 ? (fundingStats[0]?.totalRaisedAmount || 0) / totalPitches : 0
      }
    };

    res.json({
      message: 'Platform statistics retrieved successfully',
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching statistics',
      success: false
    });
  }
});

module.exports = router;