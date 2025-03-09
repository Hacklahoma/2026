import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../components/ThemeProvider';
import '../styles/Login.css';

const Login = () => {
  const { isDarkMode, ThemeToggle } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Read the server port from environment variables; default to 5174 if not set
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/verify`, {
          withCredentials: true,
        });
        
        if (response.data.authenticated) {
          // Redirect based on role
          if (response.data.role === 'staff') {
            navigate('/staff');
          } else {
            navigate('/hacker');
          }
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        console.log('User is not authenticated');
      }
    };

    checkAuth();
  }, [baseURL, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Redirect based on role
      if (response.data.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/hacker');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`screen-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      
      <div className="card-container">
        <div className="card">
          <h1 className="login-header">Login</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="themed-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="themed-input"
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button themed-button-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </div>
        
        <div className="create-account-card">
          <h2>New to the platform?</h2>
          <p>Create an account to apply for the hackathon and access exclusive resources.</p>
          <button className="create-account-btn themed-button-secondary">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;