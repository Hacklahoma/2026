import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/StaffProfile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    discord: '',
    instagram: ''
  });
  const [updating, setUpdating] = useState(false);

  // Read the server port from environment variables; default to 5000 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5000;
  const baseURL = `http://localhost:${serverPort}`;

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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [baseURL]);

  const handleSocialChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSocialUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${baseURL}/api/staff/profile/socialLinks`,
        { socialLinks },
        { withCredentials: true }
      );
      setProfile({ ...profile, socialLinks: response.data.socialLinks });
      alert("Social links updated successfully.");
    } catch (error) {
      console.error('Error updating social links:', error);
      alert("Error updating social links.");
    } finally {
      setUpdating(false);
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
    <div className="staff-profile-container">
      {/* Section 1: Welcome */}
      <div className="welcome-section">
        <h1>Welcome, {profile.firstName} {profile.lastName}</h1>
      </div>
      
      {/* Section 2: Todo */}
      <div className="todo-section">
        <h2>To Do</h2>
        <p>Your tasks for today will appear here.</p>
      </div>
      
      {/* Sections 3 & 4: Profile Picture and Social Links */}
      <div className="bottom-section">
        <div className="profile-picture">
          <h2>Profile Picture</h2>
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" />
          ) : (
            <div className="placeholder-image">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="social-links">
          <h2>Social Links</h2>
          <div className="social-link-field">
            <label htmlFor="github">Github:</label>
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
            <label htmlFor="linkedin">LinkedIn:</label>
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
            <label htmlFor="discord">Discord:</label>
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
            <label htmlFor="instagram">Instagram:</label>
            <input 
              type="text" 
              id="instagram" 
              name="instagram" 
              value={socialLinks.instagram} 
              onChange={handleSocialChange} 
              placeholder="Instagram URL" 
            />
          </div>
          <button onClick={handleSocialUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Social Links"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;