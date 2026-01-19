import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '../context/ToastContext';
import '../App.css';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminDashboard, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminUsers, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pitches
  const fetchPitches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminPitches, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setPitches(data.data.pitches);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch pitches');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.adminUsers}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        showToast('User deleted successfully', 'success', 3000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Delete pitch
  const deletePitch = async (pitchId) => {
    if (!window.confirm('Are you sure you want to delete this pitch?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.adminPitches}/${pitchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setPitches(pitches.filter(pitch => pitch._id !== pitchId));
        showToast('Pitch deleted successfully', 'pitch-deleted', 3000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to delete pitch');
    }
  };

  const handleLogout = () => {
    showToast('Logged out successfully', 'logout', 3000);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }, 500);
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'pitches') {
      fetchPitches();
    }
  }, [activeTab]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'pitches' ? 'active' : ''}
          onClick={() => setActiveTab('pitches')}
        >
          Pitches
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {activeTab === 'dashboard' && dashboardData && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{dashboardData.statistics.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Entrepreneurs</h3>
              <p>{dashboardData.statistics.totalEntrepreneurs}</p>
            </div>
            <div className="stat-card">
              <h3>Investors</h3>
              <p>{dashboardData.statistics.totalInvestors}</p>
            </div>
            <div className="stat-card">
              <h3>Total Pitches</h3>
              <p>{dashboardData.statistics.totalPitches}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Users Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Full Name</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.fullName}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => deleteUser(user._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pitches' && (
          <div className="pitches-section">
            <h2>Pitches Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Entrepreneur</th>
                    <th>Industry</th>
                    <th>Funding Goal</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pitches.map(pitch => (
                    <tr key={pitch._id}>
                      <td>{pitch.title}</td>
                      <td>{pitch.entrepreneur?.fullName || pitch.entrepreneur?.username}</td>
                      <td>{pitch.industry}</td>
                      <td>${pitch.fundingGoal?.toLocaleString()}</td>
                      <td>{new Date(pitch.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => deletePitch(pitch._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;