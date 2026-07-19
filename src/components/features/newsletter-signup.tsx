"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({
  source,
  compact = false,
  variant = "dark",
}: {
  source: "footer" | "blog" | "landing";
  compact?: boolean;
  variant?: "dark" | "light";
}) {
  const onLight = variant === "light";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await apiFetch("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email, source }),
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError && err.status === 400
          ? "Please enter a valid email address."
          : "Something went wrong — please try again.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 ${compact ? "py-2" : "py-3"}`}>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/15 border border-green-500/30">
          <Check className="w-4 h-4 text-green-400" />
        </span>
        <p className={`text-sm ${onLight ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
          You&apos;re in. One quiet letter a week — wisdom, no noise.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <div className="mb-3">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${onLight ? "text-[#1a1a1a]" : "text-white"}`}>
            <Mail className="w-4 h-4 text-orange-400" />
            The Weekly Sankalpa
          </h3>
          <p className={`mt-1 text-sm ${onLight ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
            One letter a week — a practice, a verse, and the science behind it.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md" noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          required
          placeholder="your@email.com"
          aria-label="Email address"
          className={`flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors ${onLight ? "bg-white border border-[#FF9933]/25 text-[#1a1a1a] placeholder-[#94a3b8]" : "bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#64748b]"}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-default whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
