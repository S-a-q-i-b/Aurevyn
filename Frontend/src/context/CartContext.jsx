import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCartApi,
  mergeCartApi,
  upsertCartItemApi,
} from "../services/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "aurevyn_cart";
const GUEST_CART_KEY = "aurevyn_guest_id";
const getCartItemKey = (item) =>
  `${item.id || item._id}__${item.size || "no-size"}__${item.color || "no-color"}`;

const getGuestId = () => {
  let id = localStorage.getItem(GUEST_CART_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_CART_KEY, id);
  }
  return id;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      const guestId = getGuestId();
      try {
        if (user) {
          for (const item of cartItems) {
            await upsertCartItemApi(
              {
                productId: item._id || item.id,
                quantity: item.quantity,
                size: item.size || "",
                color: item.color || "",
                variantSku: item.variantSku || "",
              },
              guestId,
            );
          }
          const response = await mergeCartApi(guestId);
          if (mounted && response?.cart?.items) {
            setCartItems(
              response.cart.items.map((item) => ({
                ...item,
                id: item.product?._id || item.product || item.id,
              })),
            );
          }
        } else {
          const response = await getCartApi(guestId);
          if (mounted && response?.cart?.items?.length && !cartItems.length) {
            setCartItems(
              response.cart.items.map((item) => ({
                ...item,
                id: item.product?._id || item.product || item.id,
              })),
            );
          }
        }
      } catch (error) {
        console.warn("Remote cart sync skipped:", error?.message);
      }
    };
    sync();
    return () => {
      mounted = false;
    };
    // Intentionally sync on auth identity changes; local item changes are persisted locally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const quantityToAdd = Math.max(Number(product.quantity) || 1, 1);
      const incomingKey = getCartItemKey(product);
      const existing = currentItems.find(
        (item) => getCartItemKey(item) === incomingKey,
      );
      if (existing)
        return currentItems.map((item) =>
          getCartItemKey(item) === incomingKey
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        );
      return [
        ...currentItems,
        { ...product, id: product.id || product._id, quantity: quantityToAdd },
      ];
    });
  };

  const increaseQuantity = (productId, size = "", color = "") =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId &&
        (item.size || "") === size &&
        (item.color || "") === color
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  const decreaseQuantity = (productId, size = "", color = "") =>
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId &&
        (item.size || "") === size &&
        (item.color || "") === color
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item,
      ),
    );
  const removeFromCart = (productId, size = "", color = "") =>
    setCartItems((items) =>
      items.filter(
        (item) =>
          !(
            item.id === productId &&
            (item.size || "") === size &&
            (item.color || "") === color
          ),
      ),
    );
  const clearCart = () => setCartItems([]);
  const cartCount = useMemo(
    () =>
      cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems],
  );
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
