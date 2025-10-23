import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './widgets/navbar/Navbar.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import LoginForm from './pages/login/LoginForm.jsx';
import Signup from './pages/signup/signup.jsx';
import Sidebar from './widgets/sidebar/sidebar.jsx';
import Home from './routes/Home.jsx';
import './App.css';
import Contact from './widgets/contact/contact.jsx';
import About from './routes/About.jsx';
import DonorGuide from './routes/DonorGuide.jsx';
import Donor from './widgets/Donar/Donar.jsx';
import PredictionForm from './widgets/Forms/PredictionForm.jsx';
import BloodUsageForm from './widgets/Forms/BloodUsageForm.jsx';
import BloodWastageForm from './widgets/Forms/BloodWastageForm.jsx';
import BloodCampForm from './widgets/Forms/BloodCampForm.jsx';

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
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const PublicLayout = ({ children }) => (
    <div className={`app-wrapper ${theme} public`}>
      <Navbar theme={theme} setTheme={setTheme} />
      {children}
    </div>
  );

  const DashboardLayout = () => (
    <div className={`app-wrapper ${theme} dashboard`}>
      <Sidebar 
        theme={theme}
        setTheme={setTheme}
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />

      <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>

        <div className="page-content">

          <Dashboard theme={theme} />

        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Home Route (Public) */}
      <Route path="/" element={
        <PublicLayout>
          <Home theme={theme} />
        </PublicLayout>
      } />

      {/* About Route (Public) */}
      <Route path="/about" element={
        <PublicLayout>
          <About theme={theme} />
        </PublicLayout>
      } />

      {/* Contact Route (Public) */}
      <Route path="/contact" element={
        <PublicLayout>
          <Contact theme={theme} />
        </PublicLayout>
      } />

      {/* Login Route */}
      <Route path="/login" element={
        isAuthenticated() ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <div className={`app-wrapper ${theme}`}>
            <LoginForm />
          </div>
        )
      } />

      {/* Signup Route */}
      <Route path="/signup" element={
        isAuthenticated() ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <div className={`app-wrapper ${theme}`}>
            <Signup />
          </div>
        )
      } />
      
      {/* Dashboard Route (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* Donor Route (Protected) */}
      <Route
        path="/donors"
        element={
          <ProtectedRoute>
            <div className={`app-wrapper ${theme} dashboard`}>
              <Sidebar 
                theme={theme}
                setTheme={setTheme}
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
              <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="page-content">
                  <Donor theme={theme} />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Forms Routes (Protected) */}
      <Route
        path="/blood-prediction"
        element={
          <ProtectedRoute>
            <div className={`app-wrapper ${theme} dashboard`}>
              <Sidebar 
                theme={theme}
                setTheme={setTheme}
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
              <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="page-content">
                  <PredictionForm theme={theme} />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blood-usage"
        element={
          <ProtectedRoute>
            <div className={`app-wrapper ${theme} dashboard`}>
              <Sidebar 
                theme={theme}
                setTheme={setTheme}
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
              <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="page-content">
                  <BloodUsageForm theme={theme} />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blood-wastage"
        element={
          <ProtectedRoute>
            <div className={`app-wrapper ${theme} dashboard`}>
              <Sidebar 
                theme={theme}
                setTheme={setTheme}
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
              <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="page-content">
                  <BloodWastageForm theme={theme} />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blood-camp"
        element={
          <ProtectedRoute>
            <div className={`app-wrapper ${theme} dashboard`}>
              <Sidebar 
                theme={theme}
                setTheme={setTheme}
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
              />
              <div className={`content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="page-content">
                  <BloodCampForm theme={theme} />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Donor Guide Route (Public) */}
      <Route path="/donor-guide" element={
        <PublicLayout>
          <div className="page-content">
            <DonorGuide theme={theme} />
          </div>
        </PublicLayout>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
  );
}

export default App;