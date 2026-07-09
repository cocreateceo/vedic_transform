"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface Entitlement {
  isPremium: boolean;
  plan: "free" | "premium";
  loading: boolean;
}

/**
 * Fetches the current user's subscription entitlement once on mount. On any
 * failure (incl. 401 on public surfaces) it resolves to the free tier rather
 * than throwing, so callers can gate UI without error handling. The async
 * setState lives in a `.then`, not the effect body, so no cascading-render
 * warning.
 */
export function useEntitlement(): Entitlement {
  const [state, setState] = useState<Entitlement>({
    isPremium: false,
    plan: "free",
    loading: true,
  });

  useEffect(() => {
    let active = true;
    apiFetch("/data/subscription")
      .then((d) => {
        if (!active) return;
        setState({
          isPremium: Boolean(d?.isPremium),
          plan: d?.plan === "premium" ? "premium" : "free",
          loading: false,
        });
      })
      .catch(() => {
        if (active) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
