import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getWishlistApi, toggleWishlistApi } from "../services/authApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = "aurevyn_wishlist";

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlistItems]);

  useEffect(() => {
    let active = true;
    if (!user) return undefined;
    getWishlistApi()
      .then((response) => {
        if (active && response?.success)
          setWishlistItems(
            (response.products || []).map((product) => ({
              ...product,
              id: product._id,
            })),
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.id]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => String(item.id || item._id) === String(productId),
    );
  };

  const addToWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const productId = product.id || product._id;

      const alreadyExists = currentItems.some(
        (item) => String(item.id || item._id) === String(productId),
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          ...product,
          id: productId,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id || item._id) !== String(productId),
      ),
    );
  };

  const toggleWishlist = (product) => {
    const productId = product.id || product._id;

    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) => String(item.id || item._id) === String(productId),
      );
      return exists
        ? currentItems.filter(
            (item) => String(item.id || item._id) !== String(productId),
          )
        : [...currentItems, { ...product, id: productId }];
    });

    if (user) {
      toggleWishlistApi(productId).catch((error) =>
        console.warn("Wishlist sync failed:", error?.message),
      );
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};
