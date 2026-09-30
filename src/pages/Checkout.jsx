import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, money } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { token, user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ fullName: user?.name || '', phone: '', address: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setShipping({ ...shipping, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: { shipping, items: items.map((i) => ({ product: i.product, qty: i.qty })) },
      });
      clear();
      navigate('/orders', { state: { placed: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={submit} className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Delivery details</h1>
        <label className="block">
          <span className="mb-1 block text-sm">Full name</span>
          <input className="field" required value={shipping.fullName} onChange={set('fullName')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Phone</span>
          <input className="field" type="tel" required value={shipping.phone} onChange={set('phone')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Address</span>
          <textarea className="field" rows="3" required value={shipping.address} onChange={set('address')} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">City</span>
          <input className="field" required value={shipping.city} onChange={set('city')} />
        </label>
        <p className="text-sm text-muted">Payment: cash on delivery.</p>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Placing order…' : `Place order (${money(total)})`}
        </button>
      </form>

      <aside className="h-fit border border-line bg-panel p-5">
        <h2 className="text-lg font-bold">In your order</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.product} className="flex justify-between gap-3">
              <span>{i.qty} x {i.name}</span>
              <span>{money(i.qty * i.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-3 font-bold">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
        <Link to="/cart" className="mt-3 block text-sm text-cobalt underline">Edit cart</Link>
      </aside>
    </div>
  );
}
