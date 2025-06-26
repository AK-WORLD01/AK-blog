import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from './assests/logo1.png'; // Import logo from assets folder

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply dark/light mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Update authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/auth');
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  // Only show auth button on /auth route
  const showAuthButton = location.pathname === '/auth';

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled' : ''} ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container">
        {/* Logo and Brand Name */}
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center">
            <div className="logo-container">
              <img src={logo} alt="AK Blog Logo" className="logo" width="40" height="40" />
            </div>
            <span className="brand-name ms-2">AK BLOG</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={`navbar-toggler-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navbar Items */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Articles</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>

          {/* Dark/Light Mode Toggle and Auth Buttons */}
          <div className="d-flex align-items-center ms-lg-3">
            <div className="mode-toggle mx-3">
              <input 
                type="checkbox" 
                id="toggle-mode" 
                className="toggle-checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label htmlFor="toggle-mode" className="toggle-label">
                <span className="toggle-ball"></span>
                <span className="sun-icon">☀️</span>
                <span className="moon-icon">🌙</span>
              </label>
            </div>

            {showAuthButton && !isAuthenticated ? (
              <Link 
                to="/auth" 
                className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} signup-btn`}
              >
                Sign Up
              </Link>
            ) : isAuthenticated ? (
              <button 
                className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} signup-btn`}
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;