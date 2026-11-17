import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config/api";
import { AuthContext } from "./authValue";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export function AuthProvider({ children }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const login = useCallback((data) => {
    try {
      localStorage.removeItem("edubits_temp_user");
    } catch {
      // ignore
    }
    setUser(data.user);
    setShowOnboarding(Boolean(data.user && !data.user.onboardingCompleted));
  }, []);

  const tempLogin = useCallback(async (role = "user") => {
    if (!isLocalhost) return null;
    try {
      const email = role === "admin" ? "admin@edubits.io" : "demo@edubits.io";
      const password = "Password12345!";
      let res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // If demo user does not exist yet on this backend, automatically register it
      if (res.status === 401 || res.status === 404) {
        const regRes = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: role === "admin" ? "Admin User" : "Demo User",
            email,
            password,
          }),
        });
        if (regRes.ok) {
          res = regRes;
        }
      }

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
      console.warn("Backend 1-click login attempt failed:", err);
    }

    // Fallback if backend is completely offline
    const demoUser = {
      _id: "demo-user-id",
      id: "demo-user-id",
      name: "Ranbir Singh",
      email: "demo@edubits.io",
      role: role,
      avatar: "/images/favicon.png",
      totalScore: 280,
      onboardingCompleted: true,
    };
    try {
      localStorage.setItem("edubits_temp_user", JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    setUser(demoUser);
    setShowOnboarding(false);
    return demoUser;
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
    setUser((currentUser) => (currentUser ? { ...currentUser, totalScore } : currentUser));
  }, []);

  const completeOnboarding = useCallback(() => {
    setUser((currentUser) => (currentUser ? { ...currentUser, onboardingCompleted: true } : currentUser));
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    let active = true;
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
        } else if (isLocalhost) {
          try {
            const saved = localStorage.getItem("edubits_temp_user");
            if (saved) {
              setUser(JSON.parse(saved));
              setShowOnboarding(false);
              return;
            }
          } catch {
            // ignore
          }
          setUser(null);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (!active) return;
        if (isLocalhost) {
          try {
            const saved = localStorage.getItem("edubits_temp_user");
            if (saved) {
              setUser(JSON.parse(saved));
              setShowOnboarding(false);
              return;
            }
          } catch {
            // ignore
          }
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
    <AuthContext.Provider value={{ user, setUser, login, logout, tempLogin, updateScore, completeOnboarding, showOnboarding, setShowOnboarding, authReady, isLocalhost }}>
      {children}
    </AuthContext.Provider>
  );
}
