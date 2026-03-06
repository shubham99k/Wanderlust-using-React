import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./Auth.css";

export default function Login({ onNavigate }) {
  const { login, showFlash } = useApp();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(form);
      login(user);
      showFlash(`Welcome back, ${user.username}!`);
      onNavigate("home");
    } catch (err) {
      showFlash(err.message || "Invalid username or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page anim-fade-in">
      <div className="auth-card">
        <div className="auth-card__logo">
          {/* <span className="auth-card__logo-pin">⌂</span> */}
          Wanderlust
        </div>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__sub">
          Log in to manage your listings and reviews.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-user">
              Username
            </label>
            <input
              id="login-user"
              className="form-input"
              placeholder="your_username"
              autoComplete="username"
              value={form.username}
              onChange={set("username")}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-pw">
              Password
            </label>
            <input
              id="login-pw"
              className="form-input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={set("password")}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Logging in…" : "Log in →"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{" "}
          <button
            className="auth-card__switch"
            onClick={() => onNavigate("signup")}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
