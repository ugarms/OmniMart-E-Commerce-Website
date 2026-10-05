import React, { useState } from 'react';
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const getRating = (id) => (3.5 + (id % 15) * 0.1).toFixed(1);
const getReviews = (id) => 100 + (id * 37) % 9000;
const getDiscount = (id) => 10 + (id % 5) * 5;

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { addToLocalCart } = useCart();
  const navigate = useNavigate();

  const discount = getDiscount(product.id);
  const originalPrice = Math.round(product.price / (1 - discount / 100));
  const rating = getRating(product.id);
  const reviews = getReviews(product.id);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(`http://localhost:8080/api/v1/cart/add/${product.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
          params: { quantity: 1 }
        });
        window.dispatchEvent(new Event('cartUpdated'));
        return;
      } catch { /* fall through */ }
    }
    addToLocalCart(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    await addToCart();
    alert('Added to cart!');
    setIsAdding(false);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setIsBuying(true);
    await addToCart();
    setIsBuying(false);
    navigate('/cart');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/f7f7f7/aaa?text=${encodeURIComponent(product.name)}`; }}
          />
        </Link>

        <span className="discount-badge">{discount}% OFF</span>

        <button className="wishlist-btn" onClick={e => e.preventDefault()}>
          <Heart size={15} />
        </button>

        {/* Hover overlay buttons */}
        <div className="card-actions-overlay">
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={isAdding}>
            <ShoppingCart size={15} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow} disabled={isBuying}>
            <Zap size={15} />
            {isBuying ? 'Please wait...' : 'Buy Now'}
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-brand">{product.brand || product.category?.name}</span>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <span className="rating-badge">
            {rating} <Star size={9} fill="#fff" strokeWidth={0} />
          </span>
          <span className="rating-count">({reviews.toLocaleString()})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="product-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
          <span className="product-discount-text">{discount}% off</span>
        </div>

        <span className="free-delivery">✓ Free Delivery</span>
      </div>
    </div>
  );
};

export default ProductCard;
