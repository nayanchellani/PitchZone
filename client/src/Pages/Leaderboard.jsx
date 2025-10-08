import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch all active pitches and calculate leaderboard
        const response = await fetch(`${API_ENDPOINTS.pitches}?status=Active&sortBy=raisedAmount&order=desc&limit=50`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          // Process pitches into leaderboard format
          const processedData = data.pitches.map((pitch, index) => ({
            rank: index + 1,
            name: pitch.title,
            founder: pitch.entrepreneur?.fullName || pitch.entrepreneur?.username,
            category: pitch.category,
            funding: `₹${(pitch.raisedAmount / 1000).toFixed(0)}K`,
            targetFunding: `₹${(pitch.targetAmount / 1000).toFixed(0)}K`,
            progress: Math.round((pitch.raisedAmount / pitch.targetAmount) * 100),
            investors: pitch.totalInvestors || 0,
            isUser: currentUser && pitch.entrepreneur?._id === currentUser._id
          }));
          
          setLeaderboardData(processedData);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getUserRank = () => {
    const userPitch = leaderboardData.find(item => item.isUser);
    return userPitch ? userPitch.rank : null;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <Navbar />
        <div className="leaderboard-content">
          <div className="loading">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <Navbar />
        <div className="leaderboard-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Startup Leaderboard</h1>
          <p className="leaderboard-subtitle">Top startups ranked by funding raised</p>
        </div>

        {getUserRank() && (
          <div className="user-rank-card">
            <h3>Your Position</h3>
            <div className="rank-display">#{getUserRank()}</div>
            <p>Out of {leaderboardData.length} active startups</p>
          </div>
        )}

        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Startup</span>
            <span>Category</span>
            <span>Raised</span>
            <span>Target</span>
            <span>Progress</span>
            <span>Investors</span>
          </div>
          
          {leaderboardData.map(startup => (
            <div 
              key={startup.rank} 
              className={`table-row ${startup.isUser ? 'user-row' : ''}`}
            >
              <div className="rank-cell">
                <span className="rank-icon">{getRankIcon(startup.rank)}</span>
              </div>
              <div className="startup-cell">
                <div className="startup-info">
                  <h4>{startup.name}</h4>
                  <p>by {startup.founder}</p>
                </div>
              </div>
              <div className="category-cell">
                <span className="category-badge">{startup.category}</span>
              </div>
              <div className="funding-cell">
                <span className="funding-amount">{startup.funding}</span>
              </div>
              <div className="target-cell">
                <span className="target-amount">{startup.targetFunding}</span>
              </div>
              <div className="progress-cell">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${Math.min(startup.progress, 100)}%`}}
                  ></div>
                </div>
                <span className="progress-text">{startup.progress}%</span>
              </div>
              <div className="investors-cell">
                <span className="investors-count">{startup.investors}</span>
              </div>
            </div>
          ))}
        </div>

        {leaderboardData.length === 0 && (
          <div className="empty-leaderboard">
            <h3>No active pitches yet</h3>
            <p>Be the first to create a pitch and claim the top spot!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;