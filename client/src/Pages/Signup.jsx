import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../App.css';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="login-content">
            <h2 className="login-title">Sign In to PitchZone</h2>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  required
                />
                <span className="input-icon">👤</span>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
                <span className="input-icon">🔒</span>
              </div>

              <button type="submit" className="login-button">
                Login
              </button>
            </form>

            <p className="signup-text">
            New here? <Link to="/CreateAccount" className="signup-link">Create an account</Link>
            </p>
          </div>
        </div>

        <div className="login-right">
          <h1 className="welcome-title">
            WELCOME<br />BACK!
          </h1>
          <p className="welcome-text">
          Sign in to track your pitches, connect with investors, and grow your ideas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;