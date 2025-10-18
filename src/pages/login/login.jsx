import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        console.log("Logging in with:", { email, password });
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

                        <button type="submit" className="login-button">Sign In</button>
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