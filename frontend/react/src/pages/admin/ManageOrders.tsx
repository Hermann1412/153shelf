import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import type { Order } from '../../types';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/orders/${id}`, { status });
      setOrders(orders.map((o) => o._id === id ? res.data : o));
      toast.success('Status updated');
    } catch {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="container admin-page">
      <h2>Manage Orders</h2>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{typeof o.user === 'object' ? o.user.name : o.user}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>${o.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${o.paymentStatus}`}>{o.paymentStatus}</span>
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="status-select"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
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
