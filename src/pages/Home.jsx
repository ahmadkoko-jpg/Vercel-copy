import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/products/categories').then(setCategories).catch(() => {});
  }, []);

  // Debounce so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const q = new URLSearchParams({ search, category, sort });
      api(`/products?${q}`)
        .then((d) => {
          setProducts(d);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category, sort]);

  return (
    <>
      <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Everyday things for the kitchen, the home and the commute.
      </h1>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          className="field max-w-xs"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`btn ${category === c ? 'btn-primary' : 'btn-ghost'}`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
        <select
          className="field ml-auto w-auto"
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {error && <p className="mt-6 text-danger">Couldn't load products: {error}. Is the API running?</p>}
      {loading && <p className="mt-6 text-muted">Loading products…</p>}
      {!loading && !error && products.length === 0 && (
        <p className="mt-6 text-muted">No products match. Try a different search or category.</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </>
  );
}
