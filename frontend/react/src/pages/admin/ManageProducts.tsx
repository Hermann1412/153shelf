import { useState, useEffect, FormEvent, useRef } from 'react';
import api from '../../api/axios';
import { mediaUrl } from '../../lib/config';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

const emptyForm = { title: '', author: '', description: '', category: '', pages: '', language: 'English' };

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products?limit=100');
    setProducts(res.data.products);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setCoverFile(null);
    setPdfFile(null);
    setCoverPreview('');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title, author: p.author, description: p.description,
      category: p.category,
      pages: String(p.pages || ''), language: p.language || 'English',
    });
    setCoverPreview(p.coverImage ? mediaUrl(p.coverImage) : '');
    setCoverFile(null);
    setPdfFile(null);
    setShowForm(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing && !pdfFile) {
      toast.error('Please upload a PDF file for the book');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (coverFile) data.append('cover', coverFile);
      if (pdfFile) data.append('pdf', pdfFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Book updated');
      } else {
        await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Book added');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return;
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
        <h2>Manage Books</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Book</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">

              <div className="upload-row">
                <div className="cover-upload">
                  <label>Cover Image</label>
                  <div className="cover-preview" onClick={() => coverRef.current?.click()}>
                    {coverPreview
                      ? <img src={coverPreview} alt="Cover preview" />
                      : <div className="cover-placeholder">Click to upload cover</div>
                    }
                  </div>
                  <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
                </div>

                <div className="pdf-upload">
                  <label>PDF File {editing ? '(leave empty to keep current)' : '*'}</label>
                  <div className={`pdf-drop ${pdfFile ? 'has-file' : ''}`} onClick={() => pdfRef.current?.click()}>
                    {pdfFile
                      ? <><span className="pdf-icon">📄</span><span>{pdfFile.name}</span></>
                      : <><span className="pdf-icon">📤</span><span>Click to upload PDF</span></>
                    }
                  </div>
                  <input ref={pdfRef} type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} hidden />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pages</label>
                  <input type="number" min="0" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="loading">Loading...</div> : (
        <div className="books-admin-grid">
          {products.map((p) => (
            <div key={p._id} className="book-admin-card">
              <img
                src={p.coverImage ? mediaUrl(p.coverImage) : 'https://placehold.co/120x170?text=No+Cover'}
                alt={p.title}
                className="book-admin-cover"
              />
              <div className="book-admin-info">
                <h4>{p.title}</h4>
                <p>{p.author}</p>
                <p className="book-admin-cat">{p.category}</p>
                {(p as unknown as { pdfPath?: string }).pdfPath !== undefined
                  ? <span className="badge paid">PDF ✓</span>
                  : <span className="badge pending">No PDF</span>
                }
              </div>
              <div className="book-admin-actions">
                <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
