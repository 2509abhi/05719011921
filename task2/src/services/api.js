import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchProducts = (category, params) => {
  return axios.get(`${API_URL}/categories/${category}/products`, { params });
};

export const fetchProductDetails = (category, productId) => {
  return axios.get(`${API_URL}/categories/${category}/products/${productId}`);
};
