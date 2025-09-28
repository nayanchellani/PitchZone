import React, { useState } from 'react';
import Navbar from './Navbar';
import '../App.css';

const Profile = () => {
  // Mock user data - in real app this would come from authentication/API
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "entrepreneur", // or "shark"
    avatar: "JD",
    joinDate: "January 2024",
    location: "San Francisco, CA"
  });

  const entrepreneurData = {
    pitches: [
      {
        id: 1,
        title: "EcoTech Solutions",
        status: "Active",
        targetAmount: 500000,
        raisedAmount: 275000,
        investors: 12,
        category: "GreenTech"
      },
      {
        id: 2,
        title: "AI Healthcare Platform",
        status: "Funded",
        targetAmount: 1200000,
        raisedAmount: 1200000,
        investors: 8,
        category: "HealthTech"
      }
    ],
    totalRaised: 1475000,
    totalPitches: 2,
    successRate: 50
  };

  const sharkData = {
    investments: [
      {
        id: 1,
        startup: "TechVision AI",
        amount: 250000,
        equity: 15,
        status: "Active",
        category: "AI/ML"
      },
      {
        id: 2,
        startup: "GreenEnergy Solutions",
        amount: 500000,
        equity: 20,
        status: "Exited",
        category: "GreenTech"
      }
    ],
    totalInvested: 750000,
    activeInvestments: 5,
    creditsLeft: 2500000
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-large">
            <span>{user.avatar}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-meta">
              <span className="profile-role">{user.role === 'entrepreneur' ? '🚀 Entrepreneur' : '🦈 Shark Investor'}</span>
              <span className="profile-location">📍 {user.location}</span>
              <span className="profile-joined">📅 Joined {user.joinDate}</span>
            </div>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        {user.role === 'entrepreneur' ? (
          <div className="entrepreneur-section">
            <div className="stats-overview">
              <div className="stat-card">
                <h3>Total Raised</h3>
                <div className="stat-value">${(entrepreneurData.totalRaised / 1000000).toFixed(1)}M</div>
                <p>Across all pitches</p>
              </div>
              <div className="stat-card">
                <h3>Active Pitches</h3>
                <div className="stat-value">{entrepreneurData.totalPitches}</div>
                <p>Currently fundraising</p>
              </div>
              <div className="stat-card">
                <h3>Success Rate</h3>
                <div className="stat-value">{entrepreneurData.successRate}%</div>
                <p>Funding success</p>
              </div>
            </div>

            <div className="pitches-section">
              <h2>My Pitches</h2>
              <div className="pitches-list">
                {entrepreneurData.pitches.map(pitch => (
                  <div key={pitch.id} className="pitch-item">
                    <div className="pitch-item-header">
                      <h3>{pitch.title}</h3>
                      <span className={`status-badge ${pitch.status.toLowerCase()}`}>
                        {pitch.status}
                      </span>
                    </div>
                    <div className="pitch-item-stats">
                      <div className="funding-progress">
                        <div className="progress-info">
                          <span>Raised: ${(pitch.raisedAmount / 1000).toFixed(0)}K</span>
                          <span>Target: ${(pitch.targetAmount / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${(pitch.raisedAmount / pitch.targetAmount) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="pitch-meta">
                        <span>{pitch.investors} investors</span>
                        <span className="category-tag">{pitch.category}</span>
                      </div>
                    </div>
                    <div className="pitch-actions">
                      <button className="btn-secondary">View Details</button>
                      <button className="btn-primary">Edit Pitch</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="shark-section">
            <div className="stats-overview">
              <div className="stat-card">
                <h3>Total Invested</h3>
                <div className="stat-value">${(sharkData.totalInvested / 1000000).toFixed(1)}M</div>
                <p>Portfolio value</p>
              </div>
              <div className="stat-card">
                <h3>Active Investments</h3>
                <div className="stat-value">{sharkData.activeInvestments}</div>
                <p>Current portfolio</p>
              </div>
              <div className="stat-card">
                <h3>Credits Left</h3>
                <div className="stat-value">${(sharkData.creditsLeft / 1000000).toFixed(1)}M</div>
                <p>Available to invest</p>
              </div>
            </div>

            <div className="investments-section">
              <h2>My Investments</h2>
              <div className="investments-list">
                {sharkData.investments.map(investment => (
                  <div key={investment.id} className="investment-item">
                    <div className="investment-header">
                      <h3>{investment.startup}</h3>
                      <span className={`status-badge ${investment.status.toLowerCase()}`}>
                        {investment.status}
                      </span>
                    </div>
                    <div className="investment-details">
                      <div className="investment-amount">
                        <span className="label">Investment</span>
                        <span className="value">${(investment.amount / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="investment-equity">
                        <span className="label">Equity</span>
                        <span className="value">{investment.equity}%</span>
                      </div>
                      <div className="investment-category">
                        <span className="category-tag">{investment.category}</span>
                      </div>
                    </div>
                    <div className="investment-actions">
                      <button className="btn-secondary">View Startup</button>
                      <button className="btn-primary">Portfolio Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;