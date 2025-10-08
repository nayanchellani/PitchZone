import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

const PitchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
    setCurrentUserId(user._id || '');
  }, []);

  // Fetch pitch details
  useEffect(() => {
    const fetchPitch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ENDPOINTS.pitches}/${id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setPitch(data.pitch);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching pitch:', error);
        setError('Failed to fetch pitch details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPitch();
    }
  }, [id]);

  const getProgressPercentage = () => {
    if (!pitch) return 0;
    return Math.min((pitch.raisedAmount / pitch.targetAmount) * 100, 100);
  };

  const handleInvest = () => {
    setShowInvestModal(true);
  };

  const handleInvestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.pitches}/${id}/invest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(investmentAmount) }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Investment submitted successfully!');
        setShowInvestModal(false);
        setInvestmentAmount('');
        // Refresh pitch data
        window.location.reload();
      } else {
        alert(data.message || 'Failed to submit investment');
      }
    } catch (error) {
      console.error('Error submitting investment:', error);
      alert('Failed to submit investment');
    }
  };

  const handleEditPitch = () => {
    alert('Edit pitch functionality would be implemented here');
  };

  const handleDeletePitch = async () => {
    if (!window.confirm('Are you sure you want to delete this pitch? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.pitches}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Pitch deleted successfully!');
        navigate('/pitches');
      } else {
        alert(data.message || 'Failed to delete pitch');
      }
    } catch (error) {
      console.error('Error deleting pitch:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="pitch-detail-container">
        <Navbar />
        <div className="pitch-detail-content">
          <div className="loading">Loading pitch details...</div>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="pitch-detail-container">
        <Navbar />
        <div className="pitch-detail-content">
          <div className="error">{error || 'Pitch not found'}</div>
          <button onClick={() => navigate('/pitches')} className="back-btn">
            ← Back to Pitches
          </button>
        </div>
      </div>
    );
  }

  const isOwner = currentUserId === pitch.entrepreneur._id;

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
              {pitch.imageUrl && (
                <div className="pitch-detail-image">
                  <img 
                    src={pitch.imageUrl} 
                    alt={pitch.title}
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '1.5rem'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <h1 className="pitch-detail-title">{pitch.title}</h1>
              <div className="entrepreneur-info">
                <span className="entrepreneur-avatar">
                  {(pitch.entrepreneur.fullName || pitch.entrepreneur.username).charAt(0).toUpperCase()}
                </span>
                <span className="entrepreneur-name">
                  by {pitch.entrepreneur.fullName || pitch.entrepreneur.username}
                </span>
              </div>
            </div>

            <div className="pitch-description-section">
              <h2>About This Pitch</h2>
              <p className="pitch-full-description">{pitch.description}</p>
              {pitch.category && (
                <div style={{ marginTop: '1rem' }}>
                  <span className="category-tag">{pitch.category}</span>
                  {pitch.stage && <span className="category-tag" style={{ marginLeft: '0.5rem' }}>{pitch.stage}</span>}
                </div>
              )}
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
                  <span className="investors-count">{pitch.investors?.length || 0} investors</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h2>Feedback & Comments</h2>
              <div className="feedback-list">
                {pitch.feedback && pitch.feedback.length > 0 ? (
                  pitch.feedback.map((feedback, index) => (
                    <div key={index} className="feedback-item">
                      <div className="feedback-avatar">
                        <span>{(feedback.userId?.fullName || feedback.userId?.username || 'U').charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="feedback-content">
                        <p>{feedback.message}</p>
                        <span className="feedback-time">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--light-gray)', opacity: 0.7 }}>No feedback yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="pitch-detail-sidebar">
            <div className="action-card">
              {userRole === 'investor' && !isOwner && (
                <button className="invest-btn-large" onClick={handleInvest}>
                  💰 Invest Now
                </button>
              )}

              {isOwner && (
                <div className="entrepreneur-actions">
                  <button className="edit-pitch-btn" onClick={handleEditPitch}>
                    ✏️ Edit Pitch
                  </button>
                  <button 
                    className="delete-pitch-btn" 
                    onClick={handleDeletePitch}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete Pitch'}
                  </button>
                </div>
              )}
            </div>

            <div className="investors-card">
              <h3>Current Investors</h3>
              <div className="investors-list">
                {pitch.investors && pitch.investors.length > 0 ? (
                  pitch.investors.map((investor, index) => (
                    <div key={index} className="investor-item">
                      <span className="investor-name">
                        {investor.userId?.fullName || investor.userId?.username || 'Anonymous'}
                      </span>
                      <span className="investor-amount">₹{investor.amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--light-gray)', opacity: 0.7 }}>No investors yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {showInvestModal && (
          <div className="invest-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Invest in {pitch?.title}</h2>
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