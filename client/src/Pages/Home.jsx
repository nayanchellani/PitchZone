import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import "../App.css";

const Home = () => {
  // Mock user data - in real app this would come from authentication/context
  const [user] = useState({
    name: "Nayan",
    role: "entrepreneur", // or "investor"
    profileComplete: 75, // percentage
    avatar: "N"
  });

  // Mock data for entrepreneurs
  const entrepreneurStats = {
    pitchesSubmitted: 3,
    fundingInterest: 12,
    leaderboardRank: 7,
    totalViews: 245
  };

  // Mock data for investors
  const investorStats = {
    pitchesReviewed: 28,
    totalInvested: 750000,
    pendingVerification: 5,
    portfolioCompanies: 8
  };

  // Mock activity feed
  const activityFeed = user.role === 'entrepreneur' ? [
    {
      id: 1,
      type: 'view',
      message: '3 investors viewed your "EcoTech Solutions" pitch',
      time: '2 hours ago',
      icon: '👀'
    },
    {
      id: 2,
      type: 'comment',
      message: 'New comment received on your FinTech pitch',
      time: '5 hours ago',
      icon: '💬'
    },
    {
      id: 3,
      type: 'interest',
      message: 'Sarah Chen showed interest in your startup',
      time: '1 day ago',
      icon: '⭐'
    },
    {
      id: 4,
      type: 'rank',
      message: 'You moved up 2 positions in the leaderboard!',
      time: '2 days ago',
      icon: '📈'
    }
  ] : [
    {
      id: 1,
      type: 'new_pitch',
      message: '5 new pitches awaiting your review',
      time: '1 hour ago',
      icon: '📋'
    },
    {
      id: 2,
      type: 'trending',
      message: 'AI Healthcare Platform is trending this week',
      time: '3 hours ago',
      icon: '🔥'
    },
    {
      id: 3,
      type: 'investment',
      message: 'Your investment in GreenTech Solutions was approved',
      time: '1 day ago',
      icon: '✅'
    },
    {
      id: 4,
      type: 'update',
      message: 'Portfolio company EduTech raised Series A',
      time: '3 days ago',
      icon: '🚀'
    }
  ];

  const currentStats = user.role === 'entrepreneur' ? entrepreneurStats : investorStats;

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
                ? `Welcome back, ${user.name} ` 
                : `Hello, Investor ${user.name} 💼`
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
              <span>{user.avatar}</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Prompt */}
        {user.profileComplete < 100 && (
          <div className="profile-completion">
            <div className="completion-content">
              <div className="completion-text">
                <h3>Complete your profile to increase visibility by 40%</h3>
                <p>{user.profileComplete}% completed</p>
              </div>
              <div className="completion-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${user.profileComplete}%`}}
                  ></div>
                </div>
                <Link to="/profile" className="complete-btn">Complete Profile</Link>
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
              <Link to="/dashboard" className="view-all-btn">View All Activity</Link>
            </div>

            {/* Recommended Pitches */}
            <div className="recommended-pitches">
              <h2>{user.role === 'entrepreneur' ? 'Trending Pitches' : 'Recommended for You'}</h2>
              <div className="pitch-recommendations">
                <div className="mini-pitch-card">
                  <div className="mini-pitch-image">🚀</div>
                  <div className="mini-pitch-content">
                    <h4>AI Healthcare Platform</h4>
                    <p>$850K raised • 95% accuracy</p>
                    <span className="trending-badge">🔥 Trending</span>
                  </div>
                </div>
                <div className="mini-pitch-card">
                  <div className="mini-pitch-image">🌱</div>
                  <div className="mini-pitch-content">
                    <h4>EcoTech Solutions</h4>
                    <p>$275K raised • 40% efficiency</p>
                    <span className="featured-badge">⭐ Featured</span>
                  </div>
                </div>
              </div>
              <Link to="/pitches" className="view-all-pitches-btn">View All Pitches</Link>
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
                        <span className="stat-number">{currentStats.pitchesSubmitted}</span>
                        <span className="stat-label">Pitches</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">💰</span>
                      <div className="stat-info">
                        <span className="stat-number">{currentStats.fundingInterest}</span>
                        <span className="stat-label">Interest</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">🏆</span>
                      <div className="stat-info">
                        <span className="stat-number">#{currentStats.leaderboardRank}</span>
                        <span className="stat-label">Rank</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">📋</span>
                      <div className="stat-info">
                        <span className="stat-number">{currentStats.pitchesReviewed}</span>
                        <span className="stat-label">Reviewed</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">💼</span>
                      <div className="stat-info">
                        <span className="stat-number">${(currentStats.totalInvested / 1000).toFixed(0)}K</span>
                        <span className="stat-label">Invested</span>
                      </div>
                    </div>
                    <div className="stat-item-sidebar">
                      <span className="stat-icon-small">🏢</span>
                      <div className="stat-info">
                        <span className="stat-number">{currentStats.portfolioCompanies}</span>
                        <span className="stat-label">Portfolio</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link to="/dashboard" className="view-dashboard-btn">View Dashboard</Link>
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
              <Link to="/leaderboard" className="view-leaderboard-btn">View Full Leaderboard</Link>
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
