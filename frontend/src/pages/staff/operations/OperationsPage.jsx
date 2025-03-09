import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../components/ThemeProvider';
import '../../../styles/Theme.css';
import '../../../styles/StaffPages.css';
import { hamburgerIcon, sunIcon, moonIcon } from '../../../assets/icons';
import axios from 'axios';

const OperationsPage = () => {
  const { isDarkMode, ThemeToggle, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Read the server port from environment variables; default to 5174 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      navigate('/login');
    }
  };
  
  return (
    <div className={`staff-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="staff-page-header">
        <h1>Operations Team</h1>
        <div className="header-actions">
          <div className="menu-container" ref={menuRef}>
            <button 
              className="menu-button"
              data-active={menuOpen.toString()}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <img 
                src={hamburgerIcon} 
                alt="Menu" 
                style={{ width: '24px', height: '24px' }}
              />
            </button>
            {menuOpen && (
              <div className={`menu-popup ${menuOpen ? 'open' : ''}`}>
                <div className="menu-items">
                  <button 
                    className="menu-button-item"
                    onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                  >
                    Settings
                  </button>
                  <button 
                    className="menu-button-item logout-button"
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                  >
                    Logout
                  </button>
                  <div className="theme-toggle-container">
                    <div 
                      className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      role="switch"
                      aria-checked={isDarkMode}
                    >
                      <img src={sunIcon} alt="Light mode" className="theme-icon sun" />
                      <img src={moonIcon} alt="Dark mode" className="theme-icon moon" />
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="staff-page-nav themed-card">
        <NavLink to="/staff/operations/home" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/staff/operations/schedule" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Schedule
        </NavLink>
      </div>
      
      <div className="staff-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default OperationsPage;