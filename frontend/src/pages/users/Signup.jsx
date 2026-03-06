import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./Auth.css";

export default function Signup({ onNavigate }) {
  const { login, showFlash } = useApp();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
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
      const user = await api.signup(form);
      login(user);
      showFlash(`Account created! Welcome, ${user.username}!`);
      onNavigate("home");
    } catch (err) {
      showFlash(err.message || "Signup failed. Please try again.", "error");
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
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__sub">
          Join thousands of hosts sharing their spaces.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="su-user">
              Username
            </label>
            <input
              id="su-user"
              className="form-input"
              placeholder="your_username"
              autoComplete="username"
              value={form.username}
              onChange={set("username")}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="su-email">
              Email
            </label>
            <input
              id="su-email"
              className="form-input"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="su-pw">
              Password
            </label>
            <input
              id="su-pw"
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              autoComplete="new-password"
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
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <button
            className="auth-card__switch"
            onClick={() => onNavigate("login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
