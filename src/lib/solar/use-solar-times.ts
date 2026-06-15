"use client";

import { useCallback, useEffect, useState } from "react";
import { getSunTimes, type SunTimes } from "./sun-times";

const COORDS_KEY = "vedic-coords-v1";

interface Coords {
  lat: number;
  lng: number;
}

export type SolarStatus = "idle" | "locating" | "ready" | "denied" | "unsupported";

export interface UseSolarTimes {
  status: SolarStatus;
  sunTimes: SunTimes | null;
  /** Re-request geolocation (e.g. from a "use my location" button). */
  request: () => void;
}

function readCachedCoords(): Coords | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COORDS_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the user's local sun times for *today*. Uses cached coordinates
 * immediately when present, and (re)requests geolocation on demand. Never
 * throws — surfaces failure via `status` so the UI can offer a manual path.
 */
export function useSolarTimes(): UseSolarTimes {
  const [status, setStatus] = useState<SolarStatus>("idle");
  const [coords, setCoords] = useState<Coords | null>(() => readCachedCoords());

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(next);
        try {
          window.localStorage.setItem(COORDS_KEY, JSON.stringify(next));
        } catch {}
        setStatus("ready");
      },
      () => setStatus("denied"),
      { maximumAge: 1000 * 60 * 60, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    if (coords && status === "idle") setStatus("ready");
  }, [coords, status]);

  const sunTimes = coords ? getSunTimes(new Date(), coords.lat, coords.lng) : null;

  return { status, sunTimes, request };
}
