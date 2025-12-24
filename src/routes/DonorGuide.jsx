import React from 'react';
import { Link } from 'react-router-dom';
import './DonorGuide.css'; 
import { 
  FaCheckCircle, 
  FaHeartbeat, 
  FaCalendarCheck, 
  FaUtensils, 
  FaWater, 
  FaBed, 
  FaIdCard, 
  FaCookieBite, 
  FaArrowRight 
} from 'react-icons/fa';

const DonorGuide = () => {
  return (
    <div className="guide-page-wrapper">
      <div className="guide-container dashboard-card">
        
        <div className="guide-header">
          <FaHeartbeat className="header-icon" />
          <h1>Thank You for Your Interest in Donating!</h1>
          <p className="subheading">
            Donating blood is a simple, safe process that saves lives. 
            Here’s what you need to know to get started.
          </p>
        </div>

        {/* --- Disclaimer --- */}
        <div className="disclaimer-box">
          <strong>Please Note:</strong> These are general guidelines. Final eligibility will be 
          determined by the medical staff at the donation center.
        </div>

        {/* --- Eligibility Section --- */}
        <section className="guide-section">
          <h2>Basic Eligibility Guidelines</h2>
          <p>You can be a hero if you meet these basic requirements:</p>
          <ul className="eligibility-list">
            <li><FaCheckCircle className="icon-check" /> <strong>Age:</strong> You are between 18 and 60 years old.</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Weight:</strong> You weigh at least 50 kg (110 lbs).</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Health:</strong> You are in good general health and feeling well today (no cold, flu, or fever).</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Time:</strong> It has been at least 3-4 months since your last donation.</li>
          </ul>
        </section>

        {/* --- The Donation Process (The user's main question) --- */}
        <section className="guide-section">
          <h2>The Donation Process: A 3-Step Guide</h2>
          <div className="process-timeline">
            
            {/* --- Step 1: Before Donation --- */}
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Before Your Donation</h3>
              <p>Prepare your body to make donating easy and comfortable.</p>
              <ul className="step-list">
                <li><FaBed /> Get a good night's sleep (7-8 hours).</li>
                <li><FaWater /> Drink plenty of water (an extra 2 glasses is great).</li>
                <li><FaUtensils /> Eat a healthy, iron-rich meal a few hours before.</li>
                <li><FaIdCard /> Bring a valid photo ID (like your NIC or Driver's License).</li>
              </ul>
            </div>

            {/* --- Step 2: During Donation --- */}
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>At the Donation Center</h3>
              <p>Our professional staff will guide you through each step.</p>
              <ul className="step-list">
                <li><strong>Registration:</strong> You'll fill out a confidential form (similar to our signup!).</li>
                <li><strong>Mini-Health Check:</strong> We'll check your temperature, pulse, and blood pressure.</li>
                <li><strong>The Donation:</strong> The actual donation only takes about 10-15 minutes.</li>
              </ul>
            </div>

            {/* --- Step 3: After Donation --- */}
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>After Your Donation</h3>
              <p>A few simple things to do to ensure you feel great.</p>
              <ul className="step-list">
                <li><FaCookieBite /> Rest for 10-15 minutes and enjoy the free refreshments.</li>
                <li><FaWater /> Continue to drink extra fluids for the rest of the day.</li>
                <li><strong>Avoid:</strong> Heavy lifting or strenuous exercise for the next 24 hours.</li>
                <li><strong>Feel Proud:</strong> You just saved up to 3 lives!</li>
              </ul>
            </div>

          </div>
        </section>

        {/* --- Call to Action --- */}
        <div className="guide-cta">
          <h2>Ready to Become a Donor?</h2>
          <p>By registering, you'll be alerted when your blood type is needed in your area. You are in full control of when and where you donate.</p>
          <Link to="/" className="guide-cta-btn">
            I understand, let's Register! <FaArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DonorGuide;