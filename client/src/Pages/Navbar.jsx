import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../assets/Logo.svg";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock user role - in real app this would come from auth context
  const [userRole] = useState('entrepreneur'); // Change to 'investor' to test investor navbar

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Clear any stored user data (localStorage, sessionStorage, etc.)
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    // Redirect to landing page
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-logo">
            <img src={Logo} alt="PitchZone Logo" className="navbar-logo-img" />
          </Link>
        </div>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>
          
          {userRole === 'entrepreneur' ? (
            <Link
              to="/pitches"
              className={`navbar-link ${isActive("/pitches") ? "active" : ""}`}
            >
              My Pitch
            </Link>
          ) : (
            <Link
              to="/pitches"
              className={`navbar-link ${isActive("/pitches") ? "active" : ""}`}
            >
              Explore Pitches
            </Link>
          )}
          
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
              <span>N</span>
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
              <button
                onClick={handleLogout}
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
