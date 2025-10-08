import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api"; // ✅ Import API config
import "../App.css";

const CreateAcc = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "", // ✅ Added username field
    email: "",
    password: "",
    confirmPassword: "",
    userType: "entrepreneur",
    linkedinUrl: "",
    accessCode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    // Must be 3-30 characters, only letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUserTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
      // Clear investor-specific fields when switching to entrepreneur
      linkedinUrl: type === "entrepreneur" ? "" : prev.linkedinUrl,
      accessCode: type === "entrepreneur" ? "" : prev.accessCode,
    }));

    // Clear any related errors
    setErrors((prev) => ({
      ...prev,
      linkedinUrl: "",
      accessCode: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // ✅ Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(formData.username)) {
      newErrors.username =
        "Username must be 3-30 characters and contain only letters, numbers, and underscores";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // ✅ Validate password length (backend requires min 6 characters)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate investor-specific fields
    if (formData.userType === "investor") {
      if (!formData.linkedinUrl.trim()) {
        newErrors.linkedinUrl = "LinkedIn URL is required for investors";
      }

      if (!formData.accessCode.trim()) {
        newErrors.accessCode = "Access code is required for investors";
      } else if (formData.accessCode !== "0000") {
        newErrors.accessCode = "Invalid access code";
      }
    }

    setErrors(newErrors);

    // If no errors, proceed with account creation
    if (Object.keys(newErrors).length === 0) {
      setLoading(true); // ✅ Set loading state

      try {
        // ✅ Build registration data matching backend schema
        const registrationData = {
          username: formData.username, // ✅ Backend requires username
          email: formData.email,
          password: formData.password,
          role: formData.userType,
          fullName: formData.fullName,
        };

        // Add investor-specific data
        if (formData.userType === "investor" && formData.linkedinUrl) {
          registrationData.linkedinUrl = formData.linkedinUrl;
        }

        console.log("Sending registration data:", registrationData); // ✅ Debug log

        // ✅ Use API_ENDPOINTS instead of hardcoded URL
        const response = await fetch(API_ENDPOINTS.register, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });

        const data = await response.json();
        console.log("Server response:", data); // ✅ Debug log

        if (data.success) {
          // ✅ Store token and user data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Registration successful - redirect to dashboard
          alert("Account created successfully! Welcome to PitchZone.");
          navigate("/dashboard");
        } else {
          // Handle registration errors
          if (data.errors && Array.isArray(data.errors)) {
            const backendErrors = {};
            data.errors.forEach((error) => {
              // Map backend field names to form field names
              const fieldName = error.path || error.param;
              backendErrors[fieldName] = error.msg;
            });
            setErrors(backendErrors);
          } else {
            setErrors({ general: data.message || "Registration failed" });
          }
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({
          general: "Network error. Please check if the server is running.",
        });
      } finally {
        setLoading(false); // ✅ Reset loading state
      }
    }
  };

  return (
    <div className="login-container">
      <div className="signup-card">
        <div className="signup-left">
          <h1 className="signup-main-title">
            Get Started — Your Ideas Deserve the Spotlight
          </h1>
          <p className="signup-subtitle">
            Your journey from idea to investment begins here
          </p>
        </div>

        <div className="signup-right">
          <h2 className="signup-form-title">Create Account</h2>

          {errors.general && (
            <div
              className="error-message general-error"
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "#fee",
                color: "#e74c3c",
                borderRadius: "4px",
              }}
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="What should we call you?"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`signup-input ${errors.fullName ? "error" : ""}`}
              />
              <span className="input-icon">👤</span>
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            {/* ✅ Added username field */}
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleInputChange}
                className={`signup-input ${errors.username ? "error" : ""}`}
              />
              <span className="input-icon">@</span>
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={`signup-input ${errors.email ? "error" : ""}`}
              />
              <span className="input-icon">📧</span>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <div className="toggle-container">
                <span className="toggle-label">I'm an</span>
                <div className="toggle-switch">
                  <button
                    type="button"
                    className={`toggle-option ${
                      formData.userType === "entrepreneur" ? "active" : ""
                    }`}
                    onClick={() => handleUserTypeToggle("entrepreneur")}
                  >
                    Entrepreneur
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${
                      formData.userType === "investor" ? "active" : ""
                    }`}
                    onClick={() => handleUserTypeToggle("investor")}
                  >
                    Investor
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`investor-fields ${
                formData.userType === "investor" ? "show" : "hide"
              }`}
            >
              {formData.userType === "investor" && (
                <>
                  <div className="input-group investor-field">
                    <input
                      type="url"
                      name="linkedinUrl"
                      placeholder="Enter your LinkedIn Profile URL"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className={`signup-input ${
                        errors.linkedinUrl ? "error" : ""
                      }`}
                    />
                    <span className="input-icon">💼</span>
                    {errors.linkedinUrl && (
                      <span className="error-message">
                        {errors.linkedinUrl}
                      </span>
                    )}
                  </div>

                  <div className="input-group investor-field">
                    <input
                      type="text"
                      name="accessCode"
                      placeholder="Investor Access Code"
                      value={formData.accessCode}
                      onChange={handleInputChange}
                      className={`signup-input ${
                        errors.accessCode ? "error" : ""
                      }`}
                    />
                    <span className="input-icon">🔑</span>
                    {errors.accessCode && (
                      <span className="error-message">{errors.accessCode}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Create a secure password (min. 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className={`signup-input ${errors.password ? "error" : ""}`}
              />
              <span className="input-icon">🔒</span>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`signup-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
              />
              <span className="input-icon">🔐</span>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {/* ✅ Added loading state to button */}
            <button
              type="submit"
              className={`signup-button auth-button ${
                loading ? "disabled-button" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAcc;
