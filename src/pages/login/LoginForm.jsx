import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { loginUser } from "../../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

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
                localStorage.setItem("authToken", response.token);
                navigate("/"); // Redirect to home page
            } else {
                setError("Invalid response from server");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <div className="login-form-section">
                    {/* --- CORRECTED SECTION --- */}
                    <div className="welcome-text">
                        <h1>Welcome</h1>
                        <h1 className="highlight">
                            Predict<span>4</span>Life
                        </h1>
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
                        
                        {error && <p className="error-message">{error}</p>}

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

export default Login;
