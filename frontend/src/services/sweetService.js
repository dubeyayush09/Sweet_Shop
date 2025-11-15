import axios from "axios";

export const getAllSweets = () => axios.get("/api/sweets");

export const searchSweets = (query) =>
  axios.get(`/api/sweets/search?name=${query}`);

export const purchaseSweet = (id) => axios.post(`/api/sweets/${id}/purchase`);

export const createSweet = async (sweet) => {
  return axios.post("/api/sweets", sweet);
};
