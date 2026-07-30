"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

const REGIONS = [
  { value: "india", label: "India (IST)" },
  { value: "us-eastern", label: "US — Eastern" },
  { value: "us-central", label: "US — Central" },
  { value: "us-pacific", label: "US — Pacific / Mountain" },
  { value: "uk-europe", label: "UK / Europe" },
  { value: "middle-east", label: "Middle East (Gulf)" },
  { value: "southeast-asia", label: "Southeast Asia / Singapore" },
  { value: "australia-nz", label: "Australia / New Zealand" },
  { value: "other", label: "Other" },
];

const SOURCES = [
  { value: "friend", label: "A friend or colleague" },
  { value: "social", label: "Social media" },
  { value: "search", label: "Search engine" },
  { value: "email", label: "Email / newsletter" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-base";

const labelClass = "block text-sm font-medium text-[#475569] mb-1.5";

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [source, setSource] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans never see it
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email address");
    setSubmitting(true);
    try {
      await apiFetch("/class-registration", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, region, source, referredBy, website }),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white shadow-xl shadow-black/20 p-8 sm:p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="mt-4 text-xl font-semibold">You&rsquo;re in!</h3>
        <p className="mt-2 text-base text-[#64748b] leading-relaxed">
          The cohort starts Monday, August 17, 2026. We&rsquo;ll email you the
          joining and payment details before we begin.
        </p>
        <p className="mt-4 text-base text-[#64748b]">
          Meanwhile, you can start the free self-paced course today:
        </p>
        <Link
          href="/register"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
        >
          Explore the course <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white shadow-xl shadow-black/20 p-7 sm:p-10 space-y-4"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold">Reserve Your Seat</h2>
        <p className="mt-1 text-sm text-[#64748b]">
          $399 · Starts Monday, August 17, 2026
        </p>
        <p className="mt-1 text-xs text-[#94a3b8]">
          Refer friends and save $100 each · service-exchange discounts too
        </p>
      </div>
      <div>
        <label htmlFor="reg-name" className={labelClass}>
          Full name *
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
          placeholder="Your full name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-email" className={labelClass}>
          Email address *
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@email.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-phone" className={labelClass}>
          Phone (optional, with country code)
        </label>
        <input
          id="reg-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-region" className={labelClass}>
          Where will you join from?
        </label>
        <select
          id="reg-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a region…</option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="reg-source" className={labelClass}>
          How did you hear about us?
        </label>
        <select
          id="reg-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={inputClass}
        >
          <option value="">Select one…</option>
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reg-referred-by" className={labelClass}>
          Referred by a friend? Their email (optional)
        </label>
        <input
          id="reg-referred-by"
          type="email"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          placeholder="friend@email.com"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-[#94a3b8]">
          They save $100 off their fee for every friend who joins — 4 referrals
          and their seat is free.
        </p>
      </div>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="reg-website">Website</label>
        <input
          id="reg-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error && <p className="text-base text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Registering…
          </>
        ) : (
          <>
            Reserve My Seat <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
      <p className="text-xs text-[#94a3b8] text-center">
        No payment due today — we&rsquo;ll email you the payment and discount
        details after you register.
      </p>
    </form>
  );
}
