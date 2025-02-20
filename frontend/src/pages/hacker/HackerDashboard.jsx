import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/HackerDashboard.css'; // Ensure this path matches your project structure

const HackerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hacker/profile', {
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
  }, []);

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