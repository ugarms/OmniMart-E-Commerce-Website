import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { CartProvider } from './context/CartContext';
import './App.css';

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
const Admin = ({ children }) => <AdminRoute>{children}</AdminRoute>;

function App() {
  const token = localStorage.getItem('token');

  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<main className="main-content">{token ? <Navigate to="/dashboard" replace /> : <Landing />}</main>} />
            <Route path="/login" element={<main className="main-content"><Login /></main>} />
            <Route path="/register" element={<main className="main-content"><Register /></main>} />
            <Route path="/dashboard" element={<main className="main-content"><Protected><Home /></Protected></main>} />
            <Route path="/shop" element={<main className="main-content"><Protected><Shop /></Protected></main>} />
            <Route path="/cart" element={<main className="main-content"><Protected><Cart /></Protected></main>} />
            <Route path="/categories" element={<main className="main-content"><Protected><Categories /></Protected></main>} />
            <Route path="/orders" element={<main className="main-content"><Protected><Orders /></Protected></main>} />
            <Route path="/product/:id" element={<main className="main-content"><Protected><ProductDetails /></Protected></main>} />
            {/* Admin - full screen, no main wrapper */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin><AdminDashboard /></Admin>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
