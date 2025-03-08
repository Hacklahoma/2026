import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/hacker/profile`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setStatus('');
    
    console.log('File selected:', file.name, file.type, file.size);
    
    if (file.size > 5 * 1024 * 1024) {
      setStatus('File size too large. Maximum size is 5MB.');
      setIsUploading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          console.log('Sending image data to server...');
          const response = await axios.post(
            `${baseURL}/api/hacker/profile-picture`,
            { imageData: reader.result },
            { 
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' }
            }
          );
          console.log('Server response:', response.data);
          
          if (response.data.profilePicture) {
            setUser(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
            setStatus('Profile picture successfully changed!');
            setShowUploadOptions(false);
          }
        } catch (error) {
          console.error('Full upload error:', error.response || error);
          setStatus('Profile picture could not be updated, please try again!');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File reading error:', error);
      setStatus('Profile picture could not be processed, please try again!');
      setIsUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implementation for camera capture would go here
      // For now, just stop the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera error:', error);
      setStatus('Camera access denied or not available');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-card">
          <div className="settings-header">
            <h1>Settings</h1>
            <button 
              className="back-button"
              onClick={() => navigate('/hacker')}
            >
              Back
            </button>
          </div>
          <div className="settings-section">
            <div className="profile-picture-section">
              <div className="profile-picture-header">
                <h2>Profile Picture</h2>
                <button 
                  onClick={() => setShowUploadOptions(!showUploadOptions)}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : <img src="/src/assets/icons/edit_icon.png" alt="Edit" className="edit-icon" />}
                </button>
              </div>
              {showUploadOptions && (
                <div className="upload-options">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    Upload from Library
                  </button>
                  <button 
                    onClick={handleCameraCapture}
                    disabled={isUploading}
                  >
                    Take Photo
                  </button>
                </div>
              )}
              {status && (
                <p className={status.includes('success') ? 'success' : 'error'}>
                  {status}
                </p>
              )}
              <div className="profile-picture-display">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture}
                    alt="Profile" 
                  />
                ) : (
                  <div className="placeholder-image">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 