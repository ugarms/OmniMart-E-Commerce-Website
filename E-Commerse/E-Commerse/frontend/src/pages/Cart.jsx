import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, CheckCircle, X, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [formError, setFormError] = useState('');
  const { getLocalCart, saveLocalCart, fetchCartCount } = useCart();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data);
        setIsLocal(false);
        setLoading(false);
        return;
      } catch { /* fall through */ }
    }
    const local = getLocalCart();
    setCartItems(local.map(p => ({ id: p.id, product: p, quantity: p.quantity })));
    setIsLocal(true);
    setLoading(false);
  };

  const removeFromCart = async (id) => {
    if (isLocal) {
      const cart = getLocalCart().filter(p => p.id !== id);
      saveLocalCart(cart);
      fetchCartCount();
      fetchCart();
      return;
    }
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/v1/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  };

  const handlePlaceOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setFormError('Enter a valid 10-digit phone number.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setFormError('Enter a valid 6-digit pincode.');
      return;
    }
    setFormError('');

    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const userOrderKey = `localOrders_${userEmail}`;

    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'PLACED',
      totalAmount: total,
      shippingAddress: `${form.name}, ${form.phone}, ${form.address}, ${form.city} - ${form.pincode}`,
      items: cartItems.map(i => ({ product: i.product, quantity: i.quantity, price: i.product.price }))
    };

    if (isLocal) {
      const existing = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      localStorage.setItem(userOrderKey, JSON.stringify([newOrder, ...existing]));
      saveLocalCart([]);
      fetchCartCount();
      setCartItems([]);
      setShowCheckout(false);
      setOrderSuccess(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/v1/orders/checkout', { shippingAddress: newOrder.shippingAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
      setShowCheckout(false);
      setOrderSuccess(true);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      const existing = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      localStorage.setItem(userOrderKey, JSON.stringify([newOrder, ...existing]));
      saveLocalCart([]);
      fetchCartCount();
      setCartItems([]);
      setShowCheckout(false);
      setOrderSuccess(true);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    const disc = 10 + (item.product.id % 5) * 5;
    const orig = Math.round(item.product.price / (1 - disc / 100));
    return sum + (orig - item.product.price) * item.quantity;
  }, 0);

  if (orderSuccess) {
    return (
      <div className="cart-success-page">
        <div className="cart-success-box">
          <CheckCircle size={72} color="#388e3c" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with OmniMart. Your order is being processed and will be delivered soon.</p>
          <div className="cart-success-btns">
            <Link to="/orders" className="btn-primary">Track My Order</Link>
            <Link to="/shop" className="cart-continue-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart <span>{cartItems.length} items</span></h1>

        {loading ? (
          <div className="cart-loading">Loading your cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty!</h2>
            <p>Add items to it now.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items-box">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <p className="cart-item-brand">{item.product.brand || item.product.category?.name}</p>
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₹{item.product.price.toLocaleString('en-IN')}</span>
                      <span className="cart-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="cart-item-delivery">🚚 Free Delivery</span>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.product.id || item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary-box">
              <div className="cart-summary-header">PRICE DETAILS</div>
              <div className="summary-row"><span>Price ({cartItems.length} items)</span><span>₹{(total + savings).toLocaleString('en-IN')}</span></div>
              <div className="summary-row green"><span>Discount</span><span>− ₹{savings.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Delivery Charges</span><span className="green">FREE</span></div>
              <div className="summary-divider" />
              <div className="summary-row total"><span>Total Amount</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <p className="summary-savings">You will save ₹{savings.toLocaleString('en-IN')} on this order</p>
              <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <h2>Delivery Details</h2>
              <button onClick={() => setShowCheckout(false)}><X size={20} /></button>
            </div>

            {formError && <div className="checkout-error">{formError}</div>}

            <div className="checkout-form">
              <div className="checkout-field">
                <label><User size={14} /> Full Name</label>
                <input placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="checkout-field">
                <label><Phone size={14} /> Phone Number</label>
                <input placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={10} />
              </div>
              <div className="checkout-field full">
                <label><MapPin size={14} /> Full Address</label>
                <textarea placeholder="House No., Street, Area, Landmark" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3} />
              </div>
              <div className="checkout-field">
                <label>City</label>
                <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="checkout-field">
                <label>Pincode</label>
                <input placeholder="6-digit pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} maxLength={6} />
              </div>
            </div>

            <div className="checkout-modal-footer">
              <div className="checkout-total">Total: <strong>₹{total.toLocaleString('en-IN')}</strong></div>
              <button className="checkout-place-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
