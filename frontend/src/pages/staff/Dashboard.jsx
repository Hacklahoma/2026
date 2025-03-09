import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';
import '../../styles/StaffDashboard.css';

const Dashboard = () => {
  const { isDarkMode, ThemeToggle } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const navigateToProfile = () => {
    navigate('/staff/profile');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button className="profile-button" onClick={navigateToProfile}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="profile-pic" />
            ) : (
              <div className="profile-initials">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
          </button>
          <button className="logout-button themed-button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section themed-card">
          <h2>Welcome, {user?.firstName}!</h2>
          <p>This is your staff dashboard where you can manage applications and settings.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card themed-card">
            <h3>Applications</h3>
            <p>Review and manage hacker applications</p>
            <button className="card-button themed-button-primary">View Applications</button>
          </div>
          
          <div className="dashboard-card themed-card">
            <h3>Profile</h3>
            <p>Update your profile information</p>
            <button className="card-button themed-button-primary" onClick={navigateToProfile}>Edit Profile</button>
          </div>
          
          <div className="dashboard-card themed-card">
            <h3>Settings</h3>
            <p>Manage your account settings</p>
            <button className="card-button themed-button-primary">Go to Settings</button>
          </div>
          
          <div className="dashboard-card themed-card">
            <h3>Analytics</h3>
            <p>View application statistics</p>
            <button className="card-button themed-button-primary">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 