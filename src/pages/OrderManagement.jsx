import { useState, useEffect, useCallback } from 'react';
import { fetchOrders, updateOrderStatus } from '../api';
import './OrderManagement.css';

const POLLING_INTERVAL = Number(import.meta.env.VITE_POLLING_INTERVAL) || 5000;

export default function OrderManagement() {
  const [preparing, setPreparing] = useState([]);
  const [ready, setReady] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    try {
      const [prep, rdy] = await Promise.all([
        fetchOrders('preparing'),
        fetchOrders('ready'),
      ]);
      setPreparing(prep);
      setReady(rdy);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  const changeStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await updateOrderStatus(id, status);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const OrderCard = ({ order }) => (
    <div className="order-card">
      <div className="order-card__header">
        <span className="order-card__number">#{order.order_number}</span>
        <span className={`order-card__badge order-card__badge--${order.status}`}>
          {order.status}
        </span>
      </div>

      {order.customer_name && (
        <div className="order-card__customer">{order.customer_name}</div>
      )}

      <ul className="order-card__items">
        {order.items?.map((item, i) => (
          <li key={i}>
            {item.quantity}× {item.menu_item?.name || item.product?.name || item.product_name || item.menu_item_name || `Item #${item.menu_item_id || item.product_id}`}
          </li>
        ))}
      </ul>

      {order.notes && (
        <div className="order-card__notes">📝 {order.notes}</div>
      )}

      <div className="order-card__total">Total: ${Number(order.total).toFixed(2)}</div>

      <div className="order-card__actions">
        {order.status === 'preparing' && (
          <button
            className="btn btn--ready"
            disabled={actionLoading === order.id}
            onClick={() => changeStatus(order.id, 'ready')}
          >
            ✅ Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button
            className="btn btn--delivered"
            disabled={actionLoading === order.id}
            onClick={() => changeStatus(order.id, 'delivered')}
          >
            🎉 Delivered
          </button>
        )}
        <button
          className="btn btn--cancel"
          disabled={actionLoading === order.id}
          onClick={() => changeStatus(order.id, 'cancelled')}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="order-mgmt">
      <div className="order-mgmt__header">
        <h1 className="page-title">Order Management</h1>
        <button className="btn btn--outline" onClick={load}>🔄 Refresh</button>
      </div>

      <div className="order-mgmt__board">
        <section className="order-mgmt__col order-mgmt__col--preparing">
          <h2 className="order-mgmt__col-title">
            👨‍🍳 Preparing ({preparing.length})
          </h2>
          <div className="order-mgmt__cards">
            {preparing.map((o) => <OrderCard key={o.id} order={o} />)}
            {preparing.length === 0 && (
              <p className="order-mgmt__empty">No orders in preparation</p>
            )}
          </div>
        </section>

        <section className="order-mgmt__col order-mgmt__col--ready">
          <h2 className="order-mgmt__col-title">
            🍽️ Ready ({ready.length})
          </h2>
          <div className="order-mgmt__cards">
            {ready.map((o) => <OrderCard key={o.id} order={o} />)}
            {ready.length === 0 && (
              <p className="order-mgmt__empty">No orders ready</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
