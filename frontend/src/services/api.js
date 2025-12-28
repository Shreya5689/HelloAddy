import axios from "axios";

const api = axios.create({
  baseURL: "/", // Vite proxy will handle /auth → backend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
