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
import InstagramQRModal from '../../components/InstagramQRModal';

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
  const [showDiscordQR, setShowDiscordQR] = useState(false);
  const [showInstagramQR, setShowInstagramQR] = useState(false);

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

  // Function to extract just the username from URLs for display
  const extractUsername = (url, platform) => {
    if (!url) return '';
    
    switch(platform) {
      case 'github':
        return url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '');
      case 'linkedin':
        return url.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/)?/, '');
      case 'discord':
        return url.replace(/^(https?:\/\/)?(www\.)?discord\.com\/users\//, '');
      case 'instagram':
        return url.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '');
      default:
        return url;
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    
    // Convert username to full URL for storage
    let fullValue = value;
    
    // Only prepend URL if user is typing just a username
    if (value && !value.includes('/')) {
      switch(name) {
        case 'github':
          fullValue = `github.com/${value}`;
          break;
        case 'linkedin':
          fullValue = `linkedin.com/in/${value}`;
          break;
        case 'discord':
          // For discord, we'll just store the username and format it later
          fullValue = value;
          break;
        case 'instagram':
          fullValue = `instagram.com/${value}`;
          break;
        default:
          fullValue = value;
      }
    }
    
    setSocialLinks({ ...socialLinks, [name]: fullValue });
  };

  // Add this function to format Discord username to URL
  const formatDiscordUrl = (username) => {
    // First, clean any existing URLs by extracting just the username
    let cleanUsername = username;
    
    // Remove any URL parts if someone pastes a full URL
    if (username.includes('discord.com/users/')) {
      // Extract just the username at the end
      const parts = username.split('discord.com/users/');
      cleanUsername = parts[parts.length - 1];
    }
    
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
      alert("Socials updated successfully.");
    } catch (error) {
      console.error('Error updating socials:', error);
      alert("Error updating socials.");
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
    if (platform === 'discord') {
      if (url) {
        const username = url.split('/').pop();
        if (username) {
          setShowDiscordQR(true);
          return;
        }
      } else {
        // If no Discord URL is set, open the Hacklahoma Discord
        window.open('https://discord.gg/E9AHGZTuP3', '_blank');
      }
      return;
    }

    if (platform === 'instagram') {
      if (url) {
        const username = url.split('/').pop();
        if (username) {
          setShowInstagramQR(true);
          return;
        }
      }
      return;
    }

    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank');
      return;
    }

    // Default URLs only for github and linkedin
    const defaultUrls = {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    };
    
    if (defaultUrls[platform]) {
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
          <div className="profile-section">
            <div className="profile-picture-container">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
              ) : (
                <div className="placeholder-image">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="qr-code-container">
              <QRCodeCanvas value={qrData} size={150} />
            </div>
          </div>
          <p className="user-name">{user.firstName} {user.lastName }</p>
        </div>

        {/* Right Panel: Social Links Form */}
        <div className="right-panel">
          <h2 className="form-title">Update Socials</h2>
          <div className="social-link-field">
            <label htmlFor="github" onClick={() => handleIconClick('github', socialLinks.github)}>
              <img src={githubIcon} alt="Github" className="social-icon clickable" />
            </label>
            <input 
              type="text" 
              id="github" 
              name="github" 
              value={extractUsername(socialLinks.github, 'github')} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="Github Username" 
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
              value={extractUsername(socialLinks.linkedin, 'linkedin')} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="LinkedIn Username" 
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
              value={extractUsername(socialLinks.discord, 'discord')} 
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
              value={extractUsername(socialLinks.instagram, 'instagram')} 
              onChange={handleSocialChange}
              onKeyDown={handleKeyDown}
              placeholder="Instagram Username" 
            />
          </div>
          <button className="update-btn" onClick={handleSocialUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Socials"}
          </button>
        </div>
      </div>

      {/* Discord QR Modal */}
      {showDiscordQR && (
        <DiscordQRModal 
          username={socialLinks.discord.split('/').pop()} 
          onClose={() => setShowDiscordQR(false)}
        />
      )}

      {/* Instagram QR Modal */}
      {showInstagramQR && (
        <InstagramQRModal 
          username={socialLinks.instagram.split('/').pop()} 
          onClose={() => setShowInstagramQR(false)}
        />
      )}
    </div>
  );
};

export default HackerDashboard;
