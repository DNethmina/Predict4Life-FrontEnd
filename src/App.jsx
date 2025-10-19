import React, { useEffect, useState } from 'react';
import Navbar from './widgets/navbar/Navbar.jsx';
import Dashboard from './pages/dashboard/dashboard';
import Sidebar from './widgets/sidebar/sidebar.jsx';
import './App.css'; // Import the layout CSS
import Contact from './widgets/contact/contact.jsx';
import About from './routes/About.jsx';

const App = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  // State to manage if the sidebar is collapsed or not
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to toggle the sidebar's state
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <div className={`app-wrapper ${theme}`}>
      <Sidebar 
        theme={theme}
        setTheme={setTheme} // <-- This is the missing prop
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar theme={theme} setTheme={setTheme} />
        <div className="page-content">
          <Dashboard theme={theme} />
          {/* Your <Routes> would go here */}
        </div>
      </div>
    </div>
  );
}

export default App;