import { Link } from 'react-router-dom';
import { money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const soldOut = product.stock === 0;

  return (
    <article className="flex flex-col border border-line bg-panel">
      <Link to={`/product/${product._id}`} className="block aspect-square overflow-hidden bg-mist">
        {product.image && (
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-sm text-muted">{product.category}</p>
        <Link to={`/product/${product._id}`} className="font-medium hover:underline">
          {product.name}
        </Link>
        <p className="mt-auto pt-2 text-lg font-bold">{money(product.price)}</p>
        <button className="btn btn-primary mt-2" disabled={soldOut} onClick={() => add(product)}>
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
