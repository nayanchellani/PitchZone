import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is logged in
    if (!token || !user.role) {
      navigate('/login');
      return;
    }

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      // Redirect based on user's actual role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
      return;
    }
  }, [navigate, requiredRole]);

  return children;
};

export default ProtectedRoute;