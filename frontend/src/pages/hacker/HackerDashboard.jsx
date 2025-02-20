import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/HackerDashboard.css';

const HackerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Build the base URL using the environment variable. Default to 5000 if not set.
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5000;
  const baseURL = `http://localhost:${serverPort}`;

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/hacker/profile`, {
          withCredentials: true, // Ensure the auth cookie is sent
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [baseURL]);

  if (loading) {
    return <div className="dashboard-container"><p>Loading user data...</p></div>;
  }

  if (!user) {
    return <div className="dashboard-container"><p>Failed to load user data.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Hacker Dashboard</h2>
      <div className="cards-container">
        <div className="info-card">
          <h3>Personal Info</h3>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className="info-card">
          <h3>Education</h3>
          <p><strong>School:</strong> {user.school}</p>
          <p><strong>Major:</strong> {user.major}</p>
          <p><strong>Grade:</strong> {user.grade}</p>
        </div>
      </div>
    </div>
  );
};

export default HackerDashboard;