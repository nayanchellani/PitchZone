const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: {
      values: ['entrepreneur', 'investor', 'admin'],
      message: 'Role must be either entrepreneur, investor, or admin'
    },
    required: [true, 'Role is required']
  },
  // Additional fields for user profile
  fullName: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  // Investor-specific fields
  linkedinUrl: {
    type: String,
    trim: true
  },
  investmentCapacity: {
    type: Number,
    default: 0
  },
  // Entrepreneur-specific fields
  companyName: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  // Additional profile fields
  phoneNumber: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  // Profile completion tracking
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Instance method to calculate profile completion percentage
userSchema.methods.getProfileCompletionPercentage = function() {
  const requiredFields = ['fullName', 'bio', 'phoneNumber', 'occupation', 'location'];
  const roleSpecificFields = this.role === 'entrepreneur' 
    ? ['companyName', 'industry'] 
    : ['linkedinUrl'];
  
  const allRequiredFields = [...requiredFields, ...roleSpecificFields];
  const completedFields = allRequiredFields.filter(field => this[field] && this[field].trim() !== '');
  
  return Math.round((completedFields.length / allRequiredFields.length) * 100);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};



module.exports = mongoose.model('User', userSchema);