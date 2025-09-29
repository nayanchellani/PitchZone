import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Startingpoint = () => {
  return (
    <div className="startingpoint-container">
      <div className="startingpoint-content">
        <h1 className="startingpoint-title">Welcome to PitchZone</h1>
        <p className="startingpoint-subtitle">
          Where entrepreneurs meet investors and ideas become reality
        </p>
        
        <div className="startingpoint-buttons">
          <Link to="/login" className="action-button">
            Login
          </Link>
          <Link to="/createaccount" className="primary-cta-button">
            Create Account
          </Link>
        </div>
        
        <div className="startingpoint-features">
          <div className="startingpoint-feature">
            <h3>For Entrepreneurs</h3>
            <p>Showcase your innovative ideas and connect with potential investors</p>
          </div>
          <div className="startingpoint-feature">
            <h3>For Investors</h3>
            <p>Discover promising startups and investment opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startingpoint;
  