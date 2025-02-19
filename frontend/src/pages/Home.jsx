import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-left">
          <h1>Hacklahoma</h1>
          <h2>2026</h2>
          <button onClick={handleRegister}>Register Now</button>
        </div>
        <div className="home-right">
          {/* Optionally insert a hero image or illustration */}
        </div>
      </div>
    </div>
  );
};

export default Home;