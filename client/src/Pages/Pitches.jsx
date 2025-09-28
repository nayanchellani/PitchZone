import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const Pitches = () => {
  const [sortBy, setSortBy] = useState('trending');
  const [filterBy, setFilterBy] = useState('all');
  const [userRole] = useState('entrepreneur'); // This would come from auth context
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPitch, setNewPitch] = useState({
    productName: '',
    description: '',
    image: '',
    fundingGoal: '',
    equityOffered: ''
  });

  const pitches = [
    {
      id: 1,
      title: "EcoTech Solutions",
      description: "Revolutionary solar panel technology that increases efficiency by 40% while reducing costs.",
      category: "GreenTech",
      targetAmount: 500000,
      raisedAmount: 275000,
      investors: 12,
      founder: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=250&fit=crop",
      trending: true,
      featured: false
    },
    {
      id: 2,
      title: "AI Healthcare Platform",
      description: "AI-powered diagnostic platform that helps doctors detect diseases 3x faster with 95% accuracy.",
      category: "HealthTech",
      targetAmount: 1200000,
      raisedAmount: 850000,
      investors: 8,
      founder: "Dr. Marcus Johnson",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      trending: false,
      featured: true
    },
    {
      id: 3,
      title: "FinTech Revolution",
      description: "Blockchain-based payment system for emerging markets with zero transaction fees.",
      category: "FinTech",
      targetAmount: 750000,
      raisedAmount: 425000,
      investors: 15,
      founder: "David Kim",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      trending: true,
      featured: false
    },
    {
      id: 4,
      title: "Smart Agriculture",
      description: "IoT sensors and AI analytics to optimize crop yields and reduce water usage by 30%.",
      category: "AgriTech",
      targetAmount: 300000,
      raisedAmount: 180000,
      investors: 6,
      founder: "Lisa Rodriguez",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop",
      trending: false,
      featured: false
    },
    {
      id: 5,
      title: "EdTech Innovation",
      description: "Virtual reality platform for immersive learning experiences in STEM education.",
      category: "EdTech",
      targetAmount: 600000,
      raisedAmount: 320000,
      investors: 9,
      founder: "Ahmed Hassan",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
      trending: true,
      featured: true
    },
    {
      id: 6,
      title: "Clean Energy Storage",
      description: "Next-generation battery technology for renewable energy storage with 10x capacity.",
      category: "GreenTech",
      targetAmount: 2000000,
      raisedAmount: 1200000,
      investors: 20,
      founder: "Emily Thompson",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
      trending: false,
      featured: true
    }
  ];

  const categories = ['all', 'GreenTech', 'HealthTech', 'FinTech', 'AgriTech', 'EdTech'];
  const sortOptions = ['trending', 'most_funded', 'newest', 'target_amount'];

  const filteredAndSortedPitches = pitches
    .filter(pitch => filterBy === 'all' || pitch.category === filterBy)
    .sort((a, b) => {
      switch(sortBy) {
        case 'trending':
          return b.trending - a.trending;
        case 'most_funded':
          return b.raisedAmount - a.raisedAmount;
        case 'newest':
          return b.id - a.id;
        case 'target_amount':
          return b.targetAmount - a.targetAmount;
        default:
          return 0;
      }
    });

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleCreatePitch = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('New pitch created:', newPitch);
    // Here you would typically send the data to your backend
    setShowCreateForm(false);
    setNewPitch({
      productName: '',
      description: '',
      image: '',
      fundingGoal: '',
      equityOffered: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPitch(prev => ({
      ...prev,
      [name]: value
    }));
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
            <button className="create-pitch-btn" onClick={handleCreatePitch}>
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
              <option value="trending">Trending</option>
              <option value="most_funded">Most Funded</option>
              <option value="newest">Newest</option>
              <option value="target_amount">Highest Target</option>
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
              <form onSubmit={handleFormSubmit} className="pitch-form">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={newPitch.productName}
                    onChange={handleInputChange}
                    placeholder="Enter your product name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Product Description *</label>
                  <textarea
                    name="description"
                    value={newPitch.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product and its unique value proposition"
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Product Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={newPitch.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/your-product-image.jpg"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Funding Goal *</label>
                    <div className="input-with-currency">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        name="fundingGoal"
                        value={newPitch.fundingGoal}
                        onChange={handleInputChange}
                        placeholder="10,00,000"
                        min="1"
                        required
                      />
                    </div>
                    <small>Example: ₹10,00,000 - Let investors know your target</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Equity Offered *</label>
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
                        required
                      />
                      <span className="percent-symbol">%</span>
                    </div>
                    <small>Example: 10% equity for ₹10L - Important for investors</small>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Create Pitch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="pitches-grid">
          {filteredAndSortedPitches.map(pitch => (
            <div key={pitch.id} className="marketplace-pitch-card">
              <div className="pitch-image">
                <img src={pitch.image} alt={pitch.title} />
                <div className="pitch-badges">
                  {pitch.trending && <span className="badge trending">🔥 Trending</span>}
                  {pitch.featured && <span className="badge featured">⭐ Featured</span>}
                </div>
              </div>
              
              <div className="pitch-content">
                <div className="pitch-header">
                  <h3 className="pitch-title">{pitch.title}</h3>
                  <span className="category-tag">{pitch.category}</span>
                </div>
                
                <p className="pitch-description">{pitch.description}</p>
                
                <div className="pitch-founder">
                  <span>👤 {pitch.founder}</span>
                </div>

                <div className="funding-section">
                  <div className="funding-info">
                    <div className="funding-amounts">
                      <span className="raised">${(pitch.raisedAmount / 1000).toFixed(0)}K raised</span>
                      <span className="target">of ${(pitch.targetAmount / 1000).toFixed(0)}K target</span>
                    </div>
                    <div className="investors-count">{pitch.investors} investors</div>
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
                  <Link to={`/pitches/${pitch.id}`} className="btn-secondary view-details">View Details</Link>
                  {userRole === 'investor' && (
                    <button className="btn-primary invest-btn">💰 Invest</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="marketplace-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Startups</h3>
              <div className="stat-number">{pitches.length}</div>
            </div>
            <div className="stat-item">
              <h3>Total Funding</h3>
              <div className="stat-number">
                ${(pitches.reduce((sum, p) => sum + p.raisedAmount, 0) / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="stat-item">
              <h3>Active Investors</h3>
              <div className="stat-number">
                {pitches.reduce((sum, p) => sum + p.investors, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pitches;