import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("/api/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
