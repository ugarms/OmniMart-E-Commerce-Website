import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const getLocalCart = () => JSON.parse(localStorage.getItem('localCart') || '[]');
const saveLocalCart = (cart) => localStorage.setItem('localCart', JSON.stringify(cart));

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [useLocal, setUseLocal] = useState(false);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const local = getLocalCart();
      setCartCount(local.reduce((t, i) => t + i.quantity, 0));
      return;
    }
    try {
      const res = await axios.get('http://localhost:8080/api/v1/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUseLocal(false);
      setCartCount(res.data.reduce((total, item) => total + item.quantity, 0));
    } catch {
      setUseLocal(true);
      const local = getLocalCart();
      setCartCount(local.reduce((t, i) => t + i.quantity, 0));
    }
  };

  const addToLocalCart = (product) => {
    const cart = getLocalCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveLocalCart(cart);
    setCartCount(cart.reduce((t, i) => t + i.quantity, 0));
  };

  useEffect(() => {
    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, useLocal, addToLocalCart, getLocalCart, saveLocalCart }}>
      {children}
    </CartContext.Provider>
  );
};
