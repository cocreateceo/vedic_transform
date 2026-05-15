import { useCallback } from "react";
import { useAuth, API_BASE } from "./useAuth";

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Thin auth-aware wrapper around fetch for the Vedic API. Same shape as
 * src/lib/api.ts on the web. Returns `{ data, error }` so callers can
 * pattern-match without try/catch boilerplate.
 */
export function useApi() {
  const { token } = useAuth();

  const request = useCallback(
    async <T = unknown>(
      path: string,
      options: ApiOptions = {},
    ): Promise<{ data?: T; error?: string; status?: number }> => {
      try {
        const headers: Record<string, string> = { ...options.headers };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (options.body && !headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }

        const res = await fetch(`${API_BASE}${path}`, {
          method: options.method || "GET",
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return {
            error: (data as any)?.error || `Request failed (${res.status})`,
            status: res.status,
          };
        }
        return { data: data as T, status: res.status };
      } catch {
        return { error: "Network error. Please check your connection." };
      }
    },
    [token],
  );

  return { request };
}
