import React from 'react';
import './About.css';
import { FaHeartbeat, FaUsers, FaLightbulb, FaAward } from 'react-icons/fa';

// This line was incorrect and has been removed: import './assets/images'

// --- CORRECTED PATHS ---
// We go up one folder (../) to src, then down into assets/images
import teamMember1 from '../assets/images/member1.jpg';
import teamMember2 from '../assets/images/member2.jpg';
import teamMember3 from '../assets/images/member3.jpg';

const About = () => {
  const team = [
    { name: 'Deshan Nethmina', role: 'Frontend Engineer', image: teamMember1 },
    { name: 'Harindu De Silva', role: 'Backend Engineer', image: teamMember2 },
    { name: 'Hasodya Gayathran', role: 'UI/UX Engineer', image: teamMember3 },
  ];

  const values = [
    { icon: <FaHeartbeat />, title: 'Compassion', text: 'Every action is driven by a deep sense of empathy for patients and donors.' },
    { icon: <FaLightbulb />, title: 'Innovation', text: 'We use cutting-edge technology to solve critical challenges in blood management.' },
    { icon: <FaUsers />, title: 'Community', text: 'We are building a nationwide network of heroes dedicated to saving lives.' },
    { icon: <FaAward />, title: 'Integrity', text: 'We operate with unwavering transparency, ethics, and accountability.' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Connecting Heroes, Saving Lives</h1>
          <p>We are Predict 4 Life, a team dedicated to revolutionizing blood donation and management across Sri Lanka through technology and community.</p>
        </div>
      </section>

      {/* Mission and Story Section */}
      <section className="mission-story-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>To eliminate blood shortages and ensure that every patient in need has access to safe and timely blood transfusions. We achieve this by creating an intelligent, data-driven platform that connects donors, hospitals, and blood banks seamlessly.</p>
          </div>
          <div className="story-content">
            <h2>Our Story</h2>
            <p>Founded in 2024, Predict 4 Life was born from a simple yet powerful idea: what if we could predict blood demand before it becomes critical? Starting as a university research project, we witnessed the struggles faced by hospitals and families. This inspired us to build a real-world solution that bridges the gap between the generosity of donors and the urgent needs of patients.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="team-intro">The passionate individuals working to make a difference.</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} className="team-image" />
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-text">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;