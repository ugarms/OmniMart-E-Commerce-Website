import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', formData.email);
      if (res.data.firstName) localStorage.setItem('firstName', res.data.firstName);
      navigate('/dashboard');
    } catch {
      const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
      if (users.find(u => u.email === formData.email)) {
        setError('An account with this email already exists.');
        return;
      }
      users.push(formData);
      localStorage.setItem('localUsers', JSON.stringify(users));
      localStorage.setItem('token', 'local-token-' + formData.email);
      localStorage.setItem('firstName', formData.firstname);
      localStorage.setItem('userEmail', formData.email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-left">
          <div className="auth-left-logo">Omni<span>Mart</span></div>
          <div className="auth-left-body">
            <h2>Join OmniMart Today!</h2>
            <p>Create your account and enjoy exclusive deals, fast delivery, and a seamless shopping experience.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=60" alt="" className="auth-left-img" />
        </div>
        <div className="auth-right">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Fill in the details to get started</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstname" placeholder="John" value={formData.firstname} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastname" placeholder="Doe" value={formData.lastname} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary auth-submit">Create My Account</button>
          </form>
          <div className="auth-divider">or</div>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
          <p className="auth-terms">
            By creating an account, you agree to OmniMart's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
