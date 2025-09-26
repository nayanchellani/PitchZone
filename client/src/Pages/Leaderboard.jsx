import React, { useState } from 'react';
import Navbar from './Navbar';
import '../App.css';

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState('overall');

  const leaderboardData = [
    {
      rank: 1,
      name: "TechVision AI",
      founder: "Sarah Chen",
      category: "AI/ML",
      funding: "$5.2M",
      growth: "+25%",
      score: 98
    },
    {
      rank: 2,
      name: "GreenEnergy Solutions",
      founder: "Marcus Johnson",
      category: "GreenTech",
      funding: "$4.8M",
      growth: "+18%",
      score: 95
    },
    {
      rank: 3,
      name: "HealthTech Pro",
      founder: "Dr. Emily Rodriguez",
      category: "HealthTech",
      funding: "$4.1M",
      growth: "+22%",
      score: 92
    },
    {
      rank: 4,
      name: "FinanceFlow",
      founder: "David Kim",
      category: "FinTech",
      funding: "$3.9M",
      growth: "+15%",
      score: 89
    },
    {
      rank: 5,
      name: "EduTech Revolution",
      founder: "Lisa Thompson",
      category: "EdTech",
      funding: "$3.5M",
      growth: "+20%",
      score: 87
    },
    {
      rank: 6,
      name: "SmartLogistics",
      founder: "Ahmed Hassan",
      category: "Logistics",
      funding: "$3.2M",
      growth: "+12%",
      score: 84
    },
    {
      rank: 7,
      name: "Your Startup",
      founder: "You",
      category: "FinTech",
      funding: "$2.4M",
      growth: "+15%",
      score: 82,
      isUser: true
    }
  ];

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Startup Leaderboard</h1>
          <p className="leaderboard-subtitle">Top performing startups this quarter</p>
        </div>

        <div className="leaderboard-categories">
          <button 
            className={`category-btn ${activeCategory === 'overall' ? 'active' : ''}`}
            onClick={() => setActiveCategory('overall')}
          >
            Overall
          </button>
          <button 
            className={`category-btn ${activeCategory === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveCategory('funding')}
          >
            Most Funded
          </button>
          <button 
            className={`category-btn ${activeCategory === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveCategory('growth')}
          >
            Fastest Growing
          </button>
        </div>

        <div className="leaderboard-stats">
          <div className="stat-card">
            <h3>Your Rank</h3>
            <div className="rank-display">#7</div>
            <p>Out of 150 startups</p>
          </div>
          <div className="stat-card">
            <h3>Your Score</h3>
            <div className="score-display">82</div>
            <p>Performance index</p>
          </div>
          <div className="stat-card">
            <h3>Next Goal</h3>
            <div className="goal-display">#5</div>
            <p>2 positions to climb</p>
          </div>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Startup</span>
            <span>Category</span>
            <span>Funding</span>
            <span>Growth</span>
            <span>Score</span>
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
                  <p>{startup.founder}</p>
                </div>
              </div>
              <div className="category-cell">
                <span className="category-badge">{startup.category}</span>
              </div>
              <div className="funding-cell">
                <span className="funding-amount">{startup.funding}</span>
              </div>
              <div className="growth-cell">
                <span className="growth-indicator positive">{startup.growth}</span>
              </div>
              <div className="score-cell">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{width: `${startup.score}%`}}
                  ></div>
                  <span className="score-text">{startup.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-insights">
          <h3>📊 Performance Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Funding Milestone</h4>
              <p>You're 60% closer to reaching the top 5 funding bracket</p>
            </div>
            <div className="insight-card">
              <h4>Growth Rate</h4>
              <p>Your 15% growth rate is above the industry average of 12%</p>
            </div>
            <div className="insight-card">
              <h4>Category Leader</h4>
              <p>You're ranked #2 in the FinTech category</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;