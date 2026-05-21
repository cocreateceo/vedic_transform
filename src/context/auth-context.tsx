"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { ANON_DOSHA_KEY } from "@/lib/dosha";

async function claimAnonymousDosha(token: string) {
  if (typeof window === "undefined") return;
  let id: string | null = null;
  try {
    id = localStorage.getItem(ANON_DOSHA_KEY);
  } catch {
    return;
  }
  if (!id) return;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const fetchRes = await fetch(
      `${apiUrl}/data/dosha-test/anonymous?id=${encodeURIComponent(id)}`,
    );
    if (!fetchRes.ok) return;
    const result = await fetchRes.json();
    if (!result?.primary || !result?.secondary) return;

    await fetch(`${apiUrl}/data/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        doshaType: result.primary,
        doshaSecondary: result.secondary,
        doshaScores: result.scores,
        doshaAssessedAt: new Date().toISOString(),
      }),
    });
    try {
      localStorage.removeItem(ANON_DOSHA_KEY);
    } catch {
      // ignored
    }
  } catch {
    // Silent — claim failures don't block signup.
  }
}

interface User {
  id: string;
  email: string;
  name?: string;
  onboardingCompleted?: boolean;
  role?: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string; isNew?: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("vedic-token");
    const savedUser = localStorage.getItem("vedic-user");
    if (!savedToken || !savedUser) {
      setIsLoading(false);
      return;
    }

    // Hydrate the UI optimistically from cached values, then verify the token
    // against the server. If it's been revoked or has expired, the API returns
    // 401 and apiFetch clears localStorage — we then drop the in-memory state
    // so route guards stop rendering authenticated views.
    setToken(savedToken);
    try { setUser(JSON.parse(savedUser)); } catch { /* ignore */ }

    apiFetch("/auth/me", { token: savedToken })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("vedic-user", JSON.stringify(data.user));
          // If the user took the public dosha test in another tab/session
          // and only now opened the app while already signed in, attach
          // that result to their profile. Claim function no-ops if the
          // localStorage key is empty, so this is cheap to call every restore.
          void claimAnonymousDosha(savedToken);
        }
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          setUser(null);
          setToken(null);
        }
        // Network errors leave the optimistic state alone — better UX offline.
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("vedic-token", data.token);
        localStorage.setItem("vedic-user", JSON.stringify(data.user));
        // Match register / Google flows: a returning user who took the
        // public dosha test before signing in shouldn't lose that result.
        void claimAnonymousDosha(data.token);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("vedic-token", data.token);
        localStorage.setItem("vedic-user", JSON.stringify(data.user));

        // If the user took the public dosha test before signing up, claim
        // that result and attach it to their new profile. Fire-and-forget
        // so a failure here doesn't break the signup flow. (P0-4)
        void claimAnonymousDosha(data.token);

        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("vedic-token", data.token);
        localStorage.setItem("vedic-user", JSON.stringify(data.user));

        // If this Google account was created just now and the user had
        // taken the public dosha test, attach that result — same as the
        // password-register flow does.
        if (!data.user.onboardingCompleted) {
          void claimAnonymousDosha(data.token);
        }

        return { success: true, isNew: !data.user.onboardingCompleted };
      }
      return { success: false, error: data.error || "Google sign-in failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("vedic-token");
    localStorage.removeItem("vedic-user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
