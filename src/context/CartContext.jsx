import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product === product._id);
      if (found) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          qty: Math.min(qty, product.stock),
        },
      ];
    });

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.product === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product !== id));
  const clear = () => setItems([]);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, count, total, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
