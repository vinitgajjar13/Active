import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginRequest } from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "school-whatsapp-auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!token) {
        if (!cancelled) {
          setInitializing(false);
        }
        return;
      }

      try {
        const response = await getCurrentUser(token);
        if (!cancelled) {
          setUser(response.user);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        if (!cancelled) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(email, password) {
    const response = await loginRequest({ email, password });
    localStorage.setItem(STORAGE_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      login,
      logout,
    }),
    [token, user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
