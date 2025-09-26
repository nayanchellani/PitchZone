import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../App.css';

const CreateAcc = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'entrepreneur',
    linkedinUrl: '',
    accessCode: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleUserTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type,
      // Clear investor-specific fields when switching to entrepreneur
      linkedinUrl: type === 'entrepreneur' ? '' : prev.linkedinUrl,
      accessCode: type === 'entrepreneur' ? '' : prev.accessCode
    }));
    
    // Clear any related errors
    setErrors(prev => ({
      ...prev,
      linkedinUrl: '',
      accessCode: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if passwords are empty
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    // Check other required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    // Validate investor-specific fields
    if (formData.userType === 'investor') {
      if (!formData.linkedinUrl.trim()) {
        newErrors.linkedinUrl = 'LinkedIn URL is required for investors';
      }
      
      if (!formData.accessCode.trim()) {
        newErrors.accessCode = 'Access code is required for investors';
      } else if (formData.accessCode !== 'VALID_CODE_123') { // Replace with your valid codes
        newErrors.accessCode = 'Wrong admin approval required';
      }
    }

    setErrors(newErrors);

    // If no errors, proceed with account creation
    if (Object.keys(newErrors).length === 0) {
      console.log('Account creation data:', formData);
      // Handle account creation logic here
    }
  };

  return (
    <div className="login-container">
      <div className="signup-card">
        <div className="signup-left">
          <h1 className="signup-main-title">Get Started — Your Ideas Deserve the Spotlight</h1>
          <p className="signup-subtitle">Your journey from idea to investment begins here</p>
        </div>

        <div className="signup-right">
          <h2 className="signup-form-title">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="What should we call you?"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`signup-input ${errors.fullName ? 'error' : ''}`}
              />
              <span className="input-icon">👤</span>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={`signup-input ${errors.email ? 'error' : ''}`}
              />
              <span className="input-icon">📧</span>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="toggle-container">
                <span className="toggle-label">I'm an</span>
                <div className="toggle-switch">
                  <button
                    type="button"
                    className={`toggle-option ${formData.userType === 'entrepreneur' ? 'active' : ''}`}
                    onClick={() => handleUserTypeToggle('entrepreneur')}
                  >
                    Entrepreneur
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${formData.userType === 'investor' ? 'active' : ''}`}
                    onClick={() => handleUserTypeToggle('investor')}
                  >
                    Investor
                  </button>
                </div>
              </div>
            </div>

            <div className={`investor-fields ${formData.userType === 'investor' ? 'show' : 'hide'}`}>
              {formData.userType === 'investor' && (
                <>
                  <div className="input-group investor-field">
                    <input
                      type="url"
                      name="linkedinUrl"
                      placeholder="Enter your LinkedIn Profile URL"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className={`signup-input ${errors.linkedinUrl ? 'error' : ''}`}
                    />
                    <span className="input-icon">💼</span>
                    {errors.linkedinUrl && <span className="error-message">{errors.linkedinUrl}</span>}
                  </div>

                  <div className="input-group investor-field">
                    <input
                      type="text"
                      name="accessCode"
                      placeholder="Investor Access Code"
                      value={formData.accessCode}
                      onChange={handleInputChange}
                      className={`signup-input ${errors.accessCode ? 'error' : ''}`}
                    />
                    <span className="input-icon">🔑</span>
                    {errors.accessCode && <span className="error-message">{errors.accessCode}</span>}
                  </div>
                </>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleInputChange}
                className={`signup-input ${errors.password ? 'error' : ''}`}
              />
              <span className="input-icon">🔒</span>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`signup-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              <span className="input-icon">🔐</span>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="signup-button">
              Create Account
            </button>
          </form>

          <p className="login-text">
            Already have an account? <Link to="/login" className="login-link">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAcc;