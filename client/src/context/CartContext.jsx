import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const storageKey = (user) =>
  user ? `cart:${user._id ?? user.id ?? user.email}` : null;

// Guarda um "retrato" do produto no momento em que foi adicionado
export const toCartItem = (product, quantity = 1) => ({
  productId: product._id,
  name: product.name,
  price: product.price,
  imageUrl: product.imageUrl,
  stock: product.stock,
  quantity,
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = storageKey(user);
  const [cart, setCart] = useState({ key: null, items: [] });

  // Carrega o carrinho do usuário logado (ou esvazia no logout)
  useEffect(() => {
    if (!key) {
      setCart({ key: null, items: [] });
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      setCart({ key, items: Array.isArray(saved) ? saved : [] });
    } catch {
      setCart({ key, items: [] });
    }
  }, [key]);

  // Persiste a cada mudança
  useEffect(() => {
    if (cart.key) localStorage.setItem(cart.key, JSON.stringify(cart.items));
  }, [cart]);

  const update = (fn) =>
    setCart((prev) => (prev.key ? { ...prev, items: fn(prev.items) } : prev));

  const addItem = (product, quantity = 1) =>
    update((items) => {
      const max = Math.max(Number(product.stock) || 0, 1);
      const existing = items.find((i) => i.productId === product._id);
      if (existing) {
        return items.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
            : i
        );
      }
      return [...items, toCartItem(product, Math.min(quantity, max))];
    });

  const setQuantity = (productId, quantity) =>
    update((items) =>
      items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(Math.max(quantity, 1), Math.max(i.stock, 1)) }
          : i
      )
    );

  const removeItems = (productIds) =>
    update((items) => items.filter((i) => !productIds.includes(i.productId)));

  const items = cart.items;
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, setQuantity, removeItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};