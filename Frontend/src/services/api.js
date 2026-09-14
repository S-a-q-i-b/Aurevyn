import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "").endsWith("/api")
    ? configuredApiUrl.replace(/\/+$/, "")
    : `${configuredApiUrl.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
