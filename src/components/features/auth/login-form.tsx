"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { GoogleSignInButton } from "./google-signin-button";

// ── SVG Icons ──────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────

const EMAIL_PATTERN = "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}";

const quotes = [
  { text: "The body is your temple. Keep it pure and clean for the soul to reside in.", source: "B.K.S. Iyengar" },
  { text: "When you own your breath, nobody can steal your peace.", source: "Ancient Vedic Wisdom" },
  { text: "The secret of health for both mind and body is not to mourn for the past, not to worry about the future, but to live the present moment wisely.", source: "Buddha" },
];

// ── Main Component ──────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const { login, register, loginWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Allow `?tab=signup` to deep-link into the signup tab.
  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam === "signup") setActiveTab("signup");
  }, []);

  const inputClass =
    "w-full bg-white/60 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:shadow-[0_0_15px_rgba(255,153,51,0.1)] transition-all duration-300";

  // ── Handlers ────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      setSuccess("");
      setLoading(true);
      try {
        const result = await loginWithGoogle(credential);
        if (result.success) {
          setSuccess("Signed in with Google! Redirecting...");
          // New Google accounts skip onboarding-completed = need onboarding;
          // existing users go straight to dashboard.
          setTimeout(
            () => router.push(result.isNew ? "/onboarding" : "/dashboard"),
            800,
          );
        } else {
          setError(result.error || "Google sign-in failed");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogle, router],
  );

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPw = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirmPw) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await register(email, password, name);
      if (result.success) {
        setSuccess("Account created! Setting up your journey...");
        setTimeout(() => router.push("/onboarding"), 800);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────

  const headerSubtitle = activeTab === "login"
    ? "Continue your 48-day transformation journey"
    : "Begin your sacred transformation";

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl border-2 border-[#DAA520] shadow-[0_0_20px_rgba(255,215,0,0.15),0_8px_60px_rgba(255,153,51,0.12)] golden-top-accent">

        {/* ── Left Panel - Branding ────────────────────────────────── */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 border border-amber-300/20 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute top-16 right-16 w-20 h-20 border border-orange-300/15 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute bottom-20 left-10 w-24 h-24 border border-amber-400/15 rounded-full animate-[spin_35s_linear_infinite]" />
            {/* Floating dots */}
            {[
              "top-[15%] left-[20%]", "top-[30%] right-[25%]", "top-[60%] left-[15%]",
              "top-[45%] right-[10%]", "bottom-[25%] left-[35%]", "top-[20%] left-[60%]",
              "bottom-[40%] right-[30%]", "top-[75%] left-[50%]",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-1.5 h-1.5 bg-amber-400/30 rounded-full`}
                style={{ animation: `pulse ${2 + i * 0.3}s ease-in-out infinite alternate` }}
              />
            ))}
          </div>

          {/* Om symbol watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] text-amber-300/[0.08] select-none pointer-events-none">
            {"ॐ"}
          </div>

          {/* Logo & Brand */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c.5 2.5 2 4.5 2 7a4 4 0 0 1-8 0c0-2.5 1.5-4.5 2-7" />
                  <path d="M12 22v-4" />
                  <path d="M8 22h8" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent tracking-wide">
                  10X Vedic Transform
                </h2>
                <p className="text-xs text-amber-600/60 font-medium tracking-wider">48-DAY JOURNEY</p>
              </div>
            </Link>

            <p className="text-amber-700/40 text-sm mb-6 italic">
              || Transform your body, mind, and spirit ||
            </p>

            <h3 className="text-2xl font-bold text-gray-800 leading-snug mb-4">
              Unlock Your Sacred<br />Transformation
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Embark on an ancient Vedic journey that transforms every dimension of your being through 11 sacred pillars of wellness.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-4 my-8">
            {[
              { icon: "🔥", title: "11 Sacred Pillars", desc: "Morning rituals, breathwork, movement, meditation & more" },
              { icon: "🧘", title: "Daily Guided Sessions", desc: "Personalized routines with timers, music & voice guidance" },
              { icon: "🌟", title: "Track Your Progress", desc: "Mood tracking, journaling, achievements & AI insights" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 group">
                <span className="text-xl mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">{feature.icon}</span>
                <div>
                  <h4 className="text-gray-800 text-sm font-semibold">{feature.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="relative z-10 border-l-2 border-amber-400/40 pl-4 py-1">
            <p className="text-gray-500 text-sm italic leading-relaxed">
              &ldquo;{quotes[0].text}&rdquo;
            </p>
            <p className="text-amber-600/50 text-xs mt-1">&mdash; {quotes[0].source}</p>
          </div>
        </div>

        {/* ── Right Panel - Auth Form ──────────────────────────────── */}
        <div className="p-8 md:p-10 bg-white/80 backdrop-blur-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c.5 2.5 2 4.5 2 7a4 4 0 0 1-8 0c0-2.5 1.5-4.5 2-7" />
                <path d="M12 22v-4" />
                <path d="M8 22h8" />
              </svg>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              10X Vedic Transform
            </h2>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            {headerSubtitle}
          </p>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-amber-50/80 rounded-xl p-1 border border-amber-200/30">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                  setSuccess("");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className={`flex-1 py-2.5 text-center text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
              <ErrorIcon />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
              <SuccessIcon />
              {success}
            </div>
          )}

          {/* Google sign-in (works for both login + signup) */}
          <div className="space-y-3 mb-4">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              text={activeTab === "login" ? "signin_with" : "signup_with"}
              disabled={loading}
            />
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-amber-200/60" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-amber-200/60" />
            </div>
          </div>

          {/* Login Form */}
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  pattern={EMAIL_PATTERN}
                  title="Enter a valid email address"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : "Sign In"}
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setActiveTab("signup"); setError(""); setSuccess(""); }}
                  className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  pattern={EMAIL_PATTERN}
                  title="Enter a valid email address"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={8}
                    placeholder="Confirm your password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    required
                  />
                  <span>
                    I commit to my transformation and agree to the{" "}
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700">Terms</Link>
                    {" "}&{" "}
                    <Link href="/privacy" className="text-amber-600 hover:text-amber-700">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : "Start My Journey"}
              </button>

              <p className="text-center text-gray-400 text-xs mt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
                  className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
