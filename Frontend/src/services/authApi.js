import api from "./api";

export const registerApi = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginApi = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getWishlistApi = async () => {
  const response = await api.get("/auth/wishlist");
  return response.data;
};

export const toggleWishlistApi = async (productId) => {
  const response = await api.patch(`/auth/wishlist/${productId}`);
  return response.data;
};
