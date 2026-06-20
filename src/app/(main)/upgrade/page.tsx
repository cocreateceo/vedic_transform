"use client";

import { useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { useEntitlement } from "@/lib/use-entitlement";

const BENEFITS = [
  "Unlimited guided audio & body-scan sessions",
  "Dosha-personalized daily practices",
  "Full Sutra Book export at Day 48",
  "Priority Vedic Guide responses",
];

export default function UpgradePage() {
  const { isPremium, loading } = useEntitlement();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const upgrade = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const r = await apiFetch("/data/subscription/checkout", { method: "POST" });
      if (r?.url) {
        window.location.href = r.url;
        return;
      }
      setMessage("Checkout started.");
    } catch (e) {
      if (e instanceof ApiError && e.status === 501) {
        setMessage("Premium is coming soon — checkout isn't wired up yet.");
      } else {
        setMessage(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Vedic Premium
          </h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Go deeper into your 48-day transformation.
          </p>
        </div>
      </div>

      <div className="glass-card space-y-5 p-6 md:p-8">
        {isPremium && !loading ? (
          <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
            You&apos;re already a Premium member 🙏
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <span className="text-[var(--color-text-primary)]">{b}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={upgrade}
              disabled={busy || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Starting checkout…" : "Upgrade to Premium"}
            </button>

            {message && (
              <p className="text-center text-sm text-[var(--color-text-secondary)]">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
