import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/constants';

const CartContext = createContext(null);
export { CartContext };

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  const key = (productId, variantId) => `${productId}-${variantId || 'none'}`;

  const addItem = useCallback((product, variant = null, quantity = 1) => {
    setItems((prev) => {
      const k = key(product.id, variant?.id);
      const existing = prev.find((i) => i.key === k);
      if (existing) {
        return prev.map((i) => (i.key === k ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { key: k, product, variant, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId, variantId = null) => {
    setItems((prev) => prev.filter((i) => i.key !== key(productId, variantId)));
  }, []);

  const updateQuantity = useCallback((productId, variantId = null, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key(productId, variantId) ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
