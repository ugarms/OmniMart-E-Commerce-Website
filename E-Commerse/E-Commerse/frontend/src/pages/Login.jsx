import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Redirect admin to admin portal
    if (email === 'admin@omnimart.com') {
      navigate('/admin/login');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/v1/auth/authenticate', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      if (res.data.firstName) localStorage.setItem('firstName', res.data.firstName);
      navigate(from, { replace: true });
    } catch {
      const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('token', 'local-token-' + user.email);
        localStorage.setItem('firstName', user.firstname);
        localStorage.setItem('userEmail', user.email);
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-left">
          <div className="auth-left-logo">Omni<span>Mart</span></div>
          <div className="auth-left-body">
            <h2>Welcome Back!</h2>
            <p>Log in to access your orders, wishlist, and exclusive deals tailored just for you.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=60" alt="" className="auth-left-img" />
        </div>
        <div className="auth-right">
          <h2>Log In</h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary auth-submit">Log In to OmniMart</button>
          </form>
          <div className="auth-divider">or</div>
          <div className="auth-footer">
            New to OmniMart? <Link to="/register">Create an account</Link>
          </div>
          <p className="auth-terms">
            By continuing, you agree to OmniMart's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a href="/admin/login" style={{ fontSize: '0.78rem', color: '#878787', textDecoration: 'none' }}>
              🔐 Admin Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
