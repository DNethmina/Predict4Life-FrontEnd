import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FaBrain, FaUsers, FaDatabase, FaUserPlus, FaBell, FaHeartbeat } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      {/* --- Hero Section --- */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-headline">Blood Insights, Future Health</h1>
          <p className="hero-subheadline">
            Our intelligent platform connects donors, hospitals, and patients, 
            predicting blood demand to save lives—before it's too late.
          </p>
          <div className="hero-btns">
            <Link to="/signup" className="btn btn--primary">Become a Donor</Link>
            <Link to="/about" className="btn btn--outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="features-section">
        <h2>What We Do</h2>
        <div className="features-grid">
          <div className="info-card">
            <FaBrain className="info-icon" />
            <h3>Predict Demand</h3>
            <p>Using advanced algorithms to forecast blood shortages in specific locations.</p>
          </div>
          <div className="info-card">
            <FaUsers className="info-icon" />
            <h3>Connect Donors</h3>
            <p>Instantly notifying registered donors when their blood type is needed nearby.</p>
          </div>
          <div className="info-card">
            <FaDatabase className="info-icon" />
            <h3>Manage Inventory</h3>
            <p>Providing real-time inventory data for hospitals and blood banks.</p>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="info-card">
            <FaUserPlus className="info-icon" />
            <h3>1. Register</h3>
            <p>Create your secure donor profile in just a few minutes.</p>
          </div>
          <div className="info-card">
            <FaBell className="info-icon" />
            <h3>2. Get Notified</h3>
            <p>Receive alerts when a nearby hospital has a critical need for your blood type.</p>
          </div>
          <div className="info-card">
            <FaHeartbeat className="info-icon" />
            <h3>3. Save a Life</h3>
            <p>Visit a donation center, make your contribution, and become a hero.</p>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="cta-section">
        <h2>Join Our Community of Heroes</h2>
        <p>Whether you are a donor or a hospital, your participation makes a difference.</p>
        <Link to="/signup" className="btn btn--primary btn--cta">Register Today</Link>
      </section>
    </div>
  );
};

export default Home;