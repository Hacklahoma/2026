import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log(formData);
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
    </div>
  );
};

export default Login;