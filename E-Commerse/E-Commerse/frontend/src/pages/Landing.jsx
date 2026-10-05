import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, ChevronRight } from 'lucide-react';
import './Landing.css';

const FEATURES = [
  { icon: <Truck size={28} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: <ShieldCheck size={28} />, title: 'Secure Payments', desc: '100% safe & encrypted' },
  { icon: <RefreshCw size={28} />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: <Star size={28} />, title: 'Top Brands', desc: '1000+ premium brands' },
];

const CATEGORIES = [
  { name: "Men's Fashion", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
  { name: "Women's Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" },
  { name: "Footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { name: "Sports", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80" },
  { name: "Beauty", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80" },
];

const Landing = () => {
  return (
    <div className="landing-page">

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" alt="" />
          <div className="landing-hero-overlay" />
        </div>
        <div className="landing-hero-content">
          <div className="landing-badge">🔥 Big Billion Days Sale — Up to 80% Off</div>
          <h1>
            India's Favourite<br />
            <span>Online Shopping</span><br />
            Destination
          </h1>
          <p>Millions of products. Unbeatable prices. Delivered to your door.</p>
          <div className="landing-hero-btns">
            <Link to="/register" className="landing-btn-primary">
              <ShoppingBag size={18} /> Start Shopping Free
            </Link>
            <Link to="/login" className="landing-btn-secondary">
              Already a member? Log In <ChevronRight size={16} />
            </Link>
          </div>
          <div className="landing-stats">
            <div><strong>50M+</strong><span>Happy Customers</span></div>
            <div className="stat-divider" />
            <div><strong>1000+</strong><span>Top Brands</span></div>
            <div className="stat-divider" />
            <div><strong>5M+</strong><span>Products</span></div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div>
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Categories Preview ── */}
      <section className="landing-categories">
        <div className="landing-section-header">
          <h2>Shop by Category</h2>
          <p>Explore thousands of products across all categories</p>
        </div>
        <div className="landing-cat-grid">
          {CATEGORIES.map(cat => (
            <Link to="/login" key={cat.name} className="landing-cat-card">
              <img src={cat.img} alt={cat.name} />
              <div className="landing-cat-overlay">
                <span>{cat.name}</span>
                <small>Shop Now →</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta">
        <div className="landing-cta-content">
          <h2>Ready to start shopping?</h2>
          <p>Create your free account and get access to exclusive deals, fast delivery, and easy returns.</p>
          <div className="landing-cta-btns">
            <Link to="/register" className="landing-btn-primary">Create Free Account</Link>
            <Link to="/login" className="landing-btn-outline">Log In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-logo">Omni<span>Mart</span></div>
        <p>© 2026 OmniMart. Manjula Ugar.</p>
        <Link to="/admin/login" className="landing-admin-link">
          🔐 Admin Portal
        </Link>
      </footer>

    </div>
  );
};

export default Landing;
