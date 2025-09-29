import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../App.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
    occupation: '',
    location: '',
    website: '',
    companyName: '',
    industry: '',
    linkedinUrl: ''
  });

  // Fetch user profile and data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const profileData = await profileResponse.json();
        if (profileData.success) {
          setUser(profileData.user);
          setEditForm({
            fullName: profileData.user.fullName || '',
            bio: profileData.user.bio || '',
            phoneNumber: profileData.user.phoneNumber || '',
            occupation: profileData.user.occupation || '',
            location: profileData.user.location || '',
            website: profileData.user.website || '',
            companyName: profileData.user.companyName || '',
            industry: profileData.user.industry || '',
            linkedinUrl: profileData.user.linkedinUrl || ''
          });

          // Fetch user's pitches if entrepreneur
          if (profileData.user.role === 'entrepreneur') {
            const pitchesResponse = await fetch('http://localhost:5000/api/pitches/my/pitches', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            const pitchesData = await pitchesResponse.json();
            if (pitchesData.success) {
              setPitches(pitchesData.pitches);
            }
          }
        } else {
          setError(profileData.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setShowEditModal(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getProfileCompletionPercentage = () => {
    if (!user) return 0;
    const requiredFields = ['fullName', 'bio', 'phoneNumber', 'occupation', 'location'];
    const roleSpecificFields = user.role === 'entrepreneur' 
      ? ['companyName', 'industry'] 
      : ['linkedinUrl'];
    
    const allRequiredFields = [...requiredFields, ...roleSpecificFields];
    const completedFields = allRequiredFields.filter(field => user[field] && user[field].trim() !== '');
    
    return Math.round((completedFields.length / allRequiredFields.length) * 100);
  };

  const calculateStats = () => {
    if (user?.role === 'entrepreneur') {
      const totalRaised = pitches.reduce((sum, p) => sum + p.raisedAmount, 0);
      const activePitches = pitches.filter(p => p.status === 'Active').length;
      const fundedPitches = pitches.filter(p => p.status === 'Funded').length;
      const successRate = pitches.length > 0 ? Math.round((fundedPitches / pitches.length) * 100) : 0;
      
      return {
        totalRaised,
        activePitches,
        successRate
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <div className="error">{error || 'Profile not found'}</div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const completionPercentage = getProfileCompletionPercentage();

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        {completionPercentage < 100 && (
          <div className="profile-completion-card">
            <div className="completion-header">
              <h3>Complete Your Profile</h3>
              <span className="completion-percentage">{completionPercentage}%</span>
            </div>
            <p className="completion-message">
              Complete your profile to increase visibility and credibility with {user.role === 'entrepreneur' ? 'investors' : 'entrepreneurs'}.
            </p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${completionPercentage}%`}}
              ></div>
            </div>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar-large">
            <span>{(user.fullName || user.username).charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.fullName || user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-meta">
              <span className="profile-role">
                {user.role === 'entrepreneur' ? '🚀 Entrepreneur' : user.role === 'investor' ? '💼 Investor' : '👤 User'}
              </span>
              {user.location && <span className="profile-location">📍 {user.location}</span>}
              <span className="profile-joined">📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            {user.bio && (
              <p style={{ color: 'var(--light-gray)', opacity: 0.8, marginTop: 'var(--spacing-md)' }}>
                {user.bio}
              </p>
            )}
          </div>
          <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>
            Edit Profile
          </button>
        </div>

        {user.role === 'entrepreneur' ? (
          <div className="entrepreneur-section">
            <div className="stats-overview">
              <div className="stat-card">
                <h3>Total Raised</h3>
                <div className="stat-value">₹{((stats?.totalRaised || 0) / 1000000).toFixed(1)}M</div>
                <p>Across all pitches</p>
              </div>
              <div className="stat-card">
                <h3>Active Pitches</h3>
                <div className="stat-value">{stats?.activePitches || 0}</div>
                <p>Currently fundraising</p>
              </div>
              <div className="stat-card">
                <h3>Success Rate</h3>
                <div className="stat-value">{stats?.successRate || 0}%</div>
                <p>Funding success</p>
              </div>
            </div>

            <div className="pitches-section">
              <h2>My Pitches</h2>
              <div className="pitches-list">
                {pitches.length > 0 ? pitches.map(pitch => (
                  <div key={pitch._id} className="pitch-item">
                    <div className="pitch-item-header">
                      <h3>{pitch.title}</h3>
                      <span className={`status-badge ${pitch.status.toLowerCase()}`}>
                        {pitch.status}
                      </span>
                    </div>
                    <div className="pitch-item-stats">
                      <div className="funding-progress">
                        <div className="progress-info">
                          <span>Raised: ₹{(pitch.raisedAmount / 1000).toFixed(0)}K</span>
                          <span>Target: ₹{(pitch.targetAmount / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${(pitch.raisedAmount / pitch.targetAmount) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="pitch-meta">
                        <span>{pitch.investors?.length || 0} investors</span>
                        <span className="category-tag">{pitch.category}</span>
                      </div>
                    </div>
                    <div className="pitch-actions">
                      <a href={`/pitches/${pitch._id}`} className="btn-secondary">View Details</a>
                      <button className="btn-primary">Edit Pitch</button>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--light-gray)', opacity: 0.7, textAlign: 'center', padding: '2rem' }}>
                    No pitches yet. <a href="/pitches" style={{ color: 'var(--vibrant-cyan)' }}>Create your first pitch!</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="shark-section">
            <div className="stats-overview">
              <div className="stat-card">
                <h3>Profile Completion</h3>
                <div className="stat-value">{completionPercentage}%</div>
                <p>Profile completeness</p>
              </div>
              <div className="stat-card">
                <h3>Member Since</h3>
                <div className="stat-value">{new Date(user.createdAt).getFullYear()}</div>
                <p>Year joined</p>
              </div>
              <div className="stat-card">
                <h3>Role</h3>
                <div className="stat-value">💼</div>
                <p>Investor</p>
              </div>
            </div>

            <div className="investments-section">
              <h2>Investment Activity</h2>
              <p style={{ color: 'var(--light-gray)', opacity: 0.7, textAlign: 'center', padding: '2rem' }}>
                Investment tracking coming soon. <a href="/pitches" style={{ color: 'var(--vibrant-cyan)' }}>Explore pitches to invest!</a>
              </p>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="edit-profile-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="edit-profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={editForm.occupation}
                    onChange={handleInputChange}
                    placeholder="Enter your occupation"
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                  />
                </div>
                
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={editForm.website}
                    onChange={handleInputChange}
                    placeholder="Enter your website URL"
                  />
                </div>
                
                {user.role === 'entrepreneur' ? (
                  <>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={editForm.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={editForm.industry}
                        onChange={handleInputChange}
                        placeholder="Enter your industry"
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={editForm.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="Enter your LinkedIn profile URL"
                    />
                  </div>
                )}
                
                <div className="form-group-full">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-cta-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;