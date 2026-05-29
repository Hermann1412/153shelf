import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

interface Stats {
  users: number;
  products: number;
  orders: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/products?limit=1'),
      api.get('/orders'),
    ]).then(([usersRes, productsRes, ordersRes]) => {
      setStats({
        users: usersRes.data.length,
        products: productsRes.data.total,
        orders: ordersRes.data.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, link: '/admin/users', color: '#3b82f6' },
    { label: 'Total Books', value: stats.products, link: '/admin/products', color: '#10b981' },
    { label: 'Total Reads', value: stats.orders, link: '/admin/orders', color: '#f59e0b' },
  ];

  return (
    <div className="container admin-page">
      <h2>Admin Dashboard</h2>
      {loading ? (
        <div className="loading">Loading stats...</div>
      ) : (
        <div className="stats-grid">
          {cards.map((card) => (
            <Link to={card.link} key={card.label} className="stat-card" style={{ borderColor: card.color }}>
              <h3 style={{ color: card.color }}>{card.value}</h3>
              <p>{card.label}</p>
            </Link>
          ))}
        </div>
      )}
      <div className="admin-nav">
        <Link to="/admin/products" className="btn-primary">Manage Books</Link>
        <Link to="/admin/orders" className="btn-primary">Manage Reads</Link>
        <Link to="/admin/users" className="btn-primary">Manage Users</Link>
      </div>
    </div>
  );
}
