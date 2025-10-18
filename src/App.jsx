import React, { useEffect, useState } from 'react'
import Navbar from './widgets/navbar/Navbar'
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Donate from './routes/Donate';
import Contact from './routes/Contact';
import About from './routes/About';

const App = () => {

  const current_theme = localStorage.getItem('current_theme');
  const  [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  },[theme]);

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}


export default App