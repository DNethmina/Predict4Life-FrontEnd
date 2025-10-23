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
  FaHome
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
        <li className="item active">
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

        {/* Events Link */}
        <li className="item">
          <button onClick={() => navigate('/events')}>
            <FaCalendarAlt className="menu-icon" />
            <span className="menu-text">Events</span>
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