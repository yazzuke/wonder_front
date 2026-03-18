import { useState, useEffect, useCallback } from 'react';
import './OrderBoard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const POLLING_INTERVAL = Number(import.meta.env.VITE_POLLING_INTERVAL) || 5000;

export default function OrderBoard() {
  const [preparing, setPreparing] = useState([]);
  const [ready, setReady] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/board`);
      const json = await res.json();
      if (json.success) {
        setPreparing(json.data.preparing);
        setReady(json.data.ready);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return (
    <div className="board">
      {/* Columns */}
      <div className="board__columns">
        {/* Preparing */}
        <div className="board__column board__column--preparing">
          <h1 className="board__title">
            Preparing <span className="board__icon">👨‍🍳</span>
          </h1>
          <div className="board__grid">
            {preparing.map((num, i) => (
              <div key={`prep-${num}-${i}`} className="board__number">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Ready */}
        <div className="board__column board__column--ready">
          <h1 className="board__title">
            Ready! <span className="board__icon">🍽️</span>
          </h1>
          <div className="board__grid">
            {ready.map((num, i) => (
              <div key={`ready-${num}-${i}`} className="board__number">
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="board__banner">
        <div className="board__banner-overlay" />
        <div className="board__logo">Wonder</div>
      </div>
    </div>
  );
}
