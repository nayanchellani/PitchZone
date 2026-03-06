const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Pitch title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Pitch description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [1000, 'Target amount must be at least ₹1,000'],
    max: [100000000, 'Target amount cannot exceed ₹10 crores']
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Raised amount cannot be negative']
  },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Entrepreneur is required']
  },

  investors: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [100, 'Minimum investment is ₹100']
    },
    investedAt: {
      type: Date,
      default: Date.now
    }
  }],

  feedback: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  category: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Food & Beverage', 'Entertainment', 'Other'],
    default: 'Other'
  },
  stage: {
    type: String,
    enum: ['Idea', 'Prototype', 'MVP', 'Early Revenue', 'Growth'],
    default: 'Idea'
  },
  equityOffered: {
    type: Number,
    min: [0.1, 'Minimum equity is 0.1%'],
    max: [100, 'Maximum equity is 100%']
  },

  status: {
    type: String,
    enum: ['Active', 'Funded', 'Closed', 'Paused'],
    default: 'Active'
  },

  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String // URLs to images
  }],
  documents: [{
    name: String,
    url: String,
    type: String // 'business-plan', 'financial-projection', etc.
  }],

  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  deadline: {
    type: Date
  }
}, {
  timestamps: true
});


pitchSchema.virtual('fundingPercentage').get(function () {
  return this.targetAmount > 0 ? (this.raisedAmount / this.targetAmount) * 100 : 0;
});


pitchSchema.virtual('totalInvestors').get(function () {
  return this.investors.length;
});


pitchSchema.virtual('averageRating').get(function () {
  if (this.feedback.length === 0) return 0;
  const totalRating = this.feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0);
  return totalRating / this.feedback.length;
});

pitchSchema.methods.addInvestment = function (userId, amount) {
  // Check if user already invested
  const existingInvestment = this.investors.find(inv => inv.userId.toString() === userId.toString());

  if (existingInvestment) {
    // Update existing investment
    existingInvestment.amount += amount;
  } else {
    // Add new investment
    this.investors.push({ userId, amount });
  }

  // Update raised amount
  this.raisedAmount += amount;

  // Check if funding goal is reached
  if (this.raisedAmount >= this.targetAmount && this.status === 'Active') {
    this.status = 'Funded';
  }

  return this.save();
};

pitchSchema.methods.addFeedback = function (userId, message, rating = null) {
  this.feedback.push({
    userId,
    message,
    rating,
    createdAt: new Date()
  });

  return this.save();
};

pitchSchema.statics.findByEntrepreneur = function (entrepreneurId) {
  return this.find({ entrepreneur: entrepreneurId })
    .populate('entrepreneur', 'username email fullName')
    .populate('investors.userId', 'username fullName')
    .populate('feedback.userId', 'username fullName');
};

pitchSchema.statics.getActivePitches = function () {
  return this.find({ status: 'Active' })
    .populate('entrepreneur', 'username email fullName')
    .sort({ createdAt: -1 });
};


pitchSchema.index({ entrepreneur: 1 });
pitchSchema.index({ status: 1 });
pitchSchema.index({ category: 1 });
pitchSchema.index({ createdAt: -1 });


pitchSchema.set('toJSON', { virtuals: true });
pitchSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pitch', pitchSchema);