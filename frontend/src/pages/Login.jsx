import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

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
    setModalMessage('Please wait, logging in...');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
        withCredentials: true  // Send credentials (cookies)
      });
      const { role } = response.data;

      setModalMessage('Login successful! Redirecting...');
      setTimeout(() => {
        setModalOpen(false);
        if (role === 'hacker') {
          navigate('/hacker');
        } else if (role === 'staff') {
          navigate('/staff');
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setModalMessage(err.response?.data?.message || 'Login failed. Please try again.');
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
        <form onSubmit={handleSubmit}>
          <div className="login-top">
            <h2 className="card-title">Login</h2>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn submit-btn">Login</button>
          </div>
          <div className="divider">OR</div>
          <div className="login-bottom">
            <button type="button" className="btn github">Login with Github</button>
            <button type="button" className="btn google">Login with Google</button>
          </div>
        </form>
      </div>
      <Modal isOpen={modalOpen} message={modalMessage} onClose={handleModalClose} />
    </div>
  );
};

export default Login;