import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { token, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-card--compact">
          <p className="auth-eyebrow">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
