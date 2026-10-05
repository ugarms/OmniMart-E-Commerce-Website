import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Package, MapPin, Tag, Grid, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home', icon: <Home size={14} /> },
  { to: '/shop', label: 'Shop', icon: <ShoppingBag size={14} /> },
  { to: '/categories', label: 'All Categories', icon: <Grid size={14} /> },
  { to: '/shop?category=Men', label: "Men's" },
  { to: '/shop?category=Women', label: "Women's" },
  { to: '/shop?category=Electronics', label: 'Electronics' },
  { to: '/shop?category=Footwear', label: 'Footwear' },
  { to: '/shop?category=Sports', label: 'Sports' },
  { to: '/shop?category=Beauty', label: 'Beauty' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, fetchCartCount } = useCart();
  const firstName = localStorage.getItem('firstName');
  const token = localStorage.getItem('token');
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('userEmail');
    fetchCartCount();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  // Hide navbar completely on public pages
  const publicPaths = ['/', '/login', '/register', '/admin/login', '/admin'];
  if (publicPaths.includes(location.pathname) || location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="navbar">
      {/* ── Top Row ── */}
      <div className="nav-top">
        <Link to="/dashboard" className="nav-logo">
          <span className="nav-logo-text">OmniMart</span>
          <span className="nav-logo-sub">.in</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <select className="nav-search-select" defaultValue="all">
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="electronics">Electronics</option>
            <option value="footwear">Footwear</option>
          </select>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="nav-search-btn">
            <Search size={18} />
          </button>
        </form>

        <div className="nav-actions">
          <div className="nav-action-btn" style={{ cursor: 'default' }}>
            <span className="nav-action-label">Deliver to</span>
            <span className="nav-action-value"><MapPin size={13} /> India</span>
          </div>

          <div className="nav-divider" />

          {token && firstName ? (
            <>
              <div className="nav-action-btn" style={{ cursor: 'default' }}>
                <span className="nav-action-label">Hello,</span>
                <span className="nav-action-value">{firstName}</span>
              </div>
              <Link to="/orders" className="nav-action-btn">
                <span className="nav-action-label">Returns &</span>
                <span className="nav-action-value"><Package size={13} /> Orders</span>
              </Link>
              <button onClick={handleLogout} className="nav-action-btn">
                <span className="nav-action-label">Sign</span>
                <span className="nav-action-value"><LogOut size={13} /> Out</span>
              </button>
            </>
          ) : null}

          <div className="nav-divider" />

          <Link to="/shop" className="nav-action-btn">
            <span className="nav-action-label">Today's</span>
            <span className="nav-action-value nav-deals"><Tag size={13} /> Deals</span>
          </Link>

          <div className="nav-divider" />

          <Link to="/cart" className="nav-cart-btn">
            <div className="nav-cart-icon">
              <ShoppingCart size={26} color="#fff" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span className="nav-cart-label">Cart</span>
          </Link>
        </div>
      </div>

      {/* ── Bottom Category Row ── */}
      <div className="nav-bottom">
        <div className="nav-bottom-inner">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-bottom-link ${location.pathname === link.to ? 'active-link' : ''}`}
            >
              {link.icon && link.icon}
              {link.label}
            </Link>
          ))}
          <Link to="/shop?category=Beauty" className="nav-bottom-link nav-deals">
            🔥 Hot Deals
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
