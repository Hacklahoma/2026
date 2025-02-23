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
import { isValidUrl, cleanUrl } from '../../utils/validation';
import DiscordQRModal from '../../components/DiscordQRModal';

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
  const [showQRModal, setShowQRModal] = useState(false);

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
        setOriginalUrls({
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

  // Add this function to format Discord username to URL
  const formatDiscordUrl = (username) => {
    // Remove any URL parts if someone pastes a full URL
    const cleanUsername = username.replace(/https?:\/\/discord\.com\/users\//, '');
    return username ? `discord.com/users/${cleanUsername}` : '';
  };

  const handleSocialUpdate = async () => {
    setUpdating(true);
    try {
      // Only validate URLs that are non-empty and different from stored ones
      const invalidUrls = Object.entries(socialLinks)
        .filter(([platform, url]) => {
          // Skip if URL is empty or unchanged
          if (!url || url === user.socialLinks[platform]) {
            return false;
          }
          // Skip Discord validation since we're handling usernames
          if (platform === 'discord') {
            return false;
          }
          // Check if new URL is valid
          return !isValidUrl(url);
        })
        .map(([platform]) => platform);

      if (invalidUrls.length > 0) {
        alert(`Please enter valid URLs for: ${invalidUrls.join(', ')}`);
        setUpdating(false);
        return;
      }

      // Clean URLs before saving
      const cleanedLinks = {
        github: socialLinks.github ? cleanUrl(socialLinks.github, 'github') : '',
        linkedin: socialLinks.linkedin ? cleanUrl(socialLinks.linkedin, 'linkedin') : '',
        discord: socialLinks.discord ? formatDiscordUrl(socialLinks.discord) : '',
        instagram: socialLinks.instagram ? cleanUrl(socialLinks.instagram, 'instagram') : ''
      };

      const response = await axios.put(
        `${baseURL}/api/hacker/profile/socialLinks`,
        { socialLinks: cleanedLinks },
        { withCredentials: true }
      );
      
      setSocialLinks(cleanedLinks);
      setUser({ ...user, socialLinks: cleanedLinks });
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

  const handleIconClick = (platform, url) => {
    if (platform === 'discord' && url) {
      // Extract username from discord.com/users/USERNAME format
      const username = url.split('/').pop();
      if (username) {
        setShowQRModal(true);
        return;
      }
    }

    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank');
      return;
    }

    // Updated default URLs with Hacklahoma Discord
    const defaultUrls = {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      discord: 'https://discord.gg/E9AHGZTuP3',
      instagram: 'https://instagram.com'
    };
    
    console.log('Using default URL:', defaultUrls[platform]);
    
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const appUrls = {
        github: 'github://',
        linkedin: 'linkedin://',
        discord: 'discord://',
        instagram: 'instagram://'
      };
      
      window.location.href = appUrls[platform];
      setTimeout(() => {
        window.open(defaultUrls[platform], '_blank');
      }, 1000);
    } else {
      window.open(defaultUrls[platform], '_blank');
    }
  };

  const handleSocialBlur = (e, platform) => {
    const value = e.target.value;
    if (value && !isValidUrl(value)) {
      alert('Please enter a valid URL');
      // Revert to previous valid URL instead of clearing
      setSocialLinks(prev => ({
        ...prev,
        [platform]: user.socialLinks[platform] || ''
      }));
    }
  };

  // Add this handler function
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSocialUpdate();
    }
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
            <label htmlFor="github" onClick={() => handleIconClick('github', socialLinks.github)}>
              <img src={githubIcon} alt="Github" className="social-icon clickable" />
            </label>
            <input 
              type="text" 
              id="github" 
              name="github" 
              value={socialLinks.github} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="Github URL" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="linkedin" onClick={() => handleIconClick('linkedin', socialLinks.linkedin)}>
              <img src={isDarkMode ? linkedInDarkIcon : linkedInIcon} alt="LinkedIn" className="social-icon clickable" />
            </label>
            <input 
              type="text" 
              id="linkedin" 
              name="linkedin" 
              value={socialLinks.linkedin} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="LinkedIn URL" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="discord" onClick={() => handleIconClick('discord', socialLinks.discord)}>
              <img src={isDarkMode ? discordDarkIcon : discordIcon} alt="Discord" className="social-icon clickable" />
            </label>
            <input 
              type="text" 
              id="discord" 
              name="discord" 
              value={socialLinks.discord} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="Discord Username" 
            />
          </div>
          <div className="social-link-field">
            <label htmlFor="instagram" onClick={() => handleIconClick('instagram', socialLinks.instagram)}>
              <img src={isDarkMode ? instagramDarkIcon : instagramIcon} alt="Instagram" className="social-icon clickable" />
            </label>
            <input 
              type="text" 
              id="instagram" 
              name="instagram" 
              value={socialLinks.instagram} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="Instagram URL" 
            />
          </div>
          <button className="update-btn" onClick={handleSocialUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Social Links"}
          </button>
        </div>
      </div>

      {/* Add QR Modal */}
      {showQRModal && (
        <DiscordQRModal 
          username={socialLinks.discord.split('/').pop()} 
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default HackerDashboard;
