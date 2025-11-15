import axios from "axios";

export const getAllSweets = () => {
  return axios.get("/api/sweets");
};
