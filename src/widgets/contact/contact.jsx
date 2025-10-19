import React, { useState } from 'react';
import './contact.css';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'; // Using Feather Icons

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // e.g., send the data to a backend server or an email service.
    console.log('Form data submitted:', formData);
    alert(`Thank you for your message, ${formData.name}! We'll get back to you soon.`);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Let's Talk!</h2>
          <p className="contact-intro">
            Have a question, a project idea, or just want to say hello? We'd love to hear from you. 
            Fill out the form or use our contact details below.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span>123 Life Saver Lane, Colombo, Sri Lanka</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <a href="tel:+94112345678">+94 11 234 5678</a>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <a href="mailto:contact@predict4life.com">contact@predict4life.com</a>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <h3>Send us a Message</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="6" 
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..." 
                required 
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;