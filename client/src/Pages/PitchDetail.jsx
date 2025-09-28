import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const PitchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRole] = useState('investor'); // Change to 'entrepreneur' to test entrepreneur view
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Mock pitch data using the format you specified
  const pitch = {
    id: parseInt(id),
    title: "AI Notes Summarizer",
    description: "App that converts lecture notes into flashcards using advanced AI technology. Perfect for students and professionals who want to study more efficiently.",
    targetAmount: 50000,
    raisedAmount: 12000,
    entrepreneur: { 
      name: "Nayan", 
      profile: "👤" 
    },
    investors: [
      { name: "Investor1", amount: 5000 },
      { name: "Investor2", amount: 3000 },
      { name: "Investor3", amount: 4000 }
    ],
    feedback: [
      "Great idea! The market for educational tools is huge.",
      "Needs clearer revenue model. How will you monetize?",
      "Love the AI integration. What's your competitive advantage?",
      "Impressive prototype. When do you plan to launch?"
    ]
  };

  const getProgressPercentage = () => {
    return Math.min((pitch.raisedAmount / pitch.targetAmount) * 100, 100);
  };

  const handleInvest = () => {
    setShowInvestModal(true);
  };

  const handleInvestSubmit = (e) => {
    e.preventDefault();
    console.log('Investment submitted:', { pitchId: id, amount: investmentAmount });
    setShowInvestModal(false);
    setInvestmentAmount('');
    alert('Investment submitted successfully!');
  };

  const handleEditPitch = () => {
    alert('Edit pitch functionality would be implemented here');
  };

  const handleClosePitch = () => {
    if (window.confirm('Are you sure you want to close this pitch?')) {
      alert('Pitch closed successfully');
      navigate('/pitches');
    }
  };

  return (
    <div className="pitch-detail-container">
      <Navbar />
      <div className="pitch-detail-content">
        <div className="pitch-detail-header">
          <button onClick={() => navigate('/pitches')} className="back-btn">
            ← Back to Pitches
          </button>
        </div>

        <div className="pitch-detail-main">
          <div className="pitch-detail-left">
            <div className="pitch-hero">
              <h1 className="pitch-detail-title">{pitch.title}</h1>
              <div className="entrepreneur-info">
                <span className="entrepreneur-avatar">{pitch.entrepreneur.profile}</span>
                <span className="entrepreneur-name">by {pitch.entrepreneur.name}</span>
              </div>
            </div>

            <div className="pitch-description-section">
              <h2>About This Pitch</h2>
              <p className="pitch-full-description">{pitch.description}</p>
            </div>

            <div className="funding-progress-section">
              <h2>Funding Progress</h2>
              <div className="funding-stats">
                <div className="funding-amounts">
                  <div className="raised-amount">
                    <span className="amount">₹{pitch.raisedAmount.toLocaleString()}</span>
                    <span className="label">raised</span>
                  </div>
                  <div className="target-amount">
                    <span className="amount">₹{pitch.targetAmount.toLocaleString()}</span>
                    <span className="label">target</span>
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${getProgressPercentage()}%`}}
                  ></div>
                </div>
                
                <div className="progress-info">
                  <span className="progress-percentage">{getProgressPercentage().toFixed(1)}% funded</span>
                  <span className="investors-count">{pitch.investors.length} investors</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h2>Feedback & Comments</h2>
              <div className="feedback-list">
                {pitch.feedback.map((comment, index) => (
                  <div key={index} className="feedback-item">
                    <div className="feedback-avatar">
                      <span>👤</span>
                    </div>
                    <div className="feedback-content">
                      <p>{comment}</p>
                      <span className="feedback-time">{Math.floor(Math.random() * 24)} hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pitch-detail-sidebar">
            <div className="action-card">
              {userRole === 'investor' && (
                <button className="invest-btn-large" onClick={handleInvest}>
                  💰 Invest Now
                </button>
              )}

              {userRole === 'entrepreneur' && (
                <div className="entrepreneur-actions">
                  <button className="edit-pitch-btn" onClick={handleEditPitch}>
                    ✏️ Edit Pitch
                  </button>
                  <button className="close-pitch-btn" onClick={handleClosePitch}>
                    🔒 Close Pitch
                  </button>
                </div>
              )}
            </div>

            <div className="investors-card">
              <h3>Current Investors</h3>
              <div className="investors-list">
                {pitch.investors.map((investor, index) => (
                  <div key={index} className="investor-item">
                    <span className="investor-name">{investor.name}</span>
                    <span className="investor-amount">₹{investor.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showInvestModal && (
          <div className="invest-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Invest in {pitch.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowInvestModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleInvestSubmit} className="invest-form">
                <div className="form-group">
                  <label>Investment Amount</label>
                  <div className="input-with-currency">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="5000"
                      min="1000"
                      required
                    />
                  </div>
                  <small>Minimum investment: ₹1,000</small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowInvestModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Confirm Investment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchDetail;