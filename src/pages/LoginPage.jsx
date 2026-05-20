import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../lib/api";

export default function LoginPage() {
  const location = useLocation();
  const { token, login } = useAuth();
  const [form, setForm] = useState({
    email: "admin@school.com",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form.email, form.password);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">School WhatsApp Result System</p>
        <h1>Admin Login</h1>
        <p className="auth-copy">
          Sign in to manage WhatsApp QR authentication, Excel uploads, and bulk result delivery.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn-primary btn-primary--full" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footnote">API: {API_BASE_URL}</p>
      </div>
    </div>
  );
}
