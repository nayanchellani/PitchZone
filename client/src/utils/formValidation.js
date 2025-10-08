// Form validation and data cleaning utilities

/**
 * Clean form data by removing empty strings and null values
 * Only sends fields with actual values to the backend
 */
export const cleanFormData = (formData) => {
  const cleaned = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    // Only include non-empty values
    if (value !== null && value !== undefined && value !== '') {
      // Trim strings
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          cleaned[key] = trimmed;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  if (!url || url.trim() === '') return true; // Empty URLs are optional
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate image URL and check if it's actually an image
 */
export const isValidImageUrl = (url) => {
  if (!url || url.trim() === '') return { isValid: true, error: null };
  
  if (!isValidUrl(url)) {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
  
  // More flexible image URL validation
  // Accept URLs that either:
  // 1. End with common image extensions
  // 2. Contain image-related keywords (for CDN/cloud URLs)
  // 3. Are from known image hosting domains
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)(\?.*)?$/i;
  const imageKeywords = /(image|img|photo|picture|avatar|thumbnail|media)/i;
  const imageHosts = /(imgur|cloudinary|unsplash|pexels|pixabay|amazonaws|googleusercontent|github|githubusercontent)/i;
  
  const hasImageExtension = imageExtensions.test(url);
  const hasImageKeyword = imageKeywords.test(url);
  const isImageHost = imageHosts.test(url);
  
  // If it doesn't match any of our criteria, show a warning but still allow it
  // The ImagePreview component will handle the actual validation by trying to load the image
  if (!hasImageExtension && !hasImageKeyword && !isImageHost) {
    return { 
      isValid: true, 
      error: null,
      warning: 'Make sure this URL points to an image file'
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate profile form data
 */
export const validateProfileForm = (formData) => {
  const errors = {};
  
  // Full name validation
  if (formData.fullName && formData.fullName.trim().length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters';
  }
  
  // Bio validation
  if (formData.bio && formData.bio.trim().length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }
  
  // Phone number validation
  if (formData.phoneNumber && formData.phoneNumber.trim().length > 20) {
    errors.phoneNumber = 'Phone number cannot exceed 20 characters';
  }
  
  // URL validations
  const urlFields = ['linkedinUrl', 'website'];
  urlFields.forEach(field => {
    if (formData[field] && !isValidUrl(formData[field])) {
      errors[field] = `Please enter a valid ${field === 'linkedinUrl' ? 'LinkedIn' : 'website'} URL`;
    }
  });
  
  // Text field length validations
  const textFields = [
    { field: 'occupation', max: 100 },
    { field: 'location', max: 100 },
    { field: 'companyName', max: 100 },
    { field: 'industry', max: 100 }
  ];
  
  textFields.forEach(({ field, max }) => {
    if (formData[field] && formData[field].trim().length > max) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed ${max} characters`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate pitch form data
 */
export const validatePitchForm = (formData) => {
  const errors = {};
  
  // Title validation
  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }
  
  // Description validation
  if (!formData.description || formData.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters long';
  } else if (formData.description.trim().length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters';
  }
  
  // Target amount validation
  const targetAmount = parseFloat(formData.targetAmount);
  if (!targetAmount || targetAmount < 1000) {
    errors.targetAmount = 'Target amount must be at least ₹1,000';
  } else if (targetAmount > 100000000) {
    errors.targetAmount = 'Target amount cannot exceed ₹10 crores';
  }
  
  // Equity validation (optional)
  if (formData.equityOffered) {
    const equity = parseFloat(formData.equityOffered);
    if (equity < 0.1 || equity > 100) {
      errors.equityOffered = 'Equity must be between 0.1% and 100%';
    }
  }
  
  // Image URL validation
  if (formData.imageUrl) {
    const imageValidation = isValidImageUrl(formData.imageUrl);
    if (!imageValidation.isValid) {
      errors.imageUrl = imageValidation.error;
    }
    // Note: warnings are handled in the UI, not as blocking errors
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get character count with color coding
 */
export const getCharacterCountInfo = (text, min, max) => {
  const length = text ? text.length : 0;
  
  let status = 'normal';
  let message = `${length}`;
  
  if (min && length < min) {
    status = 'error';
    message += ` / ${min} min`;
  } else if (max) {
    message += ` / ${max}`;
    if (length > max * 0.9) {
      status = length > max ? 'error' : 'warning';
    }
  }
  
  return { length, status, message };
};