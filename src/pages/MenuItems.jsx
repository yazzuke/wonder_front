import { useState, useEffect, useMemo } from 'react';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemStock,
  deleteMenuItem,
} from '../api';
import './MenuItems.css';

const EMPTY_FORM = {
  pos_id: '', menu: '', item_type: '', category: '',
  parent_group: '', name: '', description: '',
  price: '', in_stock: true, sort_order: '',
};

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filterMenu, setFilterMenu] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    try {
      const filters = {};
      if (filterMenu) filters.menu = filterMenu;
      if (filterCategory) filters.category = filterCategory;
      const data = await fetchMenuItems(filters);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [filterMenu, filterCategory]);

  // Unique menus/categories for filter dropdowns
  const menus = useMemo(() => [...new Set(items.map((i) => i.menu).filter(Boolean))], [items]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))], [items]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      pos_id: item.pos_id || '',
      menu: item.menu || '',
      item_type: item.item_type || '',
      category: item.category || '',
      parent_group: item.parent_group || '',
      name: item.name || '',
      description: item.description || '',
      price: item.price != null ? String(item.price) : '',
      in_stock: item.in_stock ?? true,
      sort_order: item.sort_order != null ? String(item.sort_order) : '',
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pos_id || !form.menu || !form.item_type || !form.name) {
      setMessage({ type: 'error', text: 'pos_id, menu, item_type, and name are required' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        price: form.price !== '' ? form.price.replace(/[^0-9.]/g, '') : undefined,
        sort_order: form.sort_order !== '' ? parseInt(form.sort_order, 10) : undefined,
      };
      if (editing) {
        await updateMenuItem(editing, payload);
        setMessage({ type: 'success', text: 'Menu item updated' });
      } else {
        await createMenuItem(payload);
        setMessage({ type: 'success', text: 'Menu item created' });
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

  const handleToggleStock = async (item) => {
    try {
      await toggleMenuItemStock(item.id, !item.in_stock);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, in_stock: !item.in_stock } : i))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const syncMenu = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch('https://wondexec4ua.zeabur.app/api/wonder/sync', { method: 'POST' });
      const json = await res.json();
      if (!json.success && !res.ok) throw new Error(json.message || 'Sync failed');
      setMessage({ type: 'success', text: 'Menu synced successfully' });
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="menu-items-page">
      <div className="menu-items-page__header">
        <h1 className="page-title">Menu Items</h1>
        <div className="menu-items-page__header-actions">
          <button className="btn btn--outline" onClick={syncMenu} disabled={syncing}>
            {syncing ? '⚡ Syncing...' : '⚡ Sync Menu'}
          </button>
          <button className="btn btn--primary" onClick={openCreate}>+ New Item</button>
        </div>
      </div>

      {message && (
        <div className={`alert alert--${message.type}`}>{message.text}</div>
      )}

      {/* Filters */}
      <div className="mi-filters">
        <select
          className="form-select"
          value={filterMenu}
          onChange={(e) => setFilterMenu(e.target.value)}
        >
          <option value="">All Menus</option>
          {menus.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          className="form-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <form className="mi-form" onSubmit={handleSubmit}>
          <h2 className="section-title">{editing ? 'Edit Menu Item' : 'New Menu Item'}</h2>
          <div className="mi-form__grid">
            <label className="form-label">
              POS ID *
              <input className="form-input" name="pos_id" value={form.pos_id} onChange={handleChange} placeholder="e.g. TOAST-001" disabled={!!editing} />
            </label>
            <label className="form-label">
              Menu *
              <input className="form-input" name="menu" value={form.menu} onChange={handleChange} placeholder="e.g. Lunch" />
            </label>
            <label className="form-label">
              Item Type *
              <input className="form-input" name="item_type" value={form.item_type} onChange={handleChange} placeholder="e.g. item, modifier" />
            </label>
            <label className="form-label">
              Category
              <input className="form-input" name="category" value={form.category} onChange={handleChange} />
            </label>
            <label className="form-label">
              Name *
              <input className="form-input" name="name" value={form.name} onChange={handleChange} />
            </label>
            <label className="form-label form-label--full">
              Description
              <textarea className="form-input" name="description" rows="2" value={form.description} onChange={handleChange} />
            </label>
            <label className="form-label">
              Price
              <input className="form-input" name="price" value={form.price} onChange={handleChange} placeholder="e.g. $12.99" />
            </label>
            <label className="form-label form-label--check">
              <input type="checkbox" name="in_stock" checked={form.in_stock} onChange={handleChange} />
              In Stock
            </label>
            <label className="form-label">
              Sort Order
              <input className="form-input" name="sort_order" type="number" min="0" value={form.sort_order} onChange={handleChange} />
            </label>
          </div>
          <div className="mi-form__actions">
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <table className="mi-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Menu</th>
            <th>Category</th>
            <th>Type</th>
            <th>Price</th>
            <th>In Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="mi-table__name">{item.name}</td>
              <td>{item.menu}</td>
              <td>{item.category || '—'}</td>
              <td><span className="mi-badge">{item.item_type}</span></td>
              <td>{item.price != null && item.price !== '' ? `$${Number(item.price).toFixed(2)}` : '—'}</td>
              <td>
                <button
                  className={`stock-toggle ${item.in_stock ? 'stock-toggle--on' : 'stock-toggle--off'}`}
                  onClick={() => handleToggleStock(item)}
                  title={item.in_stock ? 'Mark out of stock' : 'Mark in stock'}
                >
                  <span className="stock-toggle__dot" />
                </button>
              </td>
              <td>
                <div className="mi-table__actions">
                  <button className="btn btn--sm btn--outline" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn--sm btn--danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="7" className="mi-table__empty">No menu items found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
