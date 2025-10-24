import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { 
  FaBars, 
  FaTachometerAlt, 
  FaUserInjured, 
  FaCalendarAlt,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaHome,
  FaChartLine,
  FaHospital,
  FaTrash,
  FaCampground,
  FaClipboardList
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, toggleSidebar, theme, setTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('authToken');
    // Clear any other user data
    localStorage.removeItem('user');
    // Redirect to home page
    navigate('/');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${theme === 'dark' ? 'sidebar--dark' : ''}`}>
      <div className="sidebar-header">
        <h3 className="logo-text">P4L</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <ul className="menu-items">
        {/* Home Link */}
        <li className="item">
          <button onClick={() => navigate('/')}>
            <FaHome className="menu-icon" />
            <span className="menu-text">Home</span>
          </button>
        </li>

        {/* Dashboard Link */}
        <li className="item">
          <button onClick={() => navigate('/dashboard')}>
            <FaTachometerAlt className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </button>
        </li>
        
        {/* Donors Link */}
        <li className="item">
          <button onClick={() => navigate('/donors')}>
            <FaUserInjured className="menu-icon" />
            <span className="menu-text">Donors</span>
          </button>
        </li>
        

        {/* Forms Section */}
        <li className="section-title">
          <span className="menu-text">Forms</span>
        </li>

        {/* Blood Prediction Form */}
        <li className="item">
          <button onClick={() => navigate('/blood-prediction')}>
            <FaChartLine className="menu-icon" />
            <span className="menu-text">Blood Prediction</span>
          </button>
        </li>

        {/* Blood Usage Form */}
        <li className="item">
          <button onClick={() => navigate('/blood-usage')}>
            <FaHospital className="menu-icon" />
            <span className="menu-text">Blood Usage</span>
          </button>
        </li>

        {/* Blood Wastage Form */}
        <li className="item">
          <button onClick={() => navigate('/blood-wastage')}>
            <FaTrash className="menu-icon" />
            <span className="menu-text">Blood Wastage</span>
          </button>
        </li>

        {/* Blood Camp Form */}
        <li className="item">
          <button onClick={() => navigate('/blood-camp')}>
            <FaCampground className="menu-icon" />
            <span className="menu-text">Blood Camp</span>
          </button>
        </li>

      </ul>

      <div className="sidebar-footer">
        {/* Theme Toggle Button */}
        <button 
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FaMoon className="menu-icon" /> : <FaSun className="menu-icon" />}
          <span className="menu-text">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="menu-icon" />
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;