import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api';
import './Products.css';

const EMPTY_FORM = {
  name: '', description: '', category: '', sku: '',
  price: '', stock: '', image_url: '',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      sku: product.sku || '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      image_url: product.image_url || '',
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setMessage({ type: 'error', text: 'Name and price are required' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock, 10) : undefined,
      };
      if (editing) {
        await updateProduct(editing, payload);
        setMessage({ type: 'success', text: 'Product updated' });
      } else {
        await createProduct(payload);
        setMessage({ type: 'success', text: 'Product created' });
      }
      await load();
      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <h1 className="page-title">Products</h1>
        <button className="btn btn--primary" onClick={openCreate}>+ New Product</button>
      </div>

      {message && (
        <div className={`alert alert--${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2 className="section-title">{editing ? 'Edit Product' : 'New Product'}</h2>
          <div className="product-form__grid">
            <label className="form-label">
              Name *
              <input className="form-input" name="name" value={form.name} onChange={handleChange} />
            </label>
            <label className="form-label">
              Price *
              <input className="form-input" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} />
            </label>
            <label className="form-label">
              Stock
              <input className="form-input" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
            </label>
            <label className="form-label">
              SKU
              <input className="form-input" name="sku" value={form.sku} onChange={handleChange} />
            </label>
            <label className="form-label">
              Category
              <input className="form-input" name="category" value={form.category} onChange={handleChange} />
            </label>
            <label className="form-label">
              Image URL
              <input className="form-input" name="image_url" value={form.image_url} onChange={handleChange} />
            </label>
            <label className="form-label form-label--full">
              Description
              <textarea className="form-input" name="description" rows="2" value={form.description} onChange={handleChange} />
            </label>
          </div>
          <div className="product-form__actions">
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="products-table__name">
                {p.image_url && <img src={p.image_url} alt="" className="products-table__img" />}
                {p.name}
              </td>
              <td>{p.category || '—'}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.stock ?? '—'}</td>
              <td>
                <div className="products-table__actions">
                  <button className="btn btn--sm btn--outline" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn--sm btn--danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="5" className="products-table__empty">No products found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
