import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import "./login.css";

import logo from "../../assets/images/logo-black.png";

// API call helper
const loginUser = async (credentials) => {
    try {
        const response = await fetch("https://predict4-life-gateway-service.vercel.app/api/auth/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        // Check for specific status codes
        if (response.status === 401) {
            throw new Error("Invalid email or password");
        } else if (response.status === 403) {
            throw new Error("Account is locked. Please contact support");
        } else if (!response.ok) {
            throw new Error(data.message || "Login failed. Please try again");
        }

        // If successful (status 200)
        if (response.status === 200 && data.token) {
            return {
                token: data.token,
                user: data.user // If the API returns user data
            };
        } else {
            throw new Error("Invalid response from server");
        }
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error("Network error. Please check your connection");
        }
        throw error;
    }
};

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Input validation
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await loginUser({ email, password });

            if (response.token) {
                // Store token in localStorage
                localStorage.setItem("authToken", response.token);
                
                // Store user data if available
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }

                // Set success message
                setSuccessMessage("Login successful! Welcome back!");

                // Redirect after short delay
                setTimeout(() => {
                    navigate("/dashboard"); // Redirect to dashboard
                }, 1500);
            } else {
                throw new Error("No token received from server");
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <div className="login-form-section">

                    <div className="welcome-text">
                        <img src={logo} alt="Predict4Life Logo" className="login-logo" />
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="login-options">
                            <Link to="/forgot-password" className="forgot-password-link">
                                Forgot Password?
                            </Link>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="signup-text">
                        Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

