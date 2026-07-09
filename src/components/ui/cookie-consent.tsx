"use client";

import { useCookieConsentResolved } from "@/lib/use-cookie-consent";

export function CookieConsent() {
  // The banner is visible exactly while consent is unresolved. Both buttons set
  // the cookie and dispatch `cookie-consent-changed`, which the shared hook
  // reads synchronously — so the banner hides (and the chat FAB reappears)
  // without a setState-in-effect or a full page reload.
  const visible = !useCookieConsentResolved();

  const handleAccept = () => {
    document.cookie =
      "vedic-cookie-consent=accepted; max-age=31536000; path=/";
    // Let the Analytics component mount GA reactively — no jarring full reload.
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleNecessaryOnly = () => {
    document.cookie =
      "vedic-cookie-consent=necessary; max-age=31536000; path=/";
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 transition-all duration-300">
      <div className="mx-auto max-w-4xl rounded-2xl border border-orange-500/20 bg-gray-900/80 p-6 shadow-2xl shadow-orange-900/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-300 sm:text-base">
            We use cookies to enhance your experience and analyze site traffic.
            By clicking &quot;Accept All&quot;, you consent to our use of
            cookies.
          </p>
          <div className="flex flex-shrink-0 gap-3">
            <button
              onClick={handleNecessaryOnly}
              className="rounded-lg border border-orange-500/40 px-5 py-2.5 text-sm font-medium text-orange-300 transition-colors hover:border-orange-400 hover:text-orange-200"
            >
              Necessary Only
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/40"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
