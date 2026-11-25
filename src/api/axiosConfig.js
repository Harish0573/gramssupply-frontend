
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://gramsupply-backend-1.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Send login token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jr_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API errors
export function errorMessage(
  err,
  fallback = "Something went wrong. Please try again."
) {
  const data = err.response?.data;

  if (!err.response) {
    return "Cannot reach the server. Is the backend running?";
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (data && typeof data === "object") {
    const first = Object.values(data)[0];

    if (typeof first === "string") {
      return first;
    }
  }

  return fallback;
}

export default api;
