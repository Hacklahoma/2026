import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    school: '',
    major: '',
    grade: '',
    agreeRules: false,
    agreeCode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can submit the form data to your API
    console.log(formData);
  };

  return (
    <div className="register-container">
      <div className="card">
        <form onSubmit={handleSubmit} className="card-form">
          <div className="card-half card-left">
            <h2 className="card-title">Register</h2>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

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

            <div className="divider">OR</div>

            <div className="social-buttons">
              <button type="button" className="btn github">Register with Github</button>
              <button type="button" className="btn google">Register with Google</button>
            </div>
          </div>
          <div className="card-half card-right">
            <h2 className="card-title">Additional Info</h2>
            <label>School</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />

            <label>Major</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />

            <label>Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
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

            <button type="submit" className="btn submit-btn">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;