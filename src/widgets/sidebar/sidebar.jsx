import React from 'react';
import './sidebar.css';
import { 
  FaBars, 
  FaTachometerAlt, 
  FaUserInjured, 
  FaCalendarAlt,
  FaSignOutAlt,
  FaSun,
  FaMoon
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, toggleSidebar, theme, setTheme }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${theme === 'dark' ? 'sidebar--dark' : ''}`}>
      <div className="sidebar-header">
        <h3 className="logo-text">P4L</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <ul className="menu-items">
        {/* Dashboard Link */}
        <li className="item active">
          <a href="#">
            <FaTachometerAlt className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </a>
        </li>
        
        {/* Donors Link */}
        <li className="item">
          <a href="#">
            <FaUserInjured className="menu-icon" />
            <span className="menu-text">Donors</span>
          </a>
        </li>

        {/* Events Link */}
        <li className="item">
          <a href="#">
            <FaCalendarAlt className="menu-icon" />
            <span className="menu-text">Events</span>
          </a>
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

        {/* Logout Link */}
        <a href="#">
          <FaSignOutAlt className="menu-icon" />
          <span className="menu-text">Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;