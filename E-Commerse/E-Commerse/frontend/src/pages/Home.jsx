import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import './Home.css';

const CATEGORIES = [
  { name: "Men's Fashion", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80", link: "/shop?category=Men" },
  { name: "Women's Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80", link: "/shop?category=Women" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80", link: "/shop?category=Electronics" },
  { name: "Footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", link: "/shop?category=Footwear" },
  { name: "Sports", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&q=80", link: "/shop?category=Sports" },
  { name: "Beauty", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80", link: "/shop?category=Beauty" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=300&q=80", link: "/shop?category=Accessories" },
  { name: "Home & Living", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80", link: "/shop?category=Home & Living" },
];

const DEALS = [
  { label: "Min 40% Off", title: "Men's Clothing", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", link: "/shop?category=Men" },
  { label: "Min 50% Off", title: "Women's Ethnic", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", link: "/shop?category=Women" },
  { label: "Min 30% Off", title: "Electronics", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", link: "/shop?category=Electronics" },
  { label: "Min 35% Off", title: "Footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", link: "/shop?category=Footwear" },
];

const BANNERS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
];

const Home = () => {
  return (
    <div className="home-page">

      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <img src={BANNERS[0]} alt="Sale Banner" className="hero-img" />
        <div className="hero-overlay">
          <h1>Big Billion Days Sale</h1>
          <p>Up to 80% off on top brands</p>
          <Link to="/shop" className="hero-cta">Shop Now <ChevronRight size={18} /></Link>
        </div>
      </div>

      <div className="home-content">

        {/* ── Trust Badges ── */}
        <div className="trust-bar">
          <div className="trust-item"><Truck size={22} /><span>Free Delivery</span></div>
          <div className="trust-item"><ShieldCheck size={22} /><span>Secure Payment</span></div>
          <div className="trust-item"><RefreshCw size={22} /><span>Easy Returns</span></div>
          <div className="trust-item"><Headphones size={22} /><span>24/7 Support</span></div>
        </div>

        {/* ── Shop by Category ── */}
        <div className="home-section">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/categories" className="see-all">See All <ChevronRight size={15} /></Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <Link to={cat.link} key={cat.name} className="cat-card">
                <div className="cat-img-wrap">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Deals of the Day ── */}
        <div className="home-section deals-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Deals of the Day</h2>
            <Link to="/shop" className="see-all">View All Deals <ChevronRight size={15} /></Link>
          </div>
          <div className="deals-grid">
            {DEALS.map(deal => (
              <Link to={deal.link} key={deal.title} className="deal-card">
                <img src={deal.img} alt={deal.title} />
                <div className="deal-info">
                  <span className="deal-label">{deal.label}</span>
                  <p>{deal.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Two Banner Row ── */}
        <div className="banner-row">
          <Link to="/shop?category=Women" className="banner-half">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80" alt="Women" />
            <div className="banner-half-text">
              <span>Women's Collection</span>
              <strong>Shop Now →</strong>
            </div>
          </Link>
          <Link to="/shop?category=Electronics" className="banner-half">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=80" alt="Electronics" />
            <div className="banner-half-text">
              <span>Top Electronics</span>
              <strong>Explore →</strong>
            </div>
          </Link>
        </div>

        {/* ── New Arrivals ── */}
        <div className="home-section">
          <div className="section-header">
            <h2 className="section-title">✨ New Arrivals</h2>
            <Link to="/shop" className="see-all">View All <ChevronRight size={15} /></Link>
          </div>
          <div className="arrivals-grid">
            {[
              { title: "Men's Wear", sub: "Fresh styles", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80", link: "/shop?category=Men" },
              { title: "Women's Wear", sub: "New season", img: "https://images.unsplash.com/photo-1515347619152-16e6f0f295bc?w=400&q=80", link: "/shop?category=Women" },
              { title: "Sneakers", sub: "Latest drops", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", link: "/shop?category=Footwear" },
              { title: "Accessories", sub: "Must haves", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", link: "/shop?category=Accessories" },
            ].map(item => (
              <Link to={item.link} key={item.title} className="arrival-card">
                <img src={item.img} alt={item.title} />
                <div className="arrival-info">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
