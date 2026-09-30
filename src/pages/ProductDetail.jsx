import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api(`/products/${id}`).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!product) return <p className="text-muted">Loading…</p>;

  const soldOut = product.stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square overflow-hidden border border-line bg-panel">
        {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" />}
      </div>
      <div>
        <Link to="/" className="text-sm text-muted hover:underline">Back to shop</Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-muted">{product.category}</p>
        <p className="mt-4 text-2xl font-bold">{money(product.price)}</p>
        <p className="mt-4 max-w-prose leading-relaxed">{product.description}</p>
        <p className="mt-4 text-sm text-muted">
          {soldOut ? 'Sold out' : product.stock < 6 ? `Only ${product.stock} left` : 'In stock'}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            aria-label="Quantity"
            disabled={soldOut}
            onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, product.stock)))}
            className="field w-24"
          />
          <button
            className="btn btn-primary"
            disabled={soldOut}
            onClick={() => {
              add(product, qty);
              setAdded(true);
            }}
          >
            Add to cart
          </button>
        </div>
        {added && (
          <p className="mt-3 text-sm">
            Added to your cart. <Link to="/cart" className="text-cobalt underline">View cart</Link>
          </p>
        )}
      </div>
    </div>
  );
}
