import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import '../App.css';

const InvestorDashboard = () => {
  const [myInvestments, setMyInvestments] = useState([]);
  const [recommendedPitches, setRecommendedPitches] = useState([]);
  const [stats, setStats] = useState({ totalInvested: 0, pitchesFunded: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Fetch all pitches
      const response = await fetch(`${API_BASE_URL}/pitches?status=Active&limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const allPitches = data.pitches;

        // Filter pitches where user has invested
        const invested = allPitches.filter(pitch =>
          pitch.investors.some(inv => inv.userId._id === userId)
        );

        // Calculate stats
        let totalInvested = 0;
        invested.forEach(pitch => {
          const myInv = pitch.investors.find(inv => inv.userId._id === userId);
          if (myInv) totalInvested += myInv.amount;
        });

        setMyInvestments(invested);
        setStats({
          totalInvested,
          pitchesFunded: invested.length,
        });

        // Get pitches where user hasn't invested (recommended)
        const notInvested = allPitches.filter(
          pitch => !pitch.investors.some(inv => inv.userId._id === userId)
        ).slice(0, 5);

        setRecommendedPitches(notInvested);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getMyInvestment = (pitch) => {
    const userId = localStorage.getItem('userId');
    const investment = pitch.investors.find(inv => inv.userId._id === userId);
    return investment ? investment.amount : 0;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Investor Dashboard</h1>
        <p className="dashboard-subtitle">Track your investments and discover new opportunities</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>💰 Total Invested</h3>
          </div>
          <div className="card-number">₹{stats.totalInvested.toLocaleString()}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>📊 Pitches Funded</h3>
          </div>
          <div className="card-number">{stats.pitchesFunded}</div>
        </div>
      </div>

      {myInvestments.length > 0 && (
        <div className="section">
          <h2>My Investments</h2>
          <div className="cards-list">
            {myInvestments.map(pitch => (
              <div key={pitch._id} className="pitch-card">
                <div className="card-header">
                  <h3>{pitch.title}</h3>
                  <span className="badge">
                    My Investment: ₹{getMyInvestment(pitch).toLocaleString()}
                  </span>
                </div>
                <p className="description">{pitch.description}</p>
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${(pitch.raisedAmount / pitch.targetAmount) * 100}%`}}
                    ></div>
                  </div>
                  <div className="progress-info">
                    <span>₹{pitch.raisedAmount.toLocaleString()} / ₹{pitch.targetAmount.toLocaleString()}</span>
                    <span>{((pitch.raisedAmount / pitch.targetAmount) * 100).toFixed(1)}% funded</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="info">
                    👤 {pitch.entrepreneur.username}
                  </span>
                  <Link to={`/pitches/${pitch._id}`} className="action-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendedPitches.length > 0 && (
        <div className="section">
          <h2>Recommended Pitches</h2>
          <div className="cards-list">
            {recommendedPitches.map(pitch => (
              <div key={pitch._id} className="pitch-card">
                <h3>{pitch.title}</h3>
                <p className="description">{pitch.description}</p>
                <div className="stats">
                  <span>Target: ₹{pitch.targetAmount.toLocaleString()}</span>
                  <span>Raised: ₹{pitch.raisedAmount.toLocaleString()}</span>
                </div>
                <div className="card-footer">
                  <span className="info">
                    👤 {pitch.entrepreneur.username}
                  </span>
                  <Link to={`/pitches/${pitch._id}`} className="action-button">
                    Explore
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/pitches" className="view-all">
            View All Pitches →
          </Link>
        </div>
      )}

      {myInvestments.length === 0 && recommendedPitches.length === 0 && (
        <div className="empty-state">
          <p>No pitches available at the moment</p>
          <Link to="/pitches" className="action-button">
            Browse Pitches
          </Link>
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;