import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    major: '',
    grade: '',
    email: '',
    password: '',
    agreeRules: false,
    agreeCode: false,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // Build base URL using environment variable; default to 5000 if not set.
  const serverPort = import.meta.env.VITE_SERVER_PORT || 5000;
  const baseURL = `http://localhost:${serverPort}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(true);
    setModalMessage('Registering user, please wait...');
    
    try {
      await axios.post(`${baseURL}/api/auth/register`, formData);
      setModalMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setModalOpen(false);
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setModalMessage(err.response?.data?.message || 'Registration failed. Please try again.');
      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h1 className="register-header">Create Your Account</h1>
        <div className="login-redirect-header">
          <span>Already have an account? </span>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </div>
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-half student-info">
            <h2>Student Info</h2>
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  id="firstName" 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName" 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <label htmlFor="school">School</label>
            <input 
              id="school" 
              type="text" 
              name="school" 
              value={formData.school} 
              onChange={handleChange} 
              required 
            />
            <label htmlFor="major">Major</label>
            <input 
              id="major" 
              type="text" 
              name="major" 
              value={formData.major} 
              onChange={handleChange} 
              required 
            />
            <label htmlFor="grade">Grade</label>
            <input 
              id="grade" 
              type="text" 
              name="grade" 
              value={formData.grade} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-half required-info">
            <h2>Required Info</h2>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="agreeRules" 
                  checked={formData.agreeRules} 
                  onChange={handleChange} 
                  required 
                />
                I agree to the rules
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  name="agreeCode" 
                  checked={formData.agreeCode} 
                  onChange={handleChange} 
                  required 
                />
                I agree to the code of conduct
              </label>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              Register
            </button>
          </div>
        </form>
      </div>
      <Modal isOpen={modalOpen} message={modalMessage} onClose={handleModalClose} />
    </div>
  );
};

export default Register;