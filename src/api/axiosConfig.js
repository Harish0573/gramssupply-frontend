import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",  headers: {
    "Content-Type": "application/json",
  },
});

// send the login token with every request, if the customer is signed in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// turns an axios error into a message we can show on screen
export function errorMessage(
  err,
  fallback = "Something went wrong. Please try again.",
) {
  const data = err.response?.data;
  if (!err.response) return "Cannot reach the server. Is the backend running?";
  if (typeof data?.error === "string") return data.error;
  // validation errors come back as { fieldName: "message" }
  if (data && typeof data === "object") {
    const first = Object.values(data)[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}

export default api;
