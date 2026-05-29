import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import type { Order } from '../../types';

const ORDER_STATUSES = ['pending', 'completed', 'cancelled'];

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
      <h2>Manage Reads</h2>
      {loading ? <div className="loading">Loading...</div> : (
        orders.length === 0 ? (
          <div className="empty-state"><p>No activity yet.</p></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>User</th><th>Books</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{typeof o.user === 'object' ? o.user.name : o.user}</td>
                    <td>{o.items.map(i => i.title).join(', ')}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
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
        )
      )}
    </div>
  );
}
