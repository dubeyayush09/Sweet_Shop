import axios from "axios";

export const getAllSweets = () => axios.get("/api/sweets");

export const searchSweets = (query) =>
  axios.get(`/api/sweets/search?name=${query}`);

export const purchaseSweet = (id) => axios.post(`/api/sweets/${id}/purchase`);

export const createSweet = async (sweet) => {
  return axios.post("/api/sweets", sweet);
};

export const getSweetById = (id) => axios.get(`/api/sweets/${id}`);
export const updateSweet = (id, sweet) => axios.put(`/api/sweets/${id}`, sweet);
export const restockSweet = (id, amount) =>
  axios.post(`/api/sweets/${id}/restock`, { amount });
