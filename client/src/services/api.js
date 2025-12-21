import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL,
=======
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
>>>>>>> b98a6a7 (Fix production API routing and finalize deployment-ready build)
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
