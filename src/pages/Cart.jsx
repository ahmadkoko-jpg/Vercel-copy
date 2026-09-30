import { Link, useNavigate } from 'react-router-dom';
import { money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, total, setQty, remove } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
        <Link to="/" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {items.map((i) => (
            <li key={i.product} className="flex items-center gap-4 py-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden bg-panel">
                {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <Link to={`/product/${i.product}`} className="font-medium hover:underline">{i.name}</Link>
                <p className="text-sm text-muted">{money(i.price)} each</p>
                <button className="mt-1 text-sm text-danger hover:underline" onClick={() => remove(i.product)}>
                  Remove
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={i.stock}
                value={i.qty}
                aria-label={`Quantity for ${i.name}`}
                onChange={(e) => setQty(i.product, Number(e.target.value) || 1)}
                className="field w-20"
              />
              <p className="w-28 text-right font-bold">{money(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-line bg-panel p-5">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="mt-4 flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-bold">{money(total)}</span>
        </div>
        <p className="mt-1 text-sm text-muted">Delivery is free. Pay when it arrives.</p>
        <button className="btn btn-primary mt-5 w-full" onClick={() => navigate('/checkout')}>
          Continue to checkout
        </button>
      </aside>
    </div>
  );
}
