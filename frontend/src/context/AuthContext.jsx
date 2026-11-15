import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config/api";
import { AuthContext } from "./authValue";

export function AuthProvider({ children }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const login = useCallback((data) => {
    try {
      localStorage.removeItem("edubits_temp_user");
    } catch (e) {
      console.warn("Could not clean temp user:", e);
    }
    setUser(data.user);
    setShowOnboarding(Boolean(data.user && !data.user.onboardingCompleted));
  }, []);

  const tempLogin = useCallback(async (role = "user") => {
    try {
      const email = role === "admin" ? "admin@edubits.io" : "demo@edubits.io";
      const password = "Password12345!";
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.removeItem("edubits_temp_user");
        } catch {
          // ignore
        }
        setUser(data.user);
        setAuthReady(true);
        setShowOnboarding(Boolean(data.user && !data.user.onboardingCompleted));
        return data.user;
      }
    } catch (err) {
      console.warn("Hosted backend login attempt failed, falling back to offline demo:", err);
    }

    // Fallback if hosted backend is completely offline
    const fallbackUser = {
      _id: "temp-demo-id",
      id: "temp-demo-id",
      name: "Ranbir Singh",
      email: "ranbir@edubits.io",
      role: role,
      avatar: "/images/favicon.png",
      totalScore: 280,
      onboardingCompleted: true,
    };
    try {
      localStorage.setItem("edubits_temp_user", JSON.stringify(fallbackUser));
    } catch (e) {
      console.warn("Could not persist temp user:", e);
    }
    setUser(fallbackUser);
    setAuthReady(true);
    setShowOnboarding(false);
    return fallbackUser;
  }, []);

  const logout = useCallback(() => {
    fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("edubits_temp_user");
    } catch {
      // ignore
    }
    setUser(null);
    setShowOnboarding(false);
  }, []);

  const updateScore = useCallback((totalScore) => {
    setUser((currentUser) => currentUser ? { ...currentUser, totalScore } : currentUser);
  }, []);

  const completeOnboarding = useCallback(() => {
    setUser((currentUser) => currentUser ? { ...currentUser, onboardingCompleted: true } : currentUser);
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    let active = true;

    // Check if real session exists on backend
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          try {
            localStorage.removeItem("edubits_temp_user");
          } catch {
            // ignore
          }
          setUser(data.user);
          setShowOnboarding(Boolean(!data.user.onboardingCompleted));
        } else {
          // Check if there was an offline fallback user
          try {
            const savedTemp = localStorage.getItem("edubits_temp_user");
            if (savedTemp) {
              const parsed = JSON.parse(savedTemp);
              setUser(parsed);
              setShowOnboarding(false);
              return;
            }
          } catch {
            // ignore
          }
          setUser(null);
        }
      })
      .catch(() => {
        if (!active) return;
        try {
          const savedTemp = localStorage.getItem("edubits_temp_user");
          if (savedTemp) {
            setUser(JSON.parse(savedTemp));
            return;
          }
        } catch {
          // ignore
        }
        setUser(null);
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, tempLogin, updateScore, completeOnboarding, showOnboarding, setShowOnboarding, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}
