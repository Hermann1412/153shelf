import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="container orders-page">
      <h2>My Library</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't purchased any books yet.</p>
        </div>
      ) : (
        <div className="library-grid">
          {orders
            .filter((o) => o.paymentStatus === 'paid')
            .flatMap((order) =>
              order.items.map((item) => ({
                ...item,
                orderId: order._id,
                purchasedAt: order.createdAt,
              }))
            )
            .map((item, idx) => (
              <div key={idx} className="library-card">
                <img
                  src={item.coverImage ? `http://localhost:5000${item.coverImage}` : 'https://placehold.co/120x170?text=Book'}
                  alt={item.title}
                  className="library-cover"
                />
                <div className="library-info">
                  <h4>{item.title}</h4>
                  <p className="library-date">Purchased {new Date(item.purchasedAt).toLocaleDateString()}</p>
                  <p className="library-price">${item.price.toFixed(2)}</p>
                  <button
                    className="btn-read"
                    onClick={() => navigate(`/read/${item.product}`)}
                  >
                    📖 Read Now
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <h3 className="orders-subtitle">Order History</h3>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className={`badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <span>{item.title}</span>
                  <span>x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">Total: <strong>${order.totalPrice.toFixed(2)}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}
