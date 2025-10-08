import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import { cleanFormData, validatePitchForm, getCharacterCountInfo } from '../utils/formValidation';
import ImagePreview from '../components/ImagePreview';
import '../App.css';

const Pitches = () => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterBy, setFilterBy] = useState('all');
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPitch, setNewPitch] = useState({
    title: '',
    description: '',
    targetAmount: '',
    equityOffered: '',
    category: 'Technology',
    stage: 'Idea',
    imageUrl: ''
  });

  const categories = ['all', 'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Food & Beverage', 'Entertainment', 'Other'];
  const sortOptions = ['createdAt', 'targetAmount', 'raisedAmount'];

  // Get user role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
  }, []);

  // Fetch pitches from backend
  const fetchPitches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.pitches}?status=Active&category=${filterBy}&sortBy=${sortBy}&order=desc`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log('Fetched pitches:', data.pitches);
        // Images are now working properly
        setPitches(data.pitches);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setError('Failed to fetch pitches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, [sortBy, filterBy]);

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleCreatePitch = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validatePitchForm(newPitch);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const token = localStorage.getItem('token');
      
      // Clean form data - remove empty strings
      const cleanedData = cleanFormData(newPitch);
      
      const response = await fetch(`${API_ENDPOINTS.pitches}/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Pitch created successfully!');
        setShowCreateForm(false);
        setNewPitch({
          title: '',
          description: '',
          targetAmount: '',
          equityOffered: '',
          category: 'Technology',
          stage: 'Idea',
          imageUrl: ''
        });
        fetchPitches(); // Refresh the pitches list
      } else {
        // Handle backend validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.path || error.param] = error.msg;
          });
          setFormErrors(backendErrors);
        } else {
          alert(data.message || 'Failed to create pitch');
        }
      }
    } catch (error) {
      console.error('Error creating pitch:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="pitches-container">
      <Navbar />
      <div className="pitches-content">
        <div className="pitches-header">
          <div className="header-content">
            <h1 className="pitches-title">Startup Marketplace</h1>
            <p className="pitches-subtitle">Discover innovative startups seeking investment</p>
          </div>
          {userRole === 'entrepreneur' && (
            <button className="primary-cta-button" onClick={handleCreatePitch}>
              + CREATE A NEW PITCH
            </button>
          )}
        </div>

        <div className="pitches-filters">
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Newest</option>
              <option value="targetAmount">Highest Target</option>
              <option value="raisedAmount">Most Funded</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-pitch-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Pitch</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className={`pitch-form ${isSubmitting ? 'form-submitting' : ''}`}>
                <div className={`form-group ${formErrors.title ? 'has-error' : ''}`}>
                  <label>Pitch Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newPitch.title}
                    onChange={handleInputChange}
                    placeholder="Enter your pitch title"
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.title && (
                    <div className="form-error">{formErrors.title}</div>
                  )}
                  <div className={`character-counter ${getCharacterCountInfo(newPitch.title, 5, 100).status}`}>
                    {getCharacterCountInfo(newPitch.title, 5, 100).message}
                  </div>
                </div>
                
                <div className={`form-group ${formErrors.description ? 'has-error' : ''}`}>
                  <label>Description *</label>
                  <div className="form-field-with-counter">
                    <textarea
                      name="description"
                      value={newPitch.description}
                      onChange={handleInputChange}
                      placeholder="Describe your business idea and its unique value proposition"
                      rows="4"
                      disabled={isSubmitting}
                      required
                    />
                    <div className={`form-field-counter character-counter ${getCharacterCountInfo(newPitch.description, 20, 2000).status}`}>
                      {getCharacterCountInfo(newPitch.description, 20, 2000).message}
                    </div>
                  </div>
                  {formErrors.description && (
                    <div className="form-error">{formErrors.description}</div>
                  )}
                </div>
                
                <div className={`form-group ${formErrors.imageUrl ? 'has-error' : ''}`}>
                  <label>Product Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={newPitch.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter image URL for your product/service"
                    disabled={isSubmitting}
                  />
                  <small>Optional: Add an image to make your pitch more attractive. You can use URLs from image hosting sites, social media, or cloud storage.</small>
                  {formErrors.imageUrl && (
                    <div className="form-error">{formErrors.imageUrl}</div>
                  )}
                  {newPitch.imageUrl && (
                    <ImagePreview imageUrl={newPitch.imageUrl} alt="Pitch preview" />
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={newPitch.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Stage *</label>
                    <select
                      name="stage"
                      value={newPitch.stage}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Idea">Idea</option>
                      <option value="Prototype">Prototype</option>
                      <option value="MVP">MVP</option>
                      <option value="Early Revenue">Early Revenue</option>
                      <option value="Growth">Growth</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className={`form-group ${formErrors.targetAmount ? 'has-error' : ''}`}>
                    <label>Target Amount *</label>
                    <div className="input-with-currency">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        name="targetAmount"
                        value={newPitch.targetAmount}
                        onChange={handleInputChange}
                        placeholder="1000000"
                        min="1000"
                        max="100000000"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <small>Minimum: ₹1,000 - Maximum: ₹10 crores</small>
                    {formErrors.targetAmount && (
                      <div className="form-error">{formErrors.targetAmount}</div>
                    )}
                  </div>
                  
                  <div className={`form-group ${formErrors.equityOffered ? 'has-error' : ''}`}>
                    <label>Equity Offered (%)</label>
                    <div className="input-with-percent">
                      <input
                        type="number"
                        name="equityOffered"
                        value={newPitch.equityOffered}
                        onChange={handleInputChange}
                        placeholder="10"
                        min="0.1"
                        max="100"
                        step="0.1"
                        disabled={isSubmitting}
                      />
                      <span className="percent-symbol">%</span>
                    </div>
                    <small>Optional: Percentage of equity you're willing to offer</small>
                    {formErrors.equityOffered && (
                      <div className="form-error">{formErrors.equityOffered}</div>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-cta-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Pitch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading pitches...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="pitches-grid">
            {pitches.map(pitch => (
              <div key={pitch._id} className="marketplace-pitch-card">
                <div className="pitch-image">
                  {pitch.imageUrl && pitch.imageUrl.trim() !== '' ? (
                    <img 
                      src={pitch.imageUrl} 
                      alt={pitch.title}
                      className="pitch-card-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.querySelector('.pitch-placeholder').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="pitch-placeholder" 
                    style={{ display: (pitch.imageUrl && pitch.imageUrl.trim() !== '') ? 'none' : 'flex' }}
                  >
                    <span className="pitch-icon">🚀</span>
                  </div>
                </div>
                
                <div className="pitch-content">
                  <div className="pitch-header">
                    <h3 className="pitch-title">{pitch.title}</h3>
                    <span className="category-tag">{pitch.category}</span>
                  </div>
                  
                  <p className="pitch-description">{pitch.description}</p>
                  
                  <div className="pitch-founder">
                    <span>👤 {pitch.entrepreneur?.fullName || pitch.entrepreneur?.username}</span>
                  </div>

                  <div className="funding-section">
                    <div className="funding-info">
                      <div className="funding-amounts">
                        <span className="raised">₹{(pitch.raisedAmount / 1000).toFixed(0)}K raised</span>
                        <span className="target">of ₹{(pitch.targetAmount / 1000).toFixed(0)}K target</span>
                      </div>
                      <div className="investors-count">{pitch.totalInvestors || 0} investors</div>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${getProgressPercentage(pitch.raisedAmount, pitch.targetAmount)}%`}}
                      ></div>
                    </div>
                    
                    <div className="progress-percentage">
                      {getProgressPercentage(pitch.raisedAmount, pitch.targetAmount).toFixed(0)}% funded
                    </div>
                  </div>

                  <div className="pitch-actions">
                    <Link to={`/pitches/${pitch._id}`} className="action-button">View Details</Link>
                    {userRole === 'investor' && (
                      <button className="primary-cta-button">💰 Invest</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="marketplace-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <h3>Total Startups</h3>
                <div className="stat-number">{pitches.length}</div>
              </div>
              <div className="stat-item">
                <h3>Total Funding</h3>
                <div className="stat-number">
                  ₹{(pitches.reduce((sum, p) => sum + p.raisedAmount, 0) / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="stat-item">
                <h3>Active Investors</h3>
                <div className="stat-number">
                  {pitches.reduce((sum, p) => sum + (p.totalInvestors || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pitches;