import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, money } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { token } = useAuth();
  const { state } = useLocation();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders/mine', { token }).then(setOrders).catch((e) => setError(e.message));
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My orders</h1>
      {state?.placed && (
        <p role="status" className="mt-4 border border-line bg-panel p-3">
          Your order is placed. We'll call you to confirm delivery.
        </p>
      )}
      {error && <p className="mt-4 text-danger">{error}</p>}
      {!orders && !error && <p className="mt-4 text-muted">Loading…</p>}
      {orders?.length === 0 && <p className="mt-4 text-muted">You haven't ordered anything yet.</p>}

      <div className="mt-6 space-y-4">
        {orders?.map((o) => (
          <article key={o._id} className="border border-line bg-panel p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="text-sm text-muted">
                {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}#{o._id.slice(-6)}
              </p>
              <p className="rounded bg-mist px-2 py-0.5 text-sm capitalize">{o.status}</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {o.items.map((i) => (
                <li key={i._id} className="flex justify-between gap-3">
                  <span>{i.qty} x {i.name}</span>
                  <span>{money(i.qty * i.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 text-right font-bold">{money(o.total)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
