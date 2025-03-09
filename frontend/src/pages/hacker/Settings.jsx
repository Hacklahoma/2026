import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Settings.css';
import ImageCropper from '../../components/ImageCropper';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State for image cropping
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  
  // State for original and cropped photos
  const [originalPhoto, setOriginalPhoto] = useState(null);
  
  // State for editing name and email
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Read the server port from environment variables; default to 5174 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  // Apply dark mode based on user's in-app settings
  useEffect(() => {
    // Get the theme from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    const isDark = savedTheme === 'true';
    setIsDarkMode(isDark);
    
    // Apply dark mode class to body if needed
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Clean up when component unmounts
    return () => {
      // Don't remove the class on unmount as it might be needed by other components
      // Only add/remove based on changes within this component
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First verify the user's authentication and role
        const authResponse = await axios.get(`${baseURL}/api/auth/verify`, {
          withCredentials: true,
        });
        
        if (authResponse.data.authenticated) {
          setUserRole(authResponse.data.role);
          
          // Fetch the appropriate profile based on role
          const profileEndpoint = authResponse.data.role === 'staff' 
            ? `${baseURL}/api/staff/profile` 
            : `${baseURL}/api/hacker/profile`;
            
          const profileResponse = await axios.get(profileEndpoint, {
            withCredentials: true,
          });
          
          setUser(profileResponse.data);
          
          // Initialize form fields with user data
          setFirstName(profileResponse.data.firstName || '');
          setLastName(profileResponse.data.lastName || '');
          setEmail(profileResponse.data.email || '');
          
          // If the user has a profile picture, try to fetch it as the original photo
          if (profileResponse.data.profilePicture) {
            try {
              const imageResponse = await fetch(profileResponse.data.profilePicture);
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                const filename = profileResponse.data.profilePicture.split('/').pop().split('?')[0] || 'profile-picture.jpg';
                const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
                setOriginalPhoto(file);
              }
            } catch (error) {
              console.error('Error fetching original profile picture:', error);
              // Don't set error status as this is just for initialization
            }
          }
        } else {
          // Not authenticated, redirect to login
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

  // Add this function to compress images before uploading
  const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          console.log('Original image dimensions:', { width, height });
          console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2) + ' MB');
          
          // Resize if either dimension is larger than max
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            
            if (width > height) {
              // Landscape image
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              // Portrait or square image
              height = maxHeight;
              width = height * aspectRatio;
            }
          }
          
          // Create a canvas to draw the resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Use better image smoothing for downscaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          const mimeType = file.type || 'image/jpeg';
          
          // Use lower quality for larger files
          let imageQuality = quality;
          if (file.size > 2 * 1024 * 1024) { // If original is > 2MB
            imageQuality = 0.6; // Use even lower quality
          }
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            console.log('Compressed image size:', (blob.size / 1024 / 1024).toFixed(2) + ' MB');
            
            // Create a new file from the blob
            const newFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now()
            });
            
            resolve(newFile);
          }, mimeType, imageQuality);
        };
        
        img.onerror = (error) => {
          reject(error);
          console.error('Error loading image for compression:', error);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
        console.error('Error reading file:', error);
      };
    });
  };

  // Add a function to store the original photo in localStorage
  const storeOriginalPhoto = (file) => {
    try {
      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the data URL in localStorage
        localStorage.setItem('originalPhoto', e.target.result);
        console.log("Original photo stored in localStorage");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error storing original photo in localStorage:', error);
    }
  };

  // Load the original photo from localStorage on component mount
  useEffect(() => {
    try {
      const storedPhoto = localStorage.getItem('originalPhoto');
      if (storedPhoto) {
        console.log("Found stored original photo in localStorage");
        // Create a blob from the data URL
        fetch(storedPhoto)
          .then(res => res.blob())
          .then(blob => {
            // Create a file from the blob
            const file = new File([blob], 'original-photo.jpg', { 
              type: blob.type || 'image/jpeg' 
            });
            // Set the original photo
            setOriginalPhoto(file);
            console.log("Restored original photo from localStorage");
          })
          .catch(err => {
            console.error("Error restoring original photo from localStorage:", err);
          });
      }
    } catch (error) {
      console.error('Error loading original photo from localStorage:', error);
    }
  }, []);

  // Update the handleFileUpload function to store the original photo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset the file input to ensure clean state for future selections
    fileInputRef.current.value = '';
    
    try {
      setStatus('Processing image...');
      
      // Store the original photo
      setOriginalPhoto(file);
      
      // Also store in localStorage for persistence
      storeOriginalPhoto(file);
      
      // Compress the image before cropping
      const compressedFile = await compressImage(file);
      
      // Show the cropper with the compressed image
      setSelectedImage(compressedFile);
      setShowCropper(true);
      setStatus('');
      
    } catch (error) {
      console.error('Error processing image:', error);
      setStatus('Error processing image. Please try again with a different image.');
      
      // Even if compression fails, try to show the original file in the cropper
      if (file) {
        setSelectedImage(file);
        setShowCropper(true);
      }
    }
  };

  // Add a function to handle crop completion
  const handleCropComplete = (croppedDataUrl, croppedFile) => {
    console.log("Crop completed, uploading profile picture...");
    
    // Directly upload the cropped image
    uploadImageFile(croppedFile);
    
    // Close the cropper
    setShowCropper(false);
    setSelectedImage(null);
  };

  // Add a function to handle crop cancellation
  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    setStatus('');
  };

  // Helper function to upload an image file
  const uploadImageFile = async (file) => {
    try {
      // Convert the file to base64
      const reader = new FileReader();
      
      // Set up the onload handler before calling readAsDataURL
      reader.onload = async (event) => {
        try {
          const base64data = event.target.result;
          console.log('Sending image size:', (base64data.length / 1024 / 1024).toFixed(2) + ' MB');
          
          // If the base64 string is still too large, show an error
          if (base64data.length > 1024 * 1024 * 2) { // 2MB limit
            setStatus('Image is still too large after cropping. Please use a smaller image.');
            setIsUploading(false);
            return;
          }
          
          const response = await axios.post(
            `${baseURL}/api/hacker/profile-picture`,
            { imageData: base64data },
            { 
              withCredentials: true,
              timeout: 30000 // 30 second timeout
            }
          );
          
          // Update the user state with the new profile picture
          setUser(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
          setStatus('Profile picture updated successfully!');
          
          // Clear the cropped image to hide the upload button
          setCroppedImage(null);
          
          // Close the upload options after successful upload
          setShowUploadOptions(false);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          
          if (error.response && error.response.status === 413) {
            setStatus('Image is too large for the server to process. Please use a smaller image.');
          } else if (error.response) {
            setStatus(`Server error: ${error.response.status}. Please try again later.`);
          } else if (error.code === 'ECONNABORTED') {
            setStatus('Upload timed out. Please try a smaller image or check your connection.');
          } else {
            setStatus(`Error uploading image: ${error.message}. Please try again.`);
          }
        } finally {
          setIsUploading(false);
        }
      };
      
      // Set up error handler
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setStatus('Error processing image. Please try again with a different image.');
        setIsUploading(false);
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      throw error; // Re-throw to be caught by the outer try/catch
    }
  };

  // Add a function to handle existing profile picture cropping
  const handleCropExisting = async () => {
    console.log("Crop Photo button clicked");
    try {
      setStatus('Preparing image for cropping...');
      
      // Always use the stored original photo if available
      if (originalPhoto) {
        console.log("Using stored original photo");
        setSelectedImage(originalPhoto);
        setShowCropper(true);
        setStatus('');
        return;
      }
      
      // Try to load from localStorage if no originalPhoto in state
      try {
        const storedPhoto = localStorage.getItem('originalPhoto');
        if (storedPhoto) {
          console.log("Found stored original photo in localStorage");
          // Create a blob from the data URL
          const response = await fetch(storedPhoto);
          const blob = await response.blob();
          
          // Create a file from the blob
          const file = new File([blob], 'original-photo.jpg', { 
            type: blob.type || 'image/jpeg' 
          });
          
          // Set the original photo
          setOriginalPhoto(file);
          setSelectedImage(file);
          setShowCropper(true);
          setStatus('');
          console.log("Restored original photo from localStorage");
          return;
        }
      } catch (error) {
        console.error('Error loading original photo from localStorage:', error);
        // Continue to next method if this fails
      }
      
      // If no original photo is stored, try to fetch it from the profile picture URL
      if (!user?.profilePicture) {
        setStatus('No profile picture found to crop. Please upload an image first.');
        return;
      }
      
      // Check if the profile picture is a data URL (base64)
      if (user.profilePicture.startsWith('data:')) {
        try {
          const response = await fetch(user.profilePicture);
          const blob = await response.blob();
          
          // Create a file from the blob
          const file = new File([blob], 'profile-picture.jpg', { 
            type: blob.type || 'image/jpeg' 
          });
          
          // Store as original photo
          setOriginalPhoto(file);
          
          // Also store in localStorage for persistence
          storeOriginalPhoto(file);
          
          // Show the cropper with the file
          setSelectedImage(file);
          setShowCropper(true);
          setStatus('');
        } catch (error) {
          console.error('Error processing data URL:', error);
          setStatus('Error processing the image. Please try uploading a new image.');
        }
        return;
      }
      
      // For regular URLs, ensure proper formatting
      let imageUrl;
      if (user.profilePicture.startsWith('http')) {
        // Absolute URL
        imageUrl = user.profilePicture;
      } else if (user.profilePicture.startsWith('/')) {
        // Relative URL starting with /
        imageUrl = `${baseURL}${user.profilePicture}`;
      } else {
        // Relative URL without /
        imageUrl = `${baseURL}/${user.profilePicture}`;
      }
      
      // Add cache-busting parameter to avoid caching issues
      const cacheBustUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cacheBust=${Date.now()}`;
      
      try {
        // Fetch the profile picture with proper CORS headers
        const response = await fetch(cacheBustUrl, {
          method: 'GET',
          credentials: 'include', // Include cookies for authenticated requests
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Create a file from the blob
        const filename = imageUrl.split('/').pop().split('?')[0] || 'profile-picture.jpg';
        const mimeType = blob.type || 'image/jpeg';
        const file = new File([blob], filename, { type: mimeType });
        
        // Store as original photo
        setOriginalPhoto(file);
        
        // Also store in localStorage for persistence
        storeOriginalPhoto(file);
        
        // Show the cropper with the file
        setSelectedImage(file);
        setShowCropper(true);
        setStatus('');
      } catch (error) {
        console.error('Error fetching image for cropping:', error);
        setStatus('Error fetching the image. Please try uploading a new image.');
      }
    } catch (error) {
      console.error('Error in handleCropExisting:', error);
      setStatus('An error occurred. Please try uploading a new image.');
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

  const handleEditName = () => {
    // Set the current values
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setNameError('');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    // Validate inputs
    if (!firstName.trim()) {
      setNameError('First name is required');
      return;
    }
    
    if (!lastName.trim()) {
      setNameError('Last name is required');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Determine the endpoint based on user role
      const endpoint = userRole === 'staff' 
        ? `${baseURL}/api/staff/update-name` 
        : `${baseURL}/api/hacker/update-name`;
      
      const response = await axios.post(
        endpoint,
        { firstName, lastName },
        { withCredentials: true }
      );
      
      // Update the user state with the new name
      setUser(prev => ({ ...prev, firstName, lastName }));
      
      // Exit edit mode
      setEditingName(false);
      setNameError('');
      
      // Show success message
      setStatus('Name updated successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating name:', error);
      setNameError(error.response?.data?.message || 'Failed to update name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEmail = () => {
    // Set the current value
    setEmail(user?.email || '');
    setEmailError('');
    setEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Determine the endpoint based on user role
      const endpoint = userRole === 'staff' 
        ? `${baseURL}/api/staff/update-email` 
        : `${baseURL}/api/hacker/update-email`;
      
      const response = await axios.post(
        endpoint,
        { email },
        { withCredentials: true }
      );
      
      // Update the user state with the new email
      setUser(prev => ({ ...prev, email }));
      
      // Exit edit mode
      setEditingEmail(false);
      setEmailError('');
      
      // Show success message
      setStatus('Email updated successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating email:', error);
      
      // Check for duplicate email error
      if (error.response?.status === 409 || 
          error.response?.data?.message?.includes('already exists') ||
          error.response?.data?.message?.includes('duplicate')) {
        setEmailError('This email is already in use. Please use a different email.');
      } else {
        setEmailError(error.response?.data?.message || 'Failed to update email. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (type) => {
    if (type === 'name') {
      setEditingName(false);
      setNameError('');
    } else if (type === 'email') {
      setEditingEmail(false);
      setEmailError('');
    }
  };

  const handleBackClick = () => {
    // Navigate based on user role
    if (userRole === 'staff') {
      navigate('/staff');
    } else {
      navigate('/hacker');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-card">
          <div className="settings-header">
            <h1>Settings</h1>
            <button className="back-button" onClick={handleBackClick}>
              &larr; Back
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
                    onChange={(e) => handleFileUpload(e)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    Upload from Library
                  </button>
                  {(user?.profilePicture || originalPhoto) && (
                    <button 
                      onClick={handleCropExisting}
                      disabled={isUploading}
                    >
                      Crop Photo
                    </button>
                  )}
                </div>
              )}
              {status && (
                <p className={status.includes('success') || status.includes('cropped successfully') ? 'success' : 'error'}>
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

            <div className="account-name-section">
              <div className="account-name-header">
                <h2>Account Name</h2>
                {!editingName ? (
                  <button onClick={handleEditName}>
                    <img src="/src/assets/icons/edit_icon.png" alt="Edit" className="edit-icon" />
                  </button>
                ) : null}
              </div>
              
              {editingName ? (
                <div className="edit-form">
                  {nameError && <p className="error">{nameError}</p>}
                  <div className="input-row">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="edit-input"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="edit-input"
                    />
                  </div>
                  <div className="edit-buttons">
                    <button 
                      onClick={handleSaveName}
                      className="save-button"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancelEdit('name')}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>{user?.firstName} {user?.lastName}</p>
              )}
            </div>

            <div className="account-email-section">
              <div className="account-email-header">
                <h2>Email</h2>
                {!editingEmail ? (
                  <button onClick={handleEditEmail}>
                    <img src="/src/assets/icons/edit_icon.png" alt="Edit" className="edit-icon" />
                  </button>
                ) : null}
              </div>
              
              {editingEmail ? (
                <div className="edit-form edit-form-email">
                  {emailError && <p className="error">{emailError}</p>}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="edit-input"
                  />
                  <div className="edit-buttons">
                    <button 
                      onClick={handleSaveEmail}
                      className="save-button"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleCancelEdit('email')}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>{user?.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Cropper Modal - Use a stable key to prevent remounting */}
      {showCropper && selectedImage && (
        <div id="image-cropper-container" key="image-cropper">
          <ImageCropper 
            initialImage={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Settings;