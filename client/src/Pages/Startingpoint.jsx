import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Startingpoint = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to StartupConnect</h1>
        <p className="home-subtitle">
          Where entrepreneurs meet investors and ideas become reality
        </p>
        
        <div className="home-buttons">
          <Link to="/login" className="home-btn login-btn">
            Login
          </Link>
          <Link to="/CreateAccount" className="home-btn signup-btn">
            Create Account
          </Link>
        </div>
        
        <div className="home-features">
          <div className="feature">
            <h3>For Entrepreneurs</h3>
            <p>Showcase your innovative ideas and connect with potential investors</p>
          </div>
          <div className="feature">
            <h3>For Investors</h3>
            <p>Discover promising startups and investment opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startingpoint;
  