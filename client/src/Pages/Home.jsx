import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import "../App.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data and dashboard info
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const profileData = await profileResponse.json();
        if (profileData.success) {
          setUser(profileData.user);

          // Fetch recent pitches
          const pitchesResponse = await fetch('http://localhost:5000/api/pitches?limit=6', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          });

          const pitchesData = await pitchesResponse.json();
          if (pitchesData.success) {
            setPitches(pitchesData.pitches);
          }

          // If entrepreneur, fetch their pitches for stats
          if (profileData.user.role === 'entrepreneur') {
            const myPitchesResponse = await fetch('http://localhost:5000/api/pitches/my/pitches', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            const myPitchesData = await myPitchesResponse.json();
            if (myPitchesData.success) {
              const myPitches = myPitchesData.pitches;
              const totalRaised = myPitches.reduce((sum, p) => sum + p.raisedAmount, 0);
              const totalViews = myPitches.reduce((sum, p) => sum + (p.views || 0), 0);
              const activePitches = myPitches.filter(p => p.status === 'Active').length;
              
              setStats({
                pitchesSubmitted: myPitches.length,
                totalRaised,
                activePitches,
                totalViews
              });
            }
          }
        } else {
          setError(profileData.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getProfileCompletionPercentage = () => {
    if (!user) return 0;
    const requiredFields = ['fullName', 'bio', 'phoneNumber', 'occupation', 'location'];
    const roleSpecificFields = user.role === 'entrepreneur' 
      ? ['companyName', 'industry'] 
      : ['linkedinUrl'];
    
    const allRequiredFields = [...requiredFields, ...roleSpecificFields];
    const completedFields = allRequiredFields.filter(field => user[field] && user[field].trim() !== '');
    
    return Math.round((completedFields.length / allRequiredFields.length) * 100);
  };

  const generateActivityFeed = () => {
    if (!user) return [];
    
    const activities = [];
    
    if (user.role === 'entrepreneur') {
      activities.push(
        {
          id: 1,
          type: 'profile',
          message: 'Complete your profile to attract more investors',
          time: 'Now',
          icon: '👤'
        },
        {
          id: 2,
          type: 'pitch',
          message: 'Create your first pitch to start fundraising',
          time: 'Now',
          icon: '🚀'
        }
      );
    } else {
      activities.push(
        {
          id: 1,
          type: 'explore',
          message: `${pitches.length} active pitches available for investment`,
          time: 'Now',
          icon: '📋'
        },
        {
          id: 2,
          type: 'profile',
          message: 'Complete your investor profile',
          time: 'Now',
          icon: '💼'
        }
      );
    }
    
    return activities;
  };

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="home-container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="home-container">
          <div className="error">{error || 'Failed to load dashboard'}</div>
        </div>
      </div>
    );
  }

  const profileCompletion = getProfileCompletionPercentage();
  const activityFeed = generateActivityFeed();

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        <div className="home-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1 className="welcome-greeting">
              {user.role === 'entrepreneur' 
                ? `Welcome back, ${user.fullName || user.username}! 🚀` 
                : `Hello, ${user.fullName || user.username}! 💼`
              }
            </h1>
            <p className="welcome-subtitle">
              {user.role === 'entrepreneur' 
                ? "Ready to pitch your next big idea?" 
                : "Discover the next unicorn startup today"
              }
            </p>
          </div>
          <div className="welcome-avatar">
            <div className="avatar-circle">
              <span>{(user.fullName || user.username).charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Prompt */}
        {profileCompletion < 100 && (
          <div className="profile-completion">
            <div className="completion-content">
              <div className="completion-text">
                <h3>Complete your profile to increase visibility by 40%</h3>
                <p>{profileCompletion}% completed</p>
              </div>
              <div className="completion-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${profileCompletion}%`}}
                  ></div>
                </div>
                <Link to="/profile" className="action-button">Complete Profile</Link>
              </div>
            </div>
          </div>
        )}

        <div className="home-main-content">
          {/* Left Column - Main Content */}
          <div className="main-content-left">
            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                {user.role === 'entrepreneur' ? (
                  <>
                    <Link to="/pitches" className="action-card primary">
                      <div className="action-icon">🚀</div>
                      <div className="action-text">
                        <h3>Create New Pitch</h3>
                        <p>Share your innovative idea with investors</p>
                      </div>
                    </Link>
                    <Link to="/dashboard" className="action-card secondary">
                      <div className="action-icon">📈</div>
                      <div className="action-text">
                        <h3>View Analytics</h3>
                        <p>Track your pitch performance</p>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/pitches" className="action-card primary">
                      <div className="action-icon">🔍</div>
                      <div className="action-text">
                        <h3>Review Pitches</h3>
                        <p>Discover promising startups</p>
                      </div>
                    </Link>
                    <Link to="/dashboard" className="action-card secondary">
                      <div className="action-icon">💼</div>
                      <div className="action-text">
                        <h3>Portfolio Overview</h3>
                        <p>Manage your investments</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Latest Activity Feed */}
            <div className="activity-feed">
              <h2>Latest Activity</h2>
              <div className="activity-list">
                {activityFeed.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dashboard" className="action-button">View All Activity</Link>
            </div>

            {/* Recommended Pitches */}
            <div className="recommended-pitches">
              <h2>{user.role === 'entrepreneur' ? 'Recent Pitches' : 'Recommended for You'}</h2>
              <div className="pitch-recommendations">
                {pitches.slice(0, 2).map(pitch => (
                  <div key={pitch._id} className="mini-pitch-card">
                    <div className="mini-pitch-image">🚀</div>
                    <div className="mini-pitch-content">
                      <h4>{pitch.title}</h4>
                      <p>₹{(pitch.raisedAmount / 1000).toFixed(0)}K raised • {pitch.category}</p>
                      <span className="trending-badge">💡 {pitch.stage}</span>
                    </div>
                  </div>
                ))}
                {pitches.length === 0 && (
                  <p style={{ color: 'var(--light-gray)', opacity: 0.7, textAlign: 'center' }}>
                    No pitches available yet.
                  </p>
                )}
              </div>
              <Link to="/pitches" className="action-button">View All Pitches</Link>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="sidebar-right">
            {/* Quick Stats */}
            <div className="quick-stats-sidebar">
              <h3>Your Stats</h3>
              <div className="stats-list">
                {user.role === 'entrepreneur' ? (
                  <>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">📊</span>
                      <div className="stat-info">
                        <span className="stat-number">{stats?.pitchesSubmitted || 0}</span>
                        <span className="stat-label">Pitches</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">💰</span>
                      <div className="stat-info">
                        <span className="stat-number">₹{((stats?.totalRaised || 0) / 1000).toFixed(0)}K</span>
                        <span className="stat-label">Raised</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">👀</span>
                      <div className="stat-info">
                        <span className="stat-number">{stats?.totalViews || 0}</span>
                        <span className="stat-label">Views</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">📋</span>
                      <div className="stat-info">
                        <span className="stat-number">{pitches.length}</span>
                        <span className="stat-label">Available</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">💼</span>
                      <div className="stat-info">
                        <span className="stat-number">{profileCompletion}%</span>
                        <span className="stat-label">Profile</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">🏢</span>
                      <div className="stat-info">
                        <span className="stat-number">{new Date(user.createdAt).getFullYear()}</span>
                        <span className="stat-label">Since</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link to="/dashboard" className="action-button">View Dashboard</Link>
            </div>

            {/* Leaderboard Teaser */}
            <div className="leaderboard-teaser">
              <h3>🏆 Leaderboard</h3>
              <div className="top-performers">
                <div className="performer-item">
                  <span className="rank">1.</span>
                  <span className="name">TechVision AI</span>
                  <span className="score">98</span>
                </div>
                <div className="performer-item">
                  <span className="rank">2.</span>
                  <span className="name">GreenEnergy</span>
                  <span className="score">95</span>
                </div>
                <div className="performer-item current-user">
                  <span className="rank">7.</span>
                  <span className="name">You</span>
                  <span className="score">82</span>
                </div>
              </div>
              <Link to="/leaderboard" className="action-button">View Full Leaderboard</Link>
            </div>

            {/* Announcements */}
            <div className="announcements">
              <h3>📢 Announcements</h3>
              <div className="announcement-list">
                <div className="announcement-item">
                  <h4>New Feature: AI Pitch Analysis</h4>
                  <p>Get AI-powered feedback on your pitches</p>
                  <span className="announcement-date">2 days ago</span>
                </div>
                <div className="announcement-item">
                  <h4>Investor Meetup - March 15</h4>
                  <p>Join our monthly networking event</p>
                  <span className="announcement-date">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
