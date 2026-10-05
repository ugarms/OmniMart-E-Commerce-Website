import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut,
  IndianRupee, ShieldCheck, Plus, Trash2, Edit2, X, Check
} from 'lucide-react';
import { products as allProducts, categories } from '../../data/products';
import './Admin.css';

const getUsers = () => JSON.parse(localStorage.getItem('localUsers') || '[]');
const getAllOrders = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('localOrders_'));
  return keys.flatMap(k => JSON.parse(localStorage.getItem(k) || '[]'));
};

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'products',  label: 'Products',  icon: <Package size={18} /> },
  { id: 'orders',    label: 'Orders',    icon: <ShoppingBag size={18} /> },
  { id: 'users',     label: 'Users',     icon: <Users size={18} /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState(categories);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', brand: '', category: 'Men', imageUrl: '', description: '' });

  useEffect(() => {
    // Fetch products
    axios.get('http://localhost:8080/api/v1/products?sizePage=1000')
      .then(res => setProducts(res.data.content || []))
      .catch(err => console.error(err));
    // Fetch categories
    axios.get('http://localhost:8080/api/v1/categories')
      .then(res => setDbCategories(res.data || categories))
      .catch(err => console.error(err));
  }, []);

  const orders = getAllOrders();
  const users = getUsers();
  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/products/${id}`);
        setProducts(p => p.filter(x => x.id !== id));
      } catch (e) { console.error('Failed to delete', e); }
    }
  };

  const startEdit = (p) => { setEditId(p.id); setEditData({ ...p }); };
  
  const saveEdit = async () => {
    try {
      const payload = { ...editData, price: Number(editData.price) };
      const res = await axios.put(`http://localhost:8080/api/v1/products/${editId}`, payload);
      setProducts(p => p.map(x => x.id === editId ? res.data : x));
      setEditId(null);
    } catch (e) { console.error('Failed to update', e); }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    try {
      const catObj = dbCategories.find(c => c.name === newProduct.category) || dbCategories[0];
      const payload = { ...newProduct, price: Number(newProduct.price), category: catObj };
      const res = await axios.post('http://localhost:8080/api/v1/products', payload);
      setProducts(p => [...p, res.data]);
      setNewProduct({ name: '', price: '', brand: '', category: dbCategories[0]?.name || 'Men', imageUrl: '', description: '' });
      setShowAdd(false);
    } catch (e) { console.error('Failed to add', e); }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <ShieldCheck size={22} />
          <span>OmniMart Admin</span>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2 className="admin-page-title">{TABS.find(t => t.id === tab)?.label}</h2>
          <span className="admin-badge">Admin</span>
        </div>

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div className="admin-content">
            <div className="admin-stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon"><IndianRupee size={24} /></div>
                <div><p className="stat-label">Total Revenue</p><h3>₹{totalRevenue.toLocaleString('en-IN')}</h3></div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon"><ShoppingBag size={24} /></div>
                <div><p className="stat-label">Total Orders</p><h3>{orders.length}</h3></div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon"><Package size={24} /></div>
                <div><p className="stat-label">Total Products</p><h3>{products.length}</h3></div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon"><Users size={24} /></div>
                <div><p className="stat-label">Registered Users</p><h3>{users.length}</h3></div>
              </div>
            </div>

            <div className="admin-section-title">Recent Orders</div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.slice(0, 10).map(o => (
                    <tr key={o.id}>
                      <td>#{String(o.id).slice(-6)}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{o.items?.length || 0} items</td>
                      <td>₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                      <td><span className={`admin-status ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={5} className="admin-empty">No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <div className="admin-content">
            <div className="admin-toolbar">
              <span>{products.length} products</span>
              <button className="admin-add-btn" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Product</button>
            </div>

            {showAdd && (
              <div className="admin-add-form">
                <h3>Add New Product</h3>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Name</label><input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Product name" /></div>
                  <div className="admin-field"><label>Price (₹)</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="0" /></div>
                  <div className="admin-field"><label>Brand</label><input value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} placeholder="Brand name" /></div>
                  <div className="admin-field"><label>Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      {dbCategories.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-field full"><label>Image URL</label><input value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} placeholder="https://..." /></div>
                  <div className="admin-field full"><label>Description</label><input value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product description" /></div>
                </div>
                <div className="admin-form-actions">
                  <button className="admin-save-btn" onClick={addProduct}><Check size={15} /> Add Product</button>
                  <button className="admin-cancel-btn" onClick={() => setShowAdd(false)}><X size={15} /> Cancel</button>
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      {editId === p.id ? (
                        <>
                          <td><img src={editData.imageUrl} alt="" className="admin-product-img" onError={e => e.target.src='https://placehold.co/50x50/f5f5f5/aaa?text=img'} /></td>
                          <td><input className="admin-inline-input" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></td>
                          <td>{p.category?.name}</td>
                          <td><input className="admin-inline-input" value={editData.brand} onChange={e => setEditData({...editData, brand: e.target.value})} /></td>
                          <td><input className="admin-inline-input" style={{width:80}} type="number" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} /></td>
                          <td className="admin-actions">
                            <button className="admin-save-btn sm" onClick={saveEdit}><Check size={14} /></button>
                            <button className="admin-cancel-btn sm" onClick={() => setEditId(null)}><X size={14} /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td><img src={p.imageUrl} alt={p.name} className="admin-product-img" onError={e => e.target.src='https://placehold.co/50x50/f5f5f5/aaa?text=img'} /></td>
                          <td className="admin-product-name">{p.name}</td>
                          <td><span className="admin-cat-tag">{p.category?.name}</span></td>
                          <td>{p.brand}</td>
                          <td className="admin-price">₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td className="admin-actions">
                            <button className="admin-edit-btn" onClick={() => startEdit(p)}><Edit2 size={14} /></button>
                            <button className="admin-delete-btn" onClick={() => deleteProduct(p.id)}><Trash2 size={14} /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div className="admin-content">
            <div className="admin-toolbar"><span>{orders.length} total orders</span></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Items</th><th>Amount</th><th>Address</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{String(o.id).slice(-6)}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{o.shippingAddress?.split(',')[0] || '—'}</td>
                      <td>{o.items?.length || 0}</td>
                      <td>₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="admin-address">{o.shippingAddress || '—'}</td>
                      <td><span className={`admin-status ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={7} className="admin-empty">No orders placed yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="admin-content">
            <div className="admin-toolbar"><span>{users.length} registered users</span></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Orders</th></tr></thead>
                <tbody>
                  {users.map((u, i) => {
                    const userOrders = JSON.parse(localStorage.getItem(`localOrders_${u.email}`) || '[]');
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{u.firstname}</td>
                        <td>{u.lastname}</td>
                        <td>{u.email}</td>
                        <td><span className="admin-cat-tag">{userOrders.length} orders</span></td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && <tr><td colSpan={5} className="admin-empty">No registered users yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
