import { useState, useEffect } from 'react';
import { fetchProducts, createOrder } from '../api';
import './CreateOrder.css';

export default function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1, unit_price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p.id === Number(productId));
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, product_id: productId, unit_price: product ? product.price : 0 }
          : item
      )
    );
  };

  const handleQuantityChange = (index, qty) => {
    const val = Math.max(1, Number(qty));
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: val } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = items.filter((item) => item.product_id);
    if (validItems.length === 0) {
      setMessage({ type: 'error', text: 'Add at least one product' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const order = await createOrder({
        customer_name: customerName || undefined,
        notes: notes || undefined,
        items: validItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        total: parseFloat(total.toFixed(2)),
      });
      setMessage({ type: 'success', text: `Order #${order.order_number} created` });
      setCustomerName('');
      setNotes('');
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order">
      <h1 className="page-title">New Order</h1>

      {message && (
        <div className={`alert alert--${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-row">
          <label className="form-label">
            Customer Name
            <input
              type="text"
              className="form-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="form-label">
            Notes
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. no onions, extra sauce"
            />
          </label>
        </div>

        <h2 className="section-title">Items</h2>

        <div className="items-list">
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <select
                className="form-select"
                value={item.product_id}
                onChange={(e) => handleProductChange(index, e.target.value)}
              >
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-input form-input--qty"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />

              <span className="item-subtotal">
                ${(item.quantity * item.unit_price).toFixed(2)}
              </span>

              <button
                type="button"
                className="btn btn--icon btn--danger"
                onClick={() => removeItem(index)}
                disabled={items.length <= 1}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn--outline" onClick={addItem}>
          + Add Item
        </button>

        <div className="order-total">
          Total: <strong>${total.toFixed(2)}</strong>
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
}
