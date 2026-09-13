import api from "./api";

export const getProductsApi = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductByIdApi = async (productId) => {
  const response = await api.get(`/products/${productId}`);

  return response.data;
};

export const getSearchSuggestionsApi = async (query) => {
  const response = await api.get("/products/suggestions", {
    params: { q: query },
  });

  return response.data;
};



export const createProductApi = async (productData) => {
  const response = await api.post("/products", productData);

  return response.data;
};

export const updateProductApi = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);

  return response.data;
};

export const deleteProductApi = async (productId) => {
  const response = await api.delete(`/products/${productId}`);

  return response.data;
};
