import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import React from "react";
import { api } from "../utils/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [flash, setFlash] = useState(null); // { message, type }
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    api
      .getMe()
      .then((user) => {
        if (user) setCurrentUser(user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showFlash = useCallback((message, type = "success") => {
    setFlash({ message, type });
  }, []);

  const clearFlash = useCallback(() => setFlash(null), []);

  const login = useCallback((user) => setCurrentUser(user), []);

  const logout = useCallback(() => {
    api.logout().catch(() => {});
    setCurrentUser(null);
    showFlash("Logged out successfully. See you soon!");
  }, [showFlash]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{ currentUser, login, logout, flash, showFlash, clearFlash }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
