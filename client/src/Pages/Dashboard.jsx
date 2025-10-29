
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your startup overview</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Active Pitches</h3>
              <span className="card-number">12</span>
            </div>
            <p className="card-description">Pitches currently in review</p>
            <div className="card-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
              <span className="progress-text">75% completion rate</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Total Funding</h3>
              <span className="card-number">$2.4M</span>
            </div>
            <p className="card-description">Raised this quarter</p>
            <div className="growth-indicator positive">
              <span>↗ +15% from last month</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Investor Connections</h3>
              <span className="card-number">48</span>
            </div>
            <p className="card-description">Active investor relationships</p>
            <div className="growth-indicator positive">
              <span>↗ +8 new this week</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Leaderboard Rank</h3>
              <span className="card-number">#7</span>
            </div>
            <p className="card-description">Your current position</p>
            <div className="growth-indicator positive">
              <span>↗ Up 3 positions</span>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/pitches" className="primary-cta-button">
            Create New Pitch
          </Link>
          <Link to="/leaderboard" className="action-button">
            View Leaderboard
          </Link>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">💼</div>
              <div className="activity-content">
                <p><strong>New investor interest</strong> in your FinTech pitch</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📈</div>
              <div className="activity-content">
                <p><strong>Pitch approved</strong> for next round</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏆</div>
              <div className="activity-content">
                <p><strong>Moved up</strong> in leaderboard rankings</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;