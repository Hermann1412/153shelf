import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import type { User } from '../../types';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (id === currentUser?._id) {
      toast.error("You can't delete your own account");
      return;
    }
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Error deleting user');
    }
  };

  return (
    <div className="container admin-page">
      <h2>Manage Users</h2>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                  <td>{new Date((u as unknown as { createdAt: string }).createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser?._id}
                    >
                      Delete
                    </button>
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
