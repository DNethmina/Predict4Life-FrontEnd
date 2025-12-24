// src/pages/signup/signup.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import logo from "../../assets/images/logo-black.png";

// API call helper
const registerUser = async (userData) => {
  try {
    const response = await fetch("https://predict4-life-gateway-service.vercel.app/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Check specific status codes
    if (response.status === 409) {
      throw new Error("Email already registered");
    } else if (response.status === 400) {
      throw new Error(data.message || "Invalid registration data");
    } else if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // If successful (status 200)
    if (response.status === 200) {
      return {
        status: 200,
        success: true,
        message: "Registration successful",
        data: data
      };
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error("Network error. Please check your connection");
    }
    throw error;
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    rePassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = 'Full Name is required.';

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!formData.contactNumber) {
        newErrors.contactNumber = 'Contact number is required.';
    } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Must be a valid 10-digit number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.rePassword) {
      newErrors.rePassword = 'Please confirm your password.';
    } else if (formData.password !== formData.rePassword) {
      newErrors.rePassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Prepare user data for API
        const userData = {
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          password: formData.password
        };

        const response = await registerUser(userData);

        // Check if registration was successful
        if (response && (response.status === 200 || response.success)) {
          setSuccessMessage("Registration successful! Redirecting to login...");
          
          // Clear form
          setFormData({
            name: '',
            email: '',
            contactNumber: '',
            password: '',
            rePassword: ''
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="signup-page-container"> {/* Use the new container class */}
      <div className="signup-card"> {/* Use the new card class */}
        <div className="welcome-text">
                                <img src={logo} alt="Predict4Life Logo" className="login-logo" />
                            </div>

        <form onSubmit={handleSubmit} className="signup-form"> {/* Use the new form class */}
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'is-invalid' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'is-invalid' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          {/* Contact Number Field */}
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className={errors.contactNumber ? 'is-invalid' : ''}
            />
            {errors.contactNumber && <div className="error-message">{errors.contactNumber}</div>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={errors.password ? 'is-invalid' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {/* Re-enter Password Field */}
          <div className="form-group">
            <label htmlFor="rePassword">Re-enter Password</label>
            <input
              type="password"
              id="rePassword"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.rePassword ? 'is-invalid' : ''}
            />
            {errors.rePassword && <div className="error-message">{errors.rePassword}</div>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="bottom-text">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;