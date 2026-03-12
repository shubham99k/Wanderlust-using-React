import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import React from "react";
import { api } from "../utils/api";
import "./ColdStartBanner.css";

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

  const [showColdMsg, setShowColdMsg] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setShowColdMsg(true), 3000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading) {
    return (
      <div className="cold-start-screen">
        <div className="spinner" />
        <p className="cold-start-screen__text">Connecting to server…</p>
        {showColdMsg && (
          <div className="cold-start-banner anim-fade-in">
            <span className="cold-start-banner__icon">ℹ️</span>
            <p>
              Our backend is hosted on Render's free tier and sleeps after
              inactivity. It's waking up now — this may take
              <strong> 40–60 seconds</strong>. Thanks for your patience!
            </p>
          </div>
        )}
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
