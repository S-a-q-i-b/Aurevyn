import api from "./api";

export const createOrderApi = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get("/orders/my");

  return response.data;
};

export const getOrderByIdApi = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data;
};
