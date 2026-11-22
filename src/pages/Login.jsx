import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/axiosConfig";
import "./Account.css";

function Login() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from || "/account";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    identifier: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to={goTo} replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (form.name.trim().length < 2) return setError("Enter your name");
      if (!/^[6-9]\d{9}$/.test(form.phone))
        return setError("Enter a 10 digit mobile number");
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
        return setError("This email doesn't look right");
      if (form.password.length < 6)
        return setError("Password needs at least 6 characters");
      if (form.password !== form.confirm)
        return setError("Passwords do not match");
    } else if (!form.identifier || !form.password) {
      return setError("Enter your mobile number or email and password");
    }

    setBusy(true);
    try {
      if (mode === "register") {
        await register({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await login(form.identifier, form.password);
      }
      navigate(goTo, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "on" : ""}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "register" ? "on" : ""}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Create account
            </button>
          </div>

          {mode === "register" ? (
            <>
              <label>
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  autoComplete="name"
                />
              </label>
              <label>
                Mobile number
                <input
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                />
              </label>
              <label>
                Email (optional)
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={change}
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirm password
                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={change}
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Mobile number or email
                <input
                  name="identifier"
                  value={form.identifier}
                  onChange={change}
                  autoComplete="username"
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={change}
                  autoComplete="current-password"
                />
              </label>
            </>
          )}

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" disabled={busy}>
            {busy
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create my account"}
          </button>
          <p className="auth-switch">
            {mode === "login"
              ? "New to GramSupply?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>
      </main>
    </>
  );
}

export default Login;
