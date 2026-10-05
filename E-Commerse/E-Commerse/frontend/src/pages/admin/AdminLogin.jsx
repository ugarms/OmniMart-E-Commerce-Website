import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './Admin.css';

const ADMIN_EMAIL = 'admin@omnimart.com';
const ADMIN_PASSWORD = 'OmniMartAdmin!2026';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-icon"><ShieldCheck size={44} color="#2874f0" /></div>
        <h1>Admin Portal</h1>
        <p className="admin-login-sub">OmniMart Administration</p>
        {error && <div className="admin-error-msg">{error}</div>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label>Email</label>
            <input type="email" placeholder="admin@omnimart.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-login-btn">Sign In</button>
        </form>
        <p className="admin-hint">Credentials: admin@omnimart.com / OmniMartAdmin!2026</p>
      </div>
    </div>
  );
};

export default AdminLogin;
