import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await axios.post(`http://localhost:8080/api/v1/cart/add/${product.id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { quantity: 1 }
      });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart!');
    } catch (err) {
      console.error("Error adding to cart", err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Product not found.</div>;
  }

  return (
    <div className="product-details-container container">
      <Link to="/shop" className="back-link"><ArrowLeft size={20} /> Back to Shop</Link>
      
      <div className="product-details-layout glass">
        <div className="product-details-image">
          <img 
            src={product.imageUrl || `https://source.unsplash.com/random/800x800/?fashion,${product.category?.name}`} 
            alt={product.name} 
          />
        </div>
        
        <div className="product-details-info">
          <Link to={`/shop?category=${encodeURIComponent(product.category?.name)}`} className="product-category-badge" style={{ textDecoration: 'none' }}>
            {product.category?.name}
          </Link>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
          
          <div className="product-description-box">
            <h3>Description</h3>
            <p className="product-description">{product.description}</p>
          </div>
          
          <div className="product-attributes">
            {product.brand && <p><strong>Brand:</strong> <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`}>{product.brand}</Link></p>}
            {product.size && <p><strong>Size:</strong> <Link to={`/shop?size=${encodeURIComponent(product.size)}`}>{product.size}</Link></p>}
            {product.color && <p><strong>Color:</strong> <Link to={`/shop?color=${encodeURIComponent(product.color)}`}>{product.color}</Link></p>}
          </div>
          
          <button 
            className="btn-primary add-to-cart-large" 
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <ShoppingCart size={20} style={{ marginRight: '10px' }} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
