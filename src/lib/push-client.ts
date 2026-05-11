// Frontend Web Push helper. Wraps the browser's PushManager + Notification
// permission flow and hands subscriptions to /data/push/subscribe.

import { apiFetch } from "@/lib/api";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/** True only on installed iOS PWAs — required for Web Push on iOS Safari. */
export function isIosStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const standalone =
    (window.navigator as any).standalone === true ||
    window.matchMedia?.("(display-mode: standalone)").matches;
  return isIos && standalone;
}

/** True on iOS but not yet installed to home screen. */
export function isIosNotInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  return isIos && !isIosStandalone();
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  // The app registers /sw.js elsewhere. Try `ready` (resolves once active),
  // then fall back to a direct register.
  try {
    return await navigator.serviceWorker.ready;
  } catch {
    try {
      return await navigator.serviceWorker.register("/sw.js");
    } catch {
      return null;
    }
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function pushSubscriptionToBackendPayload(sub: PushSubscription) {
  const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  return {
    endpoint: json.endpoint || sub.endpoint,
    keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };
}

export interface SubscribeResult {
  ok: boolean;
  reason?: "unsupported" | "denied" | "no-vapid-key" | "error" | "ios-not-installed";
  error?: string;
}

/** Request permission (if needed) and subscribe with the backend. */
export async function subscribeToPush(): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };
  if (!VAPID_PUBLIC_KEY) return { ok: false, reason: "no-vapid-key" };
  if (isIosNotInstalled()) return { ok: false, reason: "ios-not-installed" };

  // Permission gate.
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return { ok: false, reason: "denied" };

  const reg = await getRegistration();
  if (!reg) return { ok: false, reason: "error", error: "Service worker not available" };

  // Reuse an existing subscription if one exists; otherwise create.
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // The DOM lib's BufferSource type is overly strict in newer TS —
        // a plain Uint8Array is fine at runtime.
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
      });
    } catch (e: any) {
      return { ok: false, reason: "error", error: e?.message || String(e) };
    }
  }

  try {
    await apiFetch("/data/push/subscribe", {
      method: "POST",
      body: JSON.stringify(pushSubscriptionToBackendPayload(sub)),
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, reason: "error", error: e?.message || String(e) };
  }
}

/** Unsubscribe locally and tell the backend to forget us. */
export async function unsubscribeFromPush(): Promise<{ ok: boolean }> {
  if (!isPushSupported()) return { ok: true };
  const reg = await getRegistration();
  if (!reg) return { ok: true };
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return { ok: true };

  const endpoint = sub.endpoint;
  try {
    await sub.unsubscribe();
  } catch {
    // Browser may refuse; we still ask the backend to forget us so push
    // attempts won't keep firing.
  }
  try {
    await apiFetch("/data/push/subscribe", {
      method: "DELETE",
      body: JSON.stringify({ endpoint }),
    });
  } catch {
    // Non-fatal — the dead endpoint will be reaped on first send anyway.
  }
  return { ok: true };
}

export async function sendTestPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await apiFetch("/data/push/test", { method: "POST" });
    if (res?.success) return { ok: true };
    return { ok: false, error: res?.error || "Test failed" };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

/** Returns the user's IANA timezone for prefilling reminder settings. */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
