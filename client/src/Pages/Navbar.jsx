import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "../App.css";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Get user role from localStorage
  const [userRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'entrepreneur';
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    
    // Get user name before clearing storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.fullName || user.username || 'there';
    
    // Clear all stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    // Show logout toast
    showToast(`See you soon, ${userName}!`, 'logout', 3000);
    
    // Redirect to landing page after brief delay
    setTimeout(() => {
      navigate('/');
    }, 500);
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
            to="/home"
            className={`navbar-link ${isActive("/home") ? "active" : ""}`}
          >
            Home
          </Link>
          
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
            {userRole === 'entrepreneur' ? 'My Pitches' : 'Explore Pitches'}
          </Link>
          
          <Link
            to="/leaderboard"
            className={`navbar-link ${isActive("/leaderboard") ? "active" : ""}`}
          >
            Leaderboard
          </Link>
        </div>

        <div className="navbar-user">
          <button onClick={toggleDropdown} className="user-dropdown-btn">
            <div className="user-avatar">
              <span>{(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return (user.fullName || user.username || 'U').charAt(0).toUpperCase();
              })()}</span>
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
