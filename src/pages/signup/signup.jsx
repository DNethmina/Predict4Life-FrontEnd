// src/pages/signup/signup.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css'; // Import the stylesheet
import logo from "../../assets/images/logo-black.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    rePassword: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form Submitted Successfully!');
      console.log(formData);
      // Here you would typically call an API to register the user
    } else {
      console.log('Form validation failed.');
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

          <button type="submit" className="submit-btn">Sign Up</button>

          <div className="bottom-text">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;