import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';
import '../../styles/Theme.css';
import '../../styles/StaffDashboard.css';
import { hamburgerIcon } from '../../assets/icons';

const StaffDashboard = () => {
  const { isDarkMode, ThemeToggle } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  // Read the server port from environment variables; default to 5174 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First verify the user's authentication and role
        const authResponse = await axios.get(`${baseURL}/api/auth/verify`, {
          withCredentials: true,
        });
        
        if (authResponse.data.authenticated && authResponse.data.role === 'staff') {
          // Fetch staff profile
          const profileResponse = await axios.get(`${baseURL}/api/staff/profile`, {
            withCredentials: true,
          });
          
          setUser(profileResponse.data);
        } else {
          // Not authenticated as staff, redirect to login
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [baseURL, navigate]);

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
      await axios.post(`${baseURL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div className={`staff-dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`staff-dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Desktop Sidebar */}
      <div className="staff-sidebar">
        <div className="sidebar-content">
          <ul>
            <li className={activeView === 'home' ? 'menu-item home active' : 'menu-item home'} onClick={() => { setActiveView('home'); navigate('/staff'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span className="tooltip">Home</span>
            </li>
            <li className={activeView === 'operations' ? 'menu-item operations active' : 'menu-item operations'} onClick={() => { setActiveView('operations'); navigate('/staff/operations'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
              <span className="tooltip">Operations</span>
            </li>
            <li className={activeView === 'sponsoring' ? 'menu-item sponsoring active' : 'menu-item sponsoring'} onClick={() => { setActiveView('sponsoring'); navigate('/staff/sponsoring'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
              <span className="tooltip">Sponsoring</span>
            </li>
            <li className={activeView === 'tech' ? 'menu-item tech active' : 'menu-item tech'} onClick={() => { setActiveView('tech'); navigate('/staff/tech'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="m18 16 4-4-4-4"/>
                <path d="m6 8-4 4 4 4"/>
                <path d="m14.5 4-5 16"/>
              </svg>
              <span className="tooltip">Tech</span>
            </li>
            <li className={activeView === 'marketing' ? 'menu-item marketing active' : 'menu-item marketing'} onClick={() => { setActiveView('marketing'); navigate('/staff/marketing'); }}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 247.065 247.065" className="icon" fill="currentColor">
                <g>
                  <path d="M160.551,36.935c-0.614-1.892-1.956-3.462-3.727-4.365c-1.774-0.904-3.831-1.065-5.724-0.45l-31.376,10.196
                    c-3.939,1.28-6.096,5.511-4.815,9.45l1.568,4.828l-79.811,58.625L5.183,125.448c-1.892,0.615-3.462,1.956-4.365,3.728
                    c-0.903,1.772-1.065,3.831-0.45,5.723l19.129,58.862c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369
                    l31.478-10.229l16.173,0.085c3.248,15.336,16.888,26.88,33.176,26.88c16.164,0,29.714-11.371,33.095-26.531l16.587,0.087
                    l1.568,4.829c0.614,1.892,1.955,3.462,3.728,4.365c1.064,0.542,2.232,0.817,3.405,0.817c0.78,0,1.563-0.122,2.317-0.367
                    l31.377-10.195c3.939-1.28,6.096-5.511,4.816-9.45L160.551,36.935z M31.444,181.992l-14.492-44.597l18.364-5.967l14.49,44.597
                    L31.444,181.992z M109.774,200.312c-7.912,0-14.694-4.887-17.513-11.797l34.958,0.184
                    C124.356,195.514,117.617,200.312,109.774,200.312z M64.714,173.369l-7.888-24.277l-7.888-24.277l72.419-53.194l22.209,68.349
                    l11.006,33.873L64.714,173.369z M172.972,181.929l-0.921-2.833c-0.001-0.005-0.002-0.011-0.004-0.017l-19.815-60.983l-20.74-63.833
                    l17.111-5.561l41.48,127.665L172.972,181.929z"/>
                  <path d="M185.807,73.393c1.092,0.556,2.254,0.819,3.4,0.819c2.73,0,5.363-1.496,6.688-4.096l13.461-26.41
                    c1.882-3.69,0.415-8.207-3.275-10.088c-3.69-1.88-8.207-0.415-10.088,3.276l-13.461,26.41
                    C180.65,66.995,182.117,71.512,185.807,73.393z"/>
                  <path d="M242.176,144.712l-26.414-13.455c-3.691-1.879-8.207-0.412-10.087,3.279c-1.881,3.691-0.412,8.207,3.278,10.087
                    l26.414,13.455c1.091,0.555,2.253,0.818,3.398,0.818c2.73,0,5.364-1.497,6.689-4.097
                    C247.335,151.109,245.867,146.593,242.176,144.712z"/>
                  <path d="M204.242,101.204c1.03,3.169,3.97,5.184,7.131,5.184c0.769,0,1.55-0.119,2.32-0.369l28.188-9.16
                    c3.938-1.28,6.095-5.511,4.814-9.451c-1.28-3.94-5.511-6.092-9.451-4.815l-28.188,9.16
                    C205.118,93.034,202.962,97.265,204.242,101.204z"/>
                </g>
              </svg>
              <span className="tooltip">Marketing</span>
            </li>
            <li className={activeView === 'exec' ? 'menu-item exec active' : 'menu-item exec'} onClick={() => { setActiveView('exec'); navigate('/staff/exec'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="tooltip">Exec</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="mobile-bottom-bar">
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <img src={hamburgerIcon} alt="Menu" className="menu-icon" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="staff-main-content">
        <div className="dashboard-header">
          <h1>Staff Dashboard</h1>
        </div>
        <Outlet />
      </div>

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
              <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;