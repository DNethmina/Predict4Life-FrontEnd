import React from 'react'
import './Navbar.css'
import logo_light from '../../assets/images/logo-black.png'
import logo_dark from '../../assets/images/logo-white.png'
import toggle_light from '../../assets/images/night.png'
import toggle_dark from '../../assets/images/day.png'
import { Link, NavLink } from 'react-router-dom'

const Navbar = ({theme, setTheme}) => {

  const toggle_mode = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  }

  return (
    <div className='navbar'>
      <Link to="/">
        <img src={theme === 'light' ? logo_light : logo_dark} alt="Predict4Life" className='logo' />
      </Link>

      <ul className='nav-list'>
        <li><NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Home</NavLink></li>
        <li><NavLink to="/donate" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Donate</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>Contact Us</NavLink></li>
        <li><NavLink to="/about" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>About Us</NavLink></li>
      </ul>

      <div className="nav-right">
        <button className="login-button">Login</button>
        <img 
          onClick={toggle_mode} 
          src={theme === 'light' ? toggle_light : toggle_dark} 
          alt={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"} 
          className='toggle-icon'
        />
      </div>
    </div>
  )
}

export default Navbar