// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth endpoints
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  getProfile: `${API_BASE_URL}/api/auth/me`,
  updateProfile: `${API_BASE_URL}/api/auth/profile`,
  
  // Pitch endpoints
  pitches: `${API_BASE_URL}/api/pitches`,
  
  // User endpoints
  users: `${API_BASE_URL}/api/users`,
};

export default API_BASE_URL;