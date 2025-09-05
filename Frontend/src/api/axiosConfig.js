import axios from "axios";

const api = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/http://13.234.123.100:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
