import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const EntrepreneurDashboard = () => {
  // Mock entrepreneur's active pitch using your format
  const activePitch = {
    id: 1,
    title: "AI Notes Summarizer",
    description: "App that converts lecture notes into flashcards.",
    targetAmount: 50000,
    raisedAmount: 12000,
    entrepreneur: { name: "Nayan", profile: "👤" },
    investors: [
      { name: "Investor1", amount: 5000 },
      { name: "Investor2", amount: 3000 },
      { name: "Investor3", amount: 4000 },
    ],
    feedback: [
      "Great idea! The market for educational tools is huge.",
      "Needs clearer revenue model. How will you monetize?",
      "Love the AI integration. What's your competitive advantage?",
      "Impressive prototype. When do you plan to launch?",
    ],
  };

  const getProgressPercentage = () => {
    return Math.min(
      (activePitch.raisedAmount / activePitch.targetAmount) * 100,
      100
    );
  };

  const handleEditPitch = () => {
    alert("Edit pitch functionality would be implemented here");
  };

  const handleClosePitch = () => {
    if (window.confirm("Are you sure you want to close this pitch?")) {
      alert("Pitch closed successfully");
    }
  };

  return (
    <div className="entrepreneur-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Entrepreneur Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor your pitch performance and investor engagement
        </p>
      </div>

      {/* Active Pitch Card */}
      <div className="active-pitch-section">
        <h2>My Active Pitch</h2>
        <div className="pitch-card-large">
          <div className="pitch-header">
            <h3>{activePitch.title}</h3>
            <div className="pitch-actions">
              <button className="edit-btn" onClick={handleEditPitch}>
                ✏️ Edit
              </button>
              <button className="close-btn" onClick={handleClosePitch}>
                🔒 Close
              </button>
            </div>
          </div>

          <p className="pitch-description">{activePitch.description}</p>

          {/* Pitch Status Card */}
          <div className="pitch-status-card">
            <h4>Pitch Status</h4>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Raised</span>
                <span className="status-value">
                  ₹{activePitch.raisedAmount.toLocaleString()}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Target</span>
                <span className="status-value">
                  ₹{activePitch.targetAmount.toLocaleString()}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">% Achieved</span>
                <span className="status-value">
                  {getProgressPercentage().toFixed(1)}%
                </span>
              </div>
              <div className="status-item">
                <span className="status-label"># of Investors</span>
                <span className="status-value">
                  {activePitch.investors.length}
                </span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <Link to={`/pitches/${activePitch.id}`} className="view-full-pitch">
            View Full Pitch Details →
          </Link>
        </div>
      </div>

      {/* Feedback from Sharks Section */}
      <div className="feedback-section">
        <h2>Feedback from Sharks</h2>
        <div className="feedback-list">
          {activePitch.feedback.map((comment, index) => (
            <div key={index} className="feedback-item">
              <div className="feedback-avatar">
                <span>🦈</span>
              </div>
              <div className="feedback-content">
                <p>{comment}</p>
                <span className="feedback-time">
                  {Math.floor(Math.random() * 24)} hours ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Investors */}
      <div className="investors-section">
        <h2>Current Investors</h2>
        <div className="investors-list">
          {activePitch.investors.map((investor, index) => (
            <div key={index} className="investor-card">
              <div className="investor-info">
                <span className="investor-avatar">👤</span>
                <span className="investor-name">{investor.name}</span>
              </div>
              <span className="investor-amount">
                ₹{investor.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
