"use client";

import { useSyncExternalStore } from "react";

const CONSENT_COOKIE = "vedic-cookie-consent";
const CHANGE_EVENT = "cookie-consent-changed";

function hasConsentCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/**
 * Tracks whether the user has resolved the cookie banner (either "Accept All"
 * or "Necessary Only"). Other bottom-pinned fixed UI — notably the chat FAB —
 * subscribes to this so it can stay hidden while the consent banner is the only
 * thing the user should be acting on, preventing the mobile stack-overlap where
 * the FAB floated on top of the consent text (UX1).
 *
 * Reads the cookie synchronously via `useSyncExternalStore` (no setState-in-
 * effect) and re-reads whenever the banner dispatches `cookie-consent-changed`.
 * The server snapshot is `true` so returning users never see the FAB flash out;
 * a first-time visitor (no cookie) re-renders to `false` right after hydration.
 */
export function useCookieConsentResolved(): boolean {
  return useSyncExternalStore(subscribe, hasConsentCookie, () => true);
}
