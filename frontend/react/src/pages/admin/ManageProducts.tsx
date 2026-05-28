import { useState, useEffect, FormEvent } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

const empty = { title: '', author: '', description: '', price: 0, category: '', image: '', stock: 0 };

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products?limit=100');
    setProducts(res.data.products);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ title: p.title, author: p.author, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch {
      toast.error('Error deleting');
    }
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h2>Manage Products</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              {(['title', 'author', 'category', 'image'] as const).map((f) => (
                <div className="form-group" key={f}>
                  <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                  <input type="text" value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={f !== 'image'} />
                </div>
              ))}
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="loading">Loading...</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.author}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td className="table-actions">
                    <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
