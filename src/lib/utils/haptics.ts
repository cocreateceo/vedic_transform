// Small client-side feedback helpers shared across guided sessions.
// Both are best-effort and silently no-op when unsupported (desktop, no
// AudioContext, reduced-motion, etc.) — callers never need to guard.

/** Light haptic tap, e.g. one mala bead. No-ops where vibration is unsupported. */
export function hapticTap(durationMs = 12): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(durationMs);
  } catch {
    /* ignore */
  }
}

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (sharedCtx) return sharedCtx;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedCtx = new Ctor();
  } catch {
    return null;
  }
  return sharedCtx;
}

/**
 * Soft wooden-bead "click" — a short, low sine pluck with a fast decay.
 * Used for each mala count tap so the practice feels tactile.
 */
export function playBeadClick(): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    /* ignore */
  }
}
