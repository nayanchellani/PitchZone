import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            PitchZone
          </Link>
        </div>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/pitches"
            className={`navbar-link ${isActive("/pitches") ? "active" : ""}`}
          >
            Pitches
          </Link>
          <Link
            to="/leaderboard"
            className={`navbar-link ${
              isActive("/leaderboard") ? "active" : ""
            }`}
          >
            Leaderboard
          </Link>
        </div>

        <div className="navbar-user">
          <button onClick={toggleDropdown} className="user-dropdown-btn">
            <div className="user-avatar">
              <span>U</span>
            </div>
            <svg
              className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Add logout logic here
                }}
                className="dropdown-item logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
