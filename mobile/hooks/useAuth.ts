import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";

// Production API URL — set via EXPO_PUBLIC_API_URL in .env.local for dev
// against a different stage.
const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://sav5ro38xi.execute-api.us-east-1.amazonaws.com";

const TOKEN_KEY = "vedic_jwt";
const USER_KEY = "vedic_user";

export interface VedicUser {
  id: string;
  email: string;
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  onboardingCompleted?: boolean;
  doshaType?: "vata" | "pitta" | "kapha" | null;
  doshaSecondary?: "vata" | "pitta" | "kapha" | null;
}

interface AuthState {
  user: VedicUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

async function callJson(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${API_BASE}${path}`, init);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  // Hydrate from secure storage on mount, then verify the token against the
  // server. If the token has been revoked or has expired, clear state so the
  // root layout redirects to /(auth)/login.
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userStr = await SecureStore.getItemAsync(USER_KEY);
        if (!token || !userStr) {
          setState({ token: null, user: null, loading: false });
          return;
        }
        const cached = JSON.parse(userStr) as VedicUser;
        setState({ token, user: cached, loading: false });

        // Background-verify the token. 401 → drop state.
        const { ok, status, data } = await callJson("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ok && data?.user) {
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));
          setState({ token, user: data.user, loading: false });
        } else if (status === 401) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
          setState({ token: null, user: null, loading: false });
        }
        // Network errors leave the cached state alone — better offline UX.
      } catch {
        setState({ token: null, user: null, loading: false });
      }
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const { ok, data } = await callJson("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!ok || !data?.success) return { error: data?.error || "Login failed" };
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));
        setState({ token: data.token, user: data.user, loading: false });
        return {};
      } catch {
        return { error: "Network error. Please try again." };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name?: string,
    ): Promise<{ error?: string }> => {
      try {
        const { ok, data } = await callJson("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        if (!ok || !data?.success) {
          return { error: data?.error || "Registration failed" };
        }
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));
        setState({ token: data.token, user: data.user, loading: false });
        return {};
      } catch {
        return { error: "Network error. Please try again." };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setState({ token: null, user: null, loading: false });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) return;
    const { ok, data } = await callJson("/auth/me", {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (ok && data?.user) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));
      setState((prev) => ({ ...prev, user: data.user }));
    }
  }, [state.token]);

  return { ...state, login, register, logout, refreshUser };
}

export { AuthContext, API_BASE };
