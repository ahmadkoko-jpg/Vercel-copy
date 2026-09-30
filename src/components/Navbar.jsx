import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-1 py-1 border-b-2 ${isActive ? 'border-cobalt' : 'border-transparent hover:border-line'}`;

  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Parcel
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/" end className={linkClass}>Shop</NavLink>
          {user && <NavLink to="/orders" className={linkClass}>My orders</NavLink>}
          <NavLink to="/cart" className={linkClass}>
            Cart{count > 0 && <span className="ml-1 rounded bg-cobalt px-1.5 py-0.5 text-xs text-white">{count}</span>}
          </NavLink>
          {user ? (
            <button
              className="text-muted hover:text-ink"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out ({user.name.split(' ')[0]})
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>Log in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
