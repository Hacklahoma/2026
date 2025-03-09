import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
import '../../styles/StaffProfile.css';
import { isValidUrl, cleanUrl } from '../../utils/validation';
import DiscordQRModal from '../../components/DiscordQRModal';
import InstagramQRModal from '../../components/InstagramQRModal';
import ImageCropper from '../../components/ImageCropper';
import { useTheme } from '../../components/ThemeProvider';

const Profile = () => {
  const { isDarkMode, ThemeToggle } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    discord: '',
    instagram: ''
  });
  const [updating, setUpdating] = useState(false);
  const [showDiscordQR, setShowDiscordQR] = useState(false);
  const [showInstagramQR, setShowInstagramQR] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Read the server port from environment variables; default to 5174 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  // Add a file input and upload functionality for profile pictures
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/staff/profile`, {
          withCredentials: true,
        });
        setProfile(response.data);
        setSocialLinks({
          github: response.data.socialLinks?.github || '',
          linkedin: response.data.socialLinks?.linkedin || '',
          discord: response.data.socialLinks?.discord || '',
          instagram: response.data.socialLinks?.instagram || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If we get a 401 or 403 error, redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [baseURL, navigate]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

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

  const handleIconClick = (platform, url) => {
    if (platform === 'discord' && url) {
      const username = url.split('/').pop();
      if (username) {
        setShowDiscordQR(true);
        return;
      }
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

    const defaultUrls = {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      discord: 'https://discord.gg/E9AHGZTuP3',
      instagram: 'https://www.instagram.com/hacklahoma/'
    };
    
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
      setSocialLinks(prev => ({
        ...prev,
        [platform]: profile.socialLinks[platform] || ''
      }));
    }
  };

  const handleSocialUpdate = async () => {
    setUpdating(true);
    try {
      const invalidUrls = Object.entries(socialLinks)
        .filter(([platform, url]) => {
          if (!url || url === profile.socialLinks[platform]) {
            return false;
          }
          if (platform === 'discord') {
            return false;
          }
          return !isValidUrl(url);
        })
        .map(([platform]) => platform);

      if (invalidUrls.length > 0) {
        alert(`Please enter valid URLs for: ${invalidUrls.join(', ')}`);
        setUpdating(false);
        return;
      }

      const cleanedLinks = {
        github: socialLinks.github ? cleanUrl(socialLinks.github, 'github') : '',
        linkedin: socialLinks.linkedin ? cleanUrl(socialLinks.linkedin, 'linkedin') : '',
        discord: socialLinks.discord ? formatDiscordUrl(socialLinks.discord) : '',
        instagram: socialLinks.instagram ? cleanUrl(socialLinks.instagram, 'instagram') : ''
      };

      const response = await axios.put(
        `${baseURL}/api/staff/profile/socialLinks`,
        { socialLinks: cleanedLinks },
        { withCredentials: true }
      );
      
      setSocialLinks(cleanedLinks);
      setProfile({ ...profile, socialLinks: cleanedLinks });
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

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  // Add a function to store the original image in localStorage
  const storeOriginalImage = (file) => {
    try {
      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the data URL in localStorage
        localStorage.setItem('staffOriginalImage', e.target.result);
        console.log("Original image stored in localStorage");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error storing original image in localStorage:', error);
    }
  };

  // Load the original image from localStorage on component mount
  useEffect(() => {
    try {
      const storedImage = localStorage.getItem('staffOriginalImage');
      if (storedImage) {
        console.log("Found stored original image in localStorage");
        // Create a blob from the data URL
        fetch(storedImage)
          .then(res => res.blob())
          .then(blob => {
            // Create a file from the blob
            const file = new File([blob], 'original-image.jpg', { 
              type: blob.type || 'image/jpeg' 
            });
            // Set the original image
            setOriginalImage(file);
            console.log("Restored original image from localStorage");
          })
          .catch(err => {
            console.error("Error restoring original image from localStorage:", err);
          });
      }
    } catch (error) {
      console.error('Error loading original image from localStorage:', error);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset the file input to ensure clean state for future selections
    fileInputRef.current.value = '';

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    // Get the file extension and MIME type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    console.log('File info:', {
      name: file.name,
      type: file.type,
      extension: fileExtension,
      size: file.size
    });
    
    // Check if either the extension or MIME type is valid
    const isValidExtension = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isValidMimeType = validTypes.includes(mimeType);
    
    if (!isValidExtension && !isValidMimeType) {
      setUploadStatus(`Unsupported file format. Please select a JPEG, PNG, or GIF image. (Type: ${mimeType}, Extension: ${fileExtension})`);
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('File size should be less than 10MB');
      return;
    }

    // Store the original file for future re-cropping - this is P1 or P2 in the flow
    setOriginalImage(file);
    console.log("Original image set:", file);
    
    // Also store in localStorage for persistence
    storeOriginalImage(file);
    
    // Show the cropper
    setSelectedFile(file);
    setShowCropper(true);
    setUploadStatus('');
  };

  const handleCropComplete = (croppedDataUrl, croppedFile) => {
    console.log("Crop completed, uploading profile picture...");
    
    // Directly upload the cropped image
    handleProfilePictureUpload(croppedFile);
    
    // Close the cropper
    setShowCropper(false);
    setSelectedFile(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
    setUploadStatus('');
  };

  // Update the upload function to accept a file parameter
  const handleProfilePictureUpload = async (file) => {
    if (!file) {
      setUploadStatus('No image to upload.');
      return;
    }

    setUploadStatus('Uploading...');
    
    // Log the file size being uploaded
    console.log('Uploading file size:', (file.size / 1024 / 1024).toFixed(2) + ' MB');
    
    // Check if the file is still too large after cropping
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('Image is still too large. Please try a smaller image or contact support.');
      return;
    }
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    // Don't upload the original image if it's too large
    if (originalImage && typeof originalImage !== 'string' && originalImage.size < 10 * 1024 * 1024) {
      formData.append('originalImage', originalImage);
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/staff/profile/picture`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // Add timeout and onUploadProgress for better user experience
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStatus(`Uploading: ${percentCompleted}%`);
          }
        }
      );

      setProfile({ ...profile, profilePicture: response.data.profilePicture });
      setUploadStatus('Profile picture updated successfully');
      
      // Clear the profilePicture state
      setProfilePicture(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      console.log('Full upload error:', error);
      
      // Provide more specific error messages based on the error
      if (error.response) {
        if (error.response.status === 413) {
          setUploadStatus('Image is too large for the server to process. Please try a smaller image.');
        } else {
          setUploadStatus(`Server error: ${error.response.status}. Please try again later.`);
        }
      } else if (error.request) {
        setUploadStatus('No response from server. Please check your connection and try again.');
      } else {
        setUploadStatus('Error preparing upload. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="staff-profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="staff-profile-container">
        <p>Error loading profile.</p>
      </div>
    );
  }

  return (
    <div className={`staff-profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Section 1: Welcome with Menu Button */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome, {profile.firstName} {profile.lastName}</h1>
        </div>
        <div className="menu-container" ref={menuRef}>
          <button className="menu-button" onClick={toggleMenu}>
            <img src={hamburgerIcon} alt="Menu" className="menu-icon" />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <ul>
                <li className="menu-button-item" onClick={() => navigate('/settings')}>
                  Settings
                </li>
                <li className="theme-toggle-container">
                  <div 
                    className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThemeToggle();
                    }}
                    role="switch"
                    aria-checked={isDarkMode}
                  >
                    <img src={sunIcon} alt="Light mode" className="theme-icon sun" />
                    <img src={moonIcon} alt="Dark mode" className="theme-icon moon" />
                    <div className="toggle-thumb" />
                  </div>
                </li>
                <li className="menu-button-item logout-button" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Section 2: Todo */}
      <div className="todo-section">
        <h2>To Do</h2>
        <p>Your tasks for today will appear here.</p>
      </div>
      
      {/* Sections 3 & 4: Profile Picture and Socials */}
      <div className="bottom-section staff-bottom-section">
        <div className="profile-picture staff-profile-picture">
          <h2>Profile Picture</h2>
          <div className="profile-picture-content staff-profile-content">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                onClick={handleProfilePictureClick}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div 
                className="placeholder-image staff-placeholder-image"
                onClick={handleProfilePictureClick}
                style={{ cursor: 'pointer' }}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileChange}
            />
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
          </div>
        </div>
        <div className="social-links staff-social-links">
          <h2>Socials</h2>
          <div className="social-inputs">
            <div className="social-link-field">
              <label htmlFor="github" onClick={() => handleIconClick('github', socialLinks.github)}>
                <img src={githubIcon} alt="Github" className="social-icon github-icon clickable" />
              </label>
              <input 
                type="text" 
                id="github" 
                name="github" 
                value={extractUsername(socialLinks.github, 'github')} 
                onChange={handleSocialChange} 
                onBlur={(e) => handleSocialBlur(e, 'github')}
                placeholder="GitHub Username" 
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
                onBlur={(e) => handleSocialBlur(e, 'linkedin')}
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
                onBlur={(e) => handleSocialBlur(e, 'instagram')}
                placeholder="Instagram Username" 
              />
            </div>
            <button onClick={handleSocialUpdate} disabled={updating}>
              {updating ? "Updating..." : "Update Socials"}
            </button>
          </div>
        </div>
      </div>
      {showDiscordQR && (
        <DiscordQRModal
          username={socialLinks.discord.split('/').pop()}
          onClose={() => setShowDiscordQR(false)}
        />
      )}
      {showInstagramQR && (
        <InstagramQRModal 
          username={socialLinks.instagram.split('/').pop()} 
          onClose={() => setShowInstagramQR(false)}
        />
      )}
      
      {/* Image Cropper Modal */}
      {console.log("Staff Profile - showCropper:", showCropper, "selectedFile:", selectedFile)}
      {showCropper && selectedFile && (
        <div id="image-cropper-container" key={selectedFile.name + Date.now()}>
          <ImageCropper 
            initialImage={selectedFile}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;