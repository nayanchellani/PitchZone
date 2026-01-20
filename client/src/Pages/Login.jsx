import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../context/ToastContext';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {

      
      
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (data.success) {
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful, user role:', data.user.role);
        
        // Show welcome toast
        const userName = data.user.fullName || data.user.username || 'there';
        showToast(`Welcome back, ${userName}!`, 'login', 3000);
        
        // Redirect based on user role after a brief delay
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        }, 500);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const loginErrors = {};
          data.errors.forEach(error => {
            loginErrors[error.path] = error.msg;
          });
          setErrors(loginErrors);
        } else {
          setErrors({ general: data.message || 'Login failed' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check if the server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="login-content">
            <h2 className="login-title">Sign In to PitchZone</h2>

            {errors.general && (
              <div className="error-message general-error" style={{
                marginBottom: '1rem', 
                padding: '0.75rem',
                backgroundColor: '#fee',
                color: '#e74c3c',
                borderRadius: '4px'
              }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`login-input ${errors.email ? 'error' : ''}`}
                  required
                />
                <span className="input-icon"><Mail size={20} /></span>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`login-input ${errors.password ? 'error' : ''}`}
                  required
                />
                <span className="input-icon"><Lock size={20} /></span>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <button type="submit" className={`login-button auth-button ${loading ? 'disabled-button' : ''}`} disabled={loading}>
                {loading ? (
                  <div className="btn-loader">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Signing In...</span>
                  </div>
                ) : 'Login'}
              </button>
            </form>

            <p className="signup-text">
              New here? <Link to="/createaccount" className="signup-link">Create an account</Link>
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

export default Login;