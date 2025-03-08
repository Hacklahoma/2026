import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

axios.defaults.withCredentials = true;

const Home = () => {
  const navigate = useNavigate();
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const protocol = 'http';  // Always use http in development
  const baseURL = `${protocol}://${window.location.hostname}:${serverPort}`;

  const handleEnterPortal = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/auth/verify`, {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        // Navigate based on the user's role
        if (response.data.role === 'staff') {
          navigate('/staff');
        } else {
          navigate('/hacker');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error verifying authentication:', error);
      // On error, assume the user is not authenticated
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-left">
          <h1>Hacklahoma</h1>
          <h2>2026</h2>
          <button onClick={handleEnterPortal}>Enter HackPortal</button>
        </div>
        <div className="home-right">
          {/* Optionally insert a hero image or illustration */}
        </div>
      </div>
    </div>
  );
};

export default Home;