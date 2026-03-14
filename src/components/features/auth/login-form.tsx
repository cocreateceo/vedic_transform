"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

// ── SVG Icons ──────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

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

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
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

type AuthView = "login" | "signup" | "verify" | "forgot-email" | "forgot-code" | "forgot-success";

const EMAIL_PATTERN = "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}";

const quotes = [
  { text: "The body is your temple. Keep it pure and clean for the soul to reside in.", source: "B.K.S. Iyengar" },
  { text: "When you own your breath, nobody can steal your peace.", source: "Ancient Vedic Wisdom" },
  { text: "The secret of health for both mind and body is not to mourn for the past, not to worry about the future, but to live the present moment wisely.", source: "Buddha" },
];

// ── Main Component ──────────────────────────────────────────────────

export function LoginForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const router = useRouter();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [view, setView] = useState<AuthView>("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification
  const [verifyEmailAddr, setVerifyEmailAddr] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // OAuth loading
  const [oauthLoading, setOauthLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "signup") { setActiveTab("signup"); setView("signup"); }

    const oauthToken = params.get("oauth_token");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      window.history.replaceState({}, "", "/login");
      return;
    }

    if (oauthToken) {
      setOauthLoading(true);
      setSuccess("Signing you in...");
      window.history.replaceState({}, "", "/login");

      // Store the token and redirect
      localStorage.setItem("vedic-token", oauthToken);
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${oauthToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("vedic-user", JSON.stringify(data.user));
            router.push("/dashboard");
          } else {
            setError("Failed to get user info");
            setOauthLoading(false);
          }
        })
        .catch(() => {
          setError("OAuth login failed");
          setOauthLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClass =
    "w-full bg-white/60 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:shadow-[0_0_15px_rgba(255,153,51,0.1)] transition-all duration-300";

  // ── Helpers ─────────────────────────────────────────────────────

  function goBackToLogin() {
    setView("login");
    setActiveTab("login");
    setError("");
    setSuccess("");
    setVerifyCode("");
    setResetCode("");
    setNewPassword("");
    setForgotEmail("");
    setLoading(false);
  }

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
      } else if (result.error === "EMAIL_NOT_VERIFIED") {
        setVerifyEmailAddr(email);
        setView("verify");
        setError("");
        setSuccess("Please verify your email to continue.");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

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
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await register(email, password, name);
      if (result.success) {
        // If backend supports email verification, switch to verify view
        setVerifyEmailAddr(email);
        setView("verify");
        setSuccess("Account created! Please check your email for the verification code.");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmailAddr, code: verifyCode }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem("vedic-token", data.token);
          localStorage.setItem("vedic-user", JSON.stringify(data.user));
        }
        setSuccess("Email verified! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmailAddr }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("New verification code sent!");
      } else {
        setError(data.error || "Failed to resend code");
      }
    } catch {
      setError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setView("forgot-code");
        setSuccess("Reset code sent to your email.");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setView("forgot-success");
        setSuccess("Password reset successfully!");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendResetCode() {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("New reset code sent!");
      }
    } catch {
      setError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  }

  // ── Verify View ─────────────────────────────────────────────────

  function renderVerifyView() {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300/50 flex items-center justify-center mb-3">
            <MailIcon />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">Verify Your Email</h3>
          <p className="text-gray-500 text-sm mt-1">
            Enter the code sent to <span className="text-amber-600 font-medium">{verifyEmailAddr}</span>
          </p>
        </div>

        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm"><ErrorIcon />{error}</div>}
        {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-2.5 rounded-xl text-sm"><SuccessIcon />{success}</div>}

        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm block mb-1.5">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || verifyCode.length !== 6}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <button onClick={handleResendCode} disabled={loading} className="text-amber-600 text-sm hover:text-amber-700 transition-colors disabled:opacity-50">
            Resend Code
          </button>
          <div>
            <button onClick={goBackToLogin} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Forgot Password Views ───────────────────────────────────────

  function renderForgotEmailView() {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-gray-800 font-semibold text-lg">Reset Password</h3>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset code</p>
        </div>

        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm"><ErrorIcon />{error}</div>}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm block mb-1.5">Email Address</label>
            <input
              type="email"
              required
              pattern={EMAIL_PATTERN}
              title="Enter a valid email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <button type="button" onClick={goBackToLogin} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors py-2">
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  function renderForgotCodeView() {
    return (
      <div className="space-y-4">
        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm"><ErrorIcon />{error}</div>}
        {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-2.5 rounded-xl text-sm"><SuccessIcon />{success}</div>}

        <p className="text-gray-500 text-sm text-center">Enter the reset code sent to your email</p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm block mb-1.5">Reset Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
              autoFocus
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm block mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
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
          <button
            type="submit"
            disabled={loading || resetCode.length !== 6}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <button onClick={handleResendResetCode} disabled={loading} className="text-amber-600 text-sm hover:text-amber-700 transition-colors disabled:opacity-50">
            Resend Code
          </button>
          <div>
            <button onClick={goBackToLogin} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderForgotSuccessView() {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <CheckIcon />
        </div>
        <h3 className="text-gray-800 font-semibold text-lg">Password Reset Complete</h3>
        <p className="text-gray-500 text-sm">
          You can now log in with your new password.
        </p>
        <button
          onClick={goBackToLogin}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/25"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // ── Determine View ──────────────────────────────────────────────

  const isForgotView = view === "forgot-email" || view === "forgot-code" || view === "forgot-success";
  const isVerifyView = view === "verify";

  const headerTitle = isForgotView
    ? "Reset Password"
    : isVerifyView
      ? "Verify Your Email"
      : "Welcome Back";

  const headerSubtitle = isForgotView
    ? ""
    : isVerifyView
      ? "Enter your verification code"
      : activeTab === "login"
        ? "Continue your 48-day transformation journey"
        : "Begin your sacred transformation";

  // ── Render ──────────────────────────────────────────────────────

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
            {"\u0950"}
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
              { icon: "\uD83D\uDD25", title: "11 Sacred Pillars", desc: "Morning rituals, breathwork, movement, meditation & more" },
              { icon: "\uD83E\uDDD8", title: "Daily Guided Sessions", desc: "Personalized routines with timers, music & voice guidance" },
              { icon: "\uD83C\uDF1F", title: "Track Your Progress", desc: "Mood tracking, journaling, achievements & AI insights" },
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
            {headerTitle}
          </h1>
          {headerSubtitle && (
            <p className="text-gray-500 text-sm text-center mb-8">
              {headerSubtitle}
            </p>
          )}

          {/* OAuth Loading */}
          {oauthLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-amber-600 text-sm font-medium">Signing you in...</p>
            </div>
          )}

          {/* Verify Email View */}
          {!oauthLoading && isVerifyView && renderVerifyView()}

          {/* Forgot Password Views */}
          {!oauthLoading && view === "forgot-email" && renderForgotEmailView()}
          {!oauthLoading && view === "forgot-code" && renderForgotCodeView()}
          {!oauthLoading && view === "forgot-success" && renderForgotSuccessView()}

          {/* Normal Login/Signup */}
          {!oauthLoading && !isVerifyView && !isForgotView && (
            <>
              {/* Tab Switcher */}
              <div className="flex mb-6 bg-amber-50/80 rounded-xl p-1 border border-amber-200/30">
                {(["login", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setView(tab);
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
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-gray-600 text-sm font-medium">Password</label>
                      <button
                        type="button"
                        onClick={() => { setView("forgot-email"); setError(""); setSuccess(""); }}
                        className="text-amber-600 text-xs hover:text-amber-700 transition-colors font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
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

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                    <span className="text-gray-400 text-xs uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                  </div>

                  {/* Google Login */}
                  <a
                    href={`${API_URL}/auth/oauth/authorize?provider=google`}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 text-sm font-medium"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </a>

                  <p className="text-center text-gray-400 text-xs mt-4">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setActiveTab("signup"); setView("signup"); setError(""); setSuccess(""); }}
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
                        minLength={6}
                        placeholder="Min 6 characters"
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
                        minLength={6}
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

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                    <span className="text-gray-400 text-xs uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                  </div>

                  {/* Google Signup */}
                  <a
                    href={`${API_URL}/auth/oauth/authorize?provider=google`}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 text-sm font-medium"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </a>

                  <p className="text-center text-gray-400 text-xs mt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setActiveTab("login"); setView("login"); setError(""); setSuccess(""); }}
                      className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
