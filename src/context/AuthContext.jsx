import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

const TOKEN_KEY = "jr_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while we check a saved token, so pages don't flash the login screen
  const [loading, setLoading] = useState(
    () => !!localStorage.getItem(TOKEN_KEY),
  );

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        // only forget the token if the server said it is invalid
        if (err.response?.status === 401) localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  // small copy of the customer details, used when saving wishlist items to the database
  useEffect(() => {
    if (user) localStorage.setItem("jr_user_info", JSON.stringify({ customerId: user.customerId, name: user.name, phone: user.phone }));
    else if (!loading) localStorage.removeItem("jr_user_info");
  }, [user, loading]);

  async function register({ name, phone, email, password }) {
    const res = await api.post("/auth/register", {
      name,
      phone,
      email,
      password,
    });
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.customer);
  }

  async function login(identifier, password) {
    const res = await api.post("/auth/login", { identifier, password });
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.customer);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // token may already be expired, nothing to do
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  async function updateProfile(changes) {
    const res = await api.put("/auth/me", { ...user, ...changes });
    setUser(res.data);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
