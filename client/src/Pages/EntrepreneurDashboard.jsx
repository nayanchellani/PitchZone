import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import "../App.css";

const EntrepreneurDashboard = () => {
  const [activePitch, setActivePitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPitch();
  }, []);

  const fetchMyPitch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/pitches/my/pitches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.pitches && data.pitches.length > 0) {
        const pitch = data.pitches[0];
        setActivePitch(pitch);
        setEditData({
          title: pitch.title,
          description: pitch.description,
          category: pitch.category,
          equityOffered: pitch.equityOffered,
        });
      } else {
        setActivePitch(null);
      }
    } catch (err) {
      setError("Failed to load pitch data");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!activePitch) return 0;
    return Math.min(
      (activePitch.raisedAmount / activePitch.targetAmount) * 100,
      100
    );
  };

  const handleEditPitch = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/pitches/${activePitch._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setActivePitch(data.pitch);
        setEditMode(false);
        alert("Pitch updated successfully!");
      } else {
        alert(data.message || "Failed to update pitch");
      }
    } catch (err) {
      alert("Error updating pitch");
    }
  };

  const handleClosePitch = async () => {
    if (!window.confirm("Are you sure you want to delete this pitch?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/pitches/${activePitch._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Pitch deleted successfully!");
        setActivePitch(null);
      } else {
        alert(data.message || "Failed to delete pitch");
      }
    } catch (err) {
      alert("Error deleting pitch");
    }
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!activePitch) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Entrepreneur Dashboard</h1>
          <p className="dashboard-subtitle">You don't have any active pitch</p>
        </div>
        <div className="empty-state">
          <p>Create your first pitch to get started!</p>
          <Link to="/pitches" className="action-button">
            Create Pitch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Entrepreneur Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor your pitch performance and investor engagement
        </p>
      </div>

      <div className="pitch-section">
        <h2>My Active Pitch</h2>
        <div className="pitch-card">
          <div className="card-header">
            {editMode ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <h3>{activePitch.title}</h3>
            )}
            <div className="actions">
              <button className="action-button" onClick={handleEditPitch}>
                {editMode ? "💾 Save" : "✏️ Edit"}
              </button>
              {editMode && (
                <button
                  className="action-button"
                  onClick={() => setEditMode(false)}
                >
                  ❌ Cancel
                </button>
              )}
              {!editMode && (
                <button className="action-button" onClick={handleClosePitch}>
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>

          {editMode ? (
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              className="edit-textarea"
              rows="4"
            />
          ) : (
            <p className="description">{activePitch.description}</p>
          )}

          <div className="stats-card">
            <h4>Pitch Status</h4>
            <div className="stats-grid">
              <div className="stat">
                <span className="label">Raised</span>
                <span className="value">
                  ₹{activePitch.raisedAmount.toLocaleString()}
                </span>
              </div>
              <div className="stat">
                <span className="label">Target</span>
                <span className="value">
                  ₹{activePitch.targetAmount.toLocaleString()}
                </span>
              </div>
              <div className="stat">
                <span className="label">Progress</span>
                <span className="value">
                  {getProgressPercentage().toFixed(1)}%
                </span>
              </div>
              <div className="stat">
                <span className="label">Investors</span>
                <span className="value">{activePitch.investors.length}</span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <Link to={`/pitches/${activePitch._id}`} className="view-link">
            View Full Details →
          </Link>
        </div>
      </div>

      {activePitch.feedback && activePitch.feedback.length > 0 && (
        <div className="feedback-section">
          <h2>Feedback from Investors</h2>
          <div className="feedback-list">
            {activePitch.feedback.map((fb, index) => (
              <div key={index} className="feedback-item">
                <div className="avatar">🦈</div>
                <div className="content">
                  <p>{fb.message}</p>
                  <span className="time">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePitch.investors && activePitch.investors.length > 0 && (
        <div className="investors-section">
          <h2>Current Investors</h2>
          <div className="investors-list">
            {activePitch.investors.map((investor, index) => (
              <div key={index} className="investor-item">
                <div className="info">
                  <span className="avatar">👤</span>
                  <span className="name">
                    {investor.userId?.username || "Anonymous"}
                  </span>
                </div>
                <span className="amount">
                  ₹{investor.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurDashboard;
