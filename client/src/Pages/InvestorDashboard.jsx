import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const InvestorDashboard = () => {
  // Mock investor data using your format
  const investorStats = {
    totalInvested: 25000,
    pitchesFunded: 3
  };

  // Mock investments (pitches they invested in)
  const myInvestments = [
    {
      id: 1,
      title: "AI Notes Summarizer",
      description: "App that converts lecture notes into flashcards.",
      targetAmount: 50000,
      raisedAmount: 12000,
      entrepreneur: { name: "Nayan", profile: "👤" },
      myInvestment: 5000
    },
    {
      id: 2,
      title: "Smart Fitness Tracker",
      description: "Wearable device that tracks health metrics.",
      targetAmount: 75000,
      raisedAmount: 30000,
      entrepreneur: { name: "Priya", profile: "👤" },
      myInvestment: 10000
    },
    {
      id: 3,
      title: "Eco-Friendly Packaging",
      description: "Biodegradable packaging solution for e-commerce.",
      targetAmount: 40000,
      raisedAmount: 25000,
      entrepreneur: { name: "Rahul", profile: "👤" },
      myInvestment: 8000
    }
  ];

  // Mock recommended pitches (open pitches to explore)
  const recommendedPitches = [
    {
      id: 4,
      title: "Virtual Reality Learning",
      description: "VR platform for immersive education.",
      targetAmount: 60000,
      raisedAmount: 15000,
      entrepreneur: { name: "Sarah", profile: "👤" }
    },
    {
      id: 5,
      title: "Food Waste Reducer",
      description: "App that helps reduce household food waste.",
      targetAmount: 35000,
      raisedAmount: 8000,
      entrepreneur: { name: "Mike", profile: "👤" }
    }
  ];

  return (
    <div className="investor-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Investor Dashboard</h1>
        <p className="dashboard-subtitle">Track your investments and discover new opportunities</p>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">💰</div>
          <div className="analytics-content">
            <h3>Total Invested</h3>
            <div className="analytics-number">₹{investorStats.totalInvested.toLocaleString()}</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">📊</div>
          <div className="analytics-content">
            <h3>Pitches Funded</h3>
            <div className="analytics-number">{investorStats.pitchesFunded}</div>
          </div>
        </div>
      </div>

      {/* My Investments Section */}
      <div className="investments-section">
        <h2>My Investments</h2>
        <div className="investments-list">
          {myInvestments.map(investment => (
            <div key={investment.id} className="investment-card">
              <div className="investment-header">
                <h3>{investment.title}</h3>
                <span className="my-investment">My Investment: ₹{investment.myInvestment.toLocaleString()}</span>
              </div>
              <p className="investment-description">{investment.description}</p>
              <div className="investment-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${(investment.raisedAmount / investment.targetAmount) * 100}%`}}
                  ></div>
                </div>
                <div className="progress-info">
                  <span>₹{investment.raisedAmount.toLocaleString()} / ₹{investment.targetAmount.toLocaleString()}</span>
                  <span>{((investment.raisedAmount / investment.targetAmount) * 100).toFixed(1)}% funded</span>
                </div>
              </div>
              <div className="investment-footer">
                <span className="entrepreneur-info">
                  {investment.entrepreneur.profile} {investment.entrepreneur.name}
                </span>
                <Link to={`/pitches/${investment.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Pitches Section */}
      <div className="recommended-section">
        <h2>Recommended Pitches</h2>
        <div className="recommended-list">
          {recommendedPitches.map(pitch => (
            <div key={pitch.id} className="recommended-card">
              <h3>{pitch.title}</h3>
              <p>{pitch.description}</p>
              <div className="recommended-stats">
                <span>Target: ₹{pitch.targetAmount.toLocaleString()}</span>
                <span>Raised: ₹{pitch.raisedAmount.toLocaleString()}</span>
              </div>
              <div className="recommended-footer">
                <span className="entrepreneur-info">
                  {pitch.entrepreneur.profile} {pitch.entrepreneur.name}
                </span>
                <Link to={`/pitches/${pitch.id}`} className="explore-btn">
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Link to="/pitches" className="view-all-pitches">
          View All Pitches →
        </Link>
      </div>
    </div>
  );
};

export default InvestorDashboard;