import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import {
  sunIcon,
  moonIcon,
  hamburgerIcon,
  githubIcon,
  linkedInIcon,
  linkedInDarkIcon,
  discordIcon,
  discordDarkIcon,
  instagramIcon,
  instagramDarkIcon,
} from '../../assets/icons';
import '../../styles/HackerDashboard.css';

const ThemeToggle = ({ isDarkMode, onToggle }) => (
  <div 
    className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    role="switch"
    aria-checked={isDarkMode}
  >
    <img src={sunIcon} alt="Light mode" className="theme-icon sun" />
    <img src={moonIcon} alt="Dark mode" className="theme-icon moon" />
    <div className="toggle-thumb" />
  </div>
);

const HackerDashboard = () => {
  const [user, setUser] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    discord: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  // Build the base URL using the environment variable. Default to 5174 if not set.
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/hacker/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
        setSocialLinks({
          github: response.data.socialLinks?.github || '',
          linkedin: response.data.socialLinks?.linkedin || '',
          discord: response.data.socialLinks?.discord || '',
          instagram: response.data.socialLinks?.instagram || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [baseURL]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const handleSocialChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSocialUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${baseURL}/api/hacker/profile/socialLinks`,
        { socialLinks },
        { withCredentials: true }
      );
      setUser({ ...user, socialLinks: response.data.socialLinks });
      alert("Social links updated successfully.");
    } catch (error) {
      console.error('Error updating social links:', error);
      alert("Error updating social links.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      navigate('/login');
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading user data...</p></div>;
  }

  if (!user) {
    return <div className="dashboard-container"><p>Failed to load user data.</p></div>;
  }

  // Prepare QR code data as JSON containing user's name and email.
  const qrData = JSON.stringify({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });

  return (
    <div className="dashboard-container hacker-dashboard">
      <div className="dashboard-content">
        {/* Left Panel: User Info */}
        <div className="left-panel">
          <header className="dashboard-header">
            <h1 className="user-name">
              <span>{user.firstName} {user.lastName}</span>
            </h1>
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
                      <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>
          <div className="profile-picture-container">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="placeholder-image">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          <p className="user-email">{user.email}</p>
          <div className="qr-code-container">
            <QRCodeCanvas value={qrData} size={150} />
          </div>
        </div>

        {/* Right Panel: Social Links Form */}
        <div className="right-panel">
          <h2 className="form-title">Update Social Links</h2>
          <div className="social-link-field">
            <label htmlFor="github">
              <img 
                src={isDarkMode ? githubIcon : githubIcon} 
                alt="Github" 
                className="social-icon" 
              />
            </label>
            <input 
              type="text" 
              id="github" 
              name="github" 
              value={socialLinks.github} 
              onChange={handleSocialChange} 
              placeholder="Github URL" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="linkedin">
              <img 
                src={isDarkMode ? linkedInDarkIcon : linkedInIcon} 
                alt="LinkedIn" 
                className="social-icon" 
              />
            </label>
            <input 
              type="text" 
              id="linkedin" 
              name="linkedin" 
              value={socialLinks.linkedin} 
              onChange={handleSocialChange} 
              placeholder="LinkedIn URL" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="discord">
              <img 
                src={isDarkMode ? discordDarkIcon : discordIcon} 
                alt="Discord" 
                className="social-icon" 
              />
            </label>
            <input 
              type="text" 
              id="discord" 
              name="discord" 
              value={socialLinks.discord} 
              onChange={handleSocialChange} 
              placeholder="Discord URL" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="instagram">
              <img 
                src={isDarkMode ? instagramDarkIcon : instagramIcon} 
                alt="Instagram" 
                className="social-icon" 
              />
            </label>
            <input 
              type="text" 
              id="instagram" 
              name="instagram" 
              value={socialLinks.instagram} 
              onChange={handleSocialChange} 
              placeholder="Instagram URL" 
            />
          </div>
          <button className="update-btn" onClick={handleSocialUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Social Links"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackerDashboard;
