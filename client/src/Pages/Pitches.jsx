import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const Pitches = () => {
  const [activeTab, setActiveTab] = useState('all');

  const pitches = [
    {
      id: 1,
      title: "EcoTech Solutions",
      category: "GreenTech",
      status: "Under Review",
      funding: "$500K",
      investors: 12,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "AI Healthcare Platform",
      category: "HealthTech",
      status: "Approved",
      funding: "$1.2M",
      investors: 8,
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "FinTech Revolution",
      category: "FinTech",
      status: "Pending",
      funding: "$750K",
      investors: 15,
      date: "2024-01-08"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'status-approved';
      case 'Under Review': return 'status-review';
      case 'Pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  return (
    <div className="pitches-container">
      <Navbar />
      <div className="pitches-content">
        <div className="pitches-header">
          <h1 className="pitches-title">Your Pitches</h1>
          <button className="create-pitch-btn">+ Create New Pitch</button>
        </div>

        <div className="pitches-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Pitches
          </button>
          <button 
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>

        <div className="pitches-grid">
          {pitches.map(pitch => (
            <div key={pitch.id} className="pitch-card">
              <div className="pitch-header">
                <h3 className="pitch-title">{pitch.title}</h3>
                <span className={`pitch-status ${getStatusColor(pitch.status)}`}>
                  {pitch.status}
                </span>
              </div>
              
              <div className="pitch-category">
                <span className="category-tag">{pitch.category}</span>
              </div>

              <div className="pitch-stats">
                <div className="stat-item">
                  <span className="stat-label">Funding Goal</span>
                  <span className="stat-value">{pitch.funding}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Interested Investors</span>
                  <span className="stat-value">{pitch.investors}</span>
                </div>
              </div>

              <div className="pitch-date">
                <span>Submitted: {new Date(pitch.date).toLocaleDateString()}</span>
              </div>

              <div className="pitch-actions">
                <button className="pitch-btn view">View Details</button>
                <button className="pitch-btn edit">Edit Pitch</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pitch-tips">
          <h3>💡 Pitch Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Clear Value Proposition</h4>
              <p>Clearly articulate what problem you're solving and why it matters</p>
            </div>
            <div className="tip-card">
              <h4>Market Validation</h4>
              <p>Show evidence of market demand and customer traction</p>
            </div>
            <div className="tip-card">
              <h4>Financial Projections</h4>
              <p>Present realistic and well-researched financial forecasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pitches;