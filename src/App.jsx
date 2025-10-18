import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import both pages
import Login from './pages/login/login.jsx'
import Signup from './pages/signup/signup.jsx'; // 1. Import the Signup component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* 2. Add the new route for the signup page */}
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </Router>
  )
}

export default App;