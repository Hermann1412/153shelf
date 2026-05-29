import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📚 153Shelf
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/library">My Library</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
