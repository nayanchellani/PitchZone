import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import { cleanFormData, validateProfileForm, getCharacterCountInfo } from '../utils/formValidation';
import { useToast } from '../context/ToastContext';
import { 
  User, Mail, MapPin, Calendar, Briefcase, 
  Rocket, TrendingUp, DollarSign, Award,
  Linkedin, Globe, Phone, Edit2, X, Plus,
  Layout, Activity, AlertTriangle 
} from 'lucide-react';
import '../App.css';

const Profile = () => {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPitchId, setDeletingPitchId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
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
        const profileResponse = await fetch(API_ENDPOINTS.getProfile, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const profileData = await profileResponse.json();
        if (profileData.success) {
          setUser(profileData.user);
          const formData = {
            fullName: profileData.user.fullName || '',
            bio: profileData.user.bio || '',
            phoneNumber: profileData.user.phoneNumber || '',
            occupation: profileData.user.occupation || '',
            location: profileData.user.location || '',
            website: profileData.user.website || '',
            companyName: profileData.user.companyName || '',
            industry: profileData.user.industry || '',
            linkedinUrl: profileData.user.linkedinUrl || ''
          };
          
          setEditForm(formData);
          setInitialFormState(formData);

          // Fetch user's pitches if entrepreneur
          if (profileData.user.role === 'entrepreneur') {
            const pitchesResponse = await fetch(`${API_ENDPOINTS.pitches}/my/pitches`, {
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
    
    // Validate form data
    const validation = validateProfileForm(editForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const token = localStorage.getItem('token');
      
      // Clean form data - remove empty strings
      const cleanedData = cleanFormData(editForm);
      
      const response = await fetch(API_ENDPOINTS.updateProfile, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      if (data.success) {
        // Update both local state and localStorage
        setUser(data.user);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        
        setShowEditModal(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        // Handle backend validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.path || error.param] = error.msg;
          });
          setFormErrors(backendErrors);
        } else {
          showToast(data.message || 'Failed to update profile', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const newState = { ...prev, [name]: value };
      
      // Check if dirty
      const isFormDirty = JSON.stringify(newState) !== JSON.stringify(initialFormState);
      setIsDirty(isFormDirty);
      
      return newState;
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCloseModal = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setShowEditModal(false);
        setEditForm(initialFormState);
        setIsDirty(false);
        showToast('Changes discarded', 'info');
      }
    } else {
      setShowEditModal(false);
    }
  };

  const handleDeletePitch = async (pitchId) => {
    if (!window.confirm('Are you sure you want to delete this pitch? This action cannot be undone.')) {
      return;
    }

    setDeletingPitchId(pitchId);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.pitches}/${pitchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        // Remove the deleted pitch from the local state
        setPitches(prevPitches => prevPitches.filter(pitch => pitch._id !== pitchId));
        showToast('Pitch deleted successfully!', 'pitch-deleted');
      } else {
        showToast(data.message || 'Failed to delete pitch', 'error');
      }
    } catch (error) {
      console.error('Error deleting pitch:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setDeletingPitchId(null);
    }
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
              <div className="completion-title">
                <Activity size={24} className="completion-icon" />
                <h3>Profile Strength</h3>
              </div>
              <span className="completion-percentage">{completionPercentage}%</span>
            </div>
            <p className="completion-message">
              Complete your profile to increase visibility and credibility with {user.role === 'entrepreneur' ? 'investors' : 'entrepreneurs'}.
            </p>
            <div className="progress-bar-container">
              <div 
                className="progress-fill" 
                style={{width: `${completionPercentage}%`}}
              ></div>
            </div>
          </div>
        )}

        <div className="profile-header-glass">
          <div className="profile-avatar-large">
             {(user.fullName || user.username).charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.fullName || user.username}</h1>
            <div className="profile-contact-row">
              <span className="contact-item"><Mail size={16} /> {user.email}</span>
              {user.phoneNumber && <span className="contact-item"><Phone size={16} /> {user.phoneNumber}</span>}
              {user.location && <span className="contact-item"><MapPin size={16} /> {user.location}</span>}
            </div>
            
            <div className="profile-badges">
              <span className={`role-badge ${user.role}`}>
                {user.role === 'entrepreneur' ? <Rocket size={14} /> : <Briefcase size={14} />}
                {user.role === 'entrepreneur' ? 'Entrepreneur' : 'Investor'}
              </span>
              <span className="join-date">
                <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {user.bio && (
              <p className="profile-bio">
                {user.bio}
              </p>
            )}
            
            <div className="profile-links">
               {user.website && (
                 <a href={user.website} target="_blank" rel="noopener noreferrer" className="link-item">
                   <Globe size={16} /> Website
                 </a>
               )}
               {user.linkedinUrl && (
                 <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-item">
                   <Linkedin size={16} /> LinkedIn
                 </a>
               )}
            </div>
          </div>
          <button className="edit-profile-btn-modern" onClick={() => setShowEditModal(true)}>
            <Edit2 size={18} /> Edit Profile
          </button>
        </div>

        {user.role === 'entrepreneur' ? (
          <div className="entrepreneur-dashboard">
            <div className="stats-grid-modern">
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><DollarSign size={24} /></div>
                <div className="stat-content">
                  <h3>Total Raised</h3>
                  <div className="stat-value">₹{((stats?.totalRaised || 0) / 1000000).toFixed(1)}M</div>
                  <p>Across all pitches</p>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><Rocket size={24} /></div>
                <div className="stat-content">
                  <h3>Active Pitches</h3>
                  <div className="stat-value">{stats?.activePitches || 0}</div>
                  <p>Currently fundraising</p>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><TrendingUp size={24} /></div>
                <div className="stat-content">
                  <h3>Success Rate</h3>
                  <div className="stat-value">{stats?.successRate || 0}%</div>
                  <p>Funding success</p>
                </div>
              </div>
            </div>

            <div className="section-header-modern">
              <h2><Layout size={24} /> My Pitches</h2>
              <a href="/pitches" className="create-pitch-link"><Plus size={18} /> New Pitch</a>
            </div>
            
            <div className="pitches-grid-modern">
              {pitches.length > 0 ? pitches.map(pitch => (
                <div key={pitch._id} className="pitch-card-modern">
                  <div className="pitch-card-header">
                    <h3>{pitch.title}</h3>
                    <span className={`status-pill ${pitch.status.toLowerCase()}`}>
                      {pitch.status}
                    </span>
                  </div>
                  <div className="pitch-card-body">
                    <div className="funding-progress-compact">
                      <div className="progress-labels">
                        <span>Raised: ₹{(pitch.raisedAmount / 1000).toFixed(0)}K</span>
                        <span>{Math.round((pitch.raisedAmount / pitch.targetAmount) * 100)}%</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-bar-fill" 
                          style={{width: `${(pitch.raisedAmount / pitch.targetAmount) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="pitch-mini-stats">
                      <span><User size={14} /> {pitch.investors?.length || 0} investors</span>
                      <span className="category-tag-modern">{pitch.category}</span>
                    </div>
                  </div>
                  <div className="pitch-card-actions">
                    <a href={`/pitches/${pitch._id}`} className="btn-view-details">Details</a>
                    <button 
                      className="btn-delete-icon"
                      onClick={() => handleDeletePitch(pitch._id)}
                      disabled={deletingPitchId === pitch._id}
                      title="Delete Pitch"
                    >
                      {deletingPitchId === pitch._id ? <div className="spinner-small"></div> : <X size={18} />}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state-modern">
                   <div className="empty-icon"><Rocket size={48} /></div>
                   <h3>No pitches yet</h3>
                   <p>Start your journey by creating your first pitch.</p>
                   <a href="/pitches" className="btn-primary-modern">Create Pitch</a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="investor-dashboard">
            <div className="stats-grid-modern">
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><Award size={24} /></div>
                <div className="stat-content">
                  <h3>Profile Completion</h3>
                  <div className="stat-value">{completionPercentage}%</div>
                  <p>Profile completeness</p>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><Calendar size={24} /></div>
                <div className="stat-content">
                  <h3>Member Since</h3>
                  <div className="stat-value">{new Date(user.createdAt).getFullYear()}</div>
                  <p>Year joined</p>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-bg"><Briefcase size={24} /></div>
                <div className="stat-content">
                  <h3>Role</h3>
                  <div className="stat-value">Investor</div>
                  <p>Active Investor</p>
                </div>
              </div>
            </div>

            <div className="section-header-modern">
              <h2><TrendingUp size={24} /> Investment Activity</h2>
            </div>
            
            <div className="empty-state-modern">
               <div className="empty-icon"><TrendingUp size={48} /></div>
               <h3>Investment tracking coming soon</h3>
               <p>Explore pitches to start your investment portfolio.</p>
               <a href="/pitches" className="btn-primary-modern">Explore Pitches</a>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="edit-profile-modal-glass">
            <div className="modal-content-glass">
              <div className="modal-header-glass">
                <h2>Edit Profile</h2>
                <button 
                  className="close-btn-glass"
                  onClick={handleCloseModal}
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className={`edit-profile-form-grid ${isSubmitting ? 'form-submitting' : ''}`}>
                <div className={`form-group-modern ${formErrors.fullName ? 'has-error' : ''}`}>
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.fullName && <div className="form-error">{formErrors.fullName}</div>}
                </div>
                
                <div className={`form-group-modern ${formErrors.phoneNumber ? 'has-error' : ''}`}>
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.phoneNumber && <div className="form-error">{formErrors.phoneNumber}</div>}
                </div>
                
                <div className={`form-group-modern ${formErrors.occupation ? 'has-error' : ''}`}>
                  <label>Occupation</label>
                  <div className="input-wrapper">
                     <Briefcase size={18} className="input-icon" />
                    <input
                      type="text"
                      name="occupation"
                      value={editForm.occupation}
                      onChange={handleInputChange}
                      placeholder="Enter your occupation"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.occupation && <div className="form-error">{formErrors.occupation}</div>}
                </div>
                
                <div className={`form-group-modern ${formErrors.location ? 'has-error' : ''}`}>
                  <label>Location</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.location && <div className="form-error">{formErrors.location}</div>}
                </div>
                
                <div className={`form-group-modern ${formErrors.website ? 'has-error' : ''}`}>
                  <label>Website</label>
                  <div className="input-wrapper">
                    <Globe size={18} className="input-icon" />
                    <input
                      type="url"
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.website && <div className="form-error">{formErrors.website}</div>}
                </div>
                
                {user.role === 'entrepreneur' ? (
                  <>
                    <div className={`form-group-modern ${formErrors.companyName ? 'has-error' : ''}`}>
                      <label>Company Name</label>
                      <div className="input-wrapper">
                         <Briefcase size={18} className="input-icon" />
                        <input
                          type="text"
                          name="companyName"
                          value={editForm.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter your company name"
                          disabled={isSubmitting}
                        />
                      </div>
                      {formErrors.companyName && <div className="form-error">{formErrors.companyName}</div>}
                    </div>
                    
                    <div className={`form-group-modern ${formErrors.industry ? 'has-error' : ''}`}>
                      <label>Industry</label>
                       <div className="input-wrapper">
                        <Activity size={18} className="input-icon" />
                        <input
                          type="text"
                          name="industry"
                          value={editForm.industry}
                          onChange={handleInputChange}
                          placeholder="Enter your industry"
                          disabled={isSubmitting}
                        />
                      </div>
                      {formErrors.industry && <div className="form-error">{formErrors.industry}</div>}
                    </div>
                  </>
                ) : (
                  <div className={`form-group-modern ${formErrors.linkedinUrl ? 'has-error' : ''}`}>
                    <label>LinkedIn URL</label>
                    <div className="input-wrapper">
                       <Linkedin size={18} className="input-icon" />
                       <input
                        type="url"
                        name="linkedinUrl"
                        value={editForm.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/..."
                        disabled={isSubmitting}
                      />
                    </div>
                    {formErrors.linkedinUrl && <div className="form-error">{formErrors.linkedinUrl}</div>}
                  </div>
                )}
                
                <div className={`form-group-full ${formErrors.bio ? 'has-error' : ''}`}>
                  <label>Bio</label>
                  <div className="form-field-with-counter">
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      disabled={isSubmitting}
                      className="modern-textarea"
                    />
                    <div className={`form-field-counter character-counter ${getCharacterCountInfo(editForm.bio, null, 500).status}`}>
                      {getCharacterCountInfo(editForm.bio, null, 500).message}
                    </div>
                  </div>
                  {formErrors.bio && <div className="form-error">{formErrors.bio}</div>}
                </div>
                
                <div className="form-actions-modern">
                  <button 
                    type="button" 
                    className="btn-cancel-modern"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save-modern" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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