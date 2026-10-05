import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import './Orders.css';

const statusColor = { PLACED: '#2874f0', PROCESSING: '#ff9f00', SHIPPED: '#9c27b0', DELIVERED: '#388e3c', CANCELLED: '#e53935' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userOrderKey = `localOrders_${userEmail}`;

    if (token) {
      axios.get('http://localhost:8080/api/v1/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setOrders(res.data))
        .catch(() => setOrders(JSON.parse(localStorage.getItem(userOrderKey) || '[]')))
        .finally(() => setLoading(false));
    } else {
      setOrders(JSON.parse(localStorage.getItem(userOrderKey) || '[]'));
      setLoading(false);
    }
  }, []);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return (
    <div className="orders-loading">
      <div className="orders-spinner" />
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <Package size={72} color="#e0e0e0" />
            <h2>No orders yet</h2>
            <p>Looks like you haven't placed any orders yet.</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header" onClick={() => toggle(order.id)}>
                  <div className="order-header-left">
                    <div className="order-id">Order #{String(order.id).slice(-6)}</div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="order-header-right">
                    <span className="order-status" style={{ background: statusColor[order.status] || '#388e3c' }}>
                      {order.status}
                    </span>
                    <span className="order-total">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                    {expanded[order.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Preview first item always */}
                <div className="order-preview">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="order-preview-item">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        onError={e => { e.target.src = `https://placehold.co/60x60/f7f7f7/aaa?text=img`; }}
                      />
                      <div>
                        <p>{item.product.name}</p>
                        <span>Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && !expanded[order.id] && (
                    <p className="order-more">+{order.items.length - 2} more items</p>
                  )}
                </div>

                {/* Expanded details */}
                {expanded[order.id] && (
                  <div className="order-details">
                    <div className="order-items-full">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            onError={e => { e.target.src = `https://placehold.co/60x60/f7f7f7/aaa?text=img`; }}
                          />
                          <div className="order-item-info">
                            <p>{item.product.name}</p>
                            <span>{item.product.brand}</span>
                          </div>
                          <div className="order-item-price">
                            <span>Qty: {item.quantity}</span>
                            <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress && (
                      <div className="order-address">
                        <MapPin size={14} />
                        <span>{order.shippingAddress}</span>
                      </div>
                    )}
                    <div className="order-summary-row">
                      <span>Total Amount</span>
                      <strong>₹{Number(order.totalAmount).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
