"use client";

// Whether the rail is showing labels, shared between the rail itself and the
// content column that has to leave room for it.
//
// The preference is persisted, and reading it happens after mount so the
// server-rendered markup is the same for everyone. The rail transitions its
// width, so the one-frame correction reads as the panel settling rather than
// as a jump.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  RAIL_STORAGE_KEY,
  nextRailPreference,
  parseRailPreference,
  railCollapsed,
  type RailPreference,
} from "@/lib/nav-rail";

interface RailState {
  collapsed: boolean;
  toggle: () => void;
}

const RailContext = createContext<RailState | null>(null);

export function RailProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [preference, setPreference] = useState<RailPreference>("auto");

  useEffect(() => {
    try {
      setPreference(parseRailPreference(localStorage.getItem(RAIL_STORAGE_KEY)));
    } catch {
      // Private mode or a blocked store — "auto" is a fine answer.
    }
  }, []);

  const toggle = useCallback(() => {
    setPreference((current) => {
      const next = nextRailPreference(current, pathname);
      try {
        localStorage.setItem(RAIL_STORAGE_KEY, next);
      } catch {
        // Not persisting is survivable; not toggling is not.
      }
      return next;
    });
  }, [pathname]);

  return (
    <RailContext.Provider
      value={{ collapsed: railCollapsed(preference, pathname), toggle }}
    >
      {children}
    </RailContext.Provider>
  );
}

export function useRail(): RailState {
  const value = useContext(RailContext);
  if (!value) throw new Error("useRail must be used inside <RailProvider>");
  return value;
}
