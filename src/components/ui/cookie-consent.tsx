"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("vedic-cookie-consent="));
    if (!hasConsent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    document.cookie =
      "vedic-cookie-consent=accepted; max-age=31536000; path=/";
    setVisible(false);
    window.location.reload();
  };

  const handleNecessaryOnly = () => {
    document.cookie =
      "vedic-cookie-consent=necessary; max-age=31536000; path=/";
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-purple-500/20 bg-gray-900/80 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-300 sm:text-base">
                We use cookies to enhance your experience and analyze site
                traffic. By clicking &quot;Accept All&quot;, you consent to our
                use of cookies.
              </p>
              <div className="flex flex-shrink-0 gap-3">
                <button
                  onClick={handleNecessaryOnly}
                  className="rounded-lg border border-purple-500/40 px-5 py-2.5 text-sm font-medium text-purple-300 transition-colors hover:border-purple-400 hover:text-purple-200"
                >
                  Necessary Only
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/40"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
