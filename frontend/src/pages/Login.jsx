import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // Build the base URL using the environment variable. Default to 5000 if not set.
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5000;
  const baseURL = `http://localhost:${serverPort}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(true);
    setModalMessage('Logging in, please wait...');
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      setModalMessage('Login successful! Redirecting...');
      setTimeout(() => {
        setModalOpen(false);
        // Redirect based on your app's logic; for now, we navigate to /hacker.
        navigate('/hacker');
      }, 1500);
    } catch (err) {
      console.error(err);
      setModalMessage(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h1 className="login-header">Login</h1>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <div className="redirect-inline">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="register-btn"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              Login
            </button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default Login;