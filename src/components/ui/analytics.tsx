"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function Analytics() {
  const [consented, setConsented] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    const check = () =>
      setConsented(
        document.cookie
          .split(";")
          .some((c) => c.trim().startsWith("vedic-cookie-consent=accepted")),
      );
    check();
    // React to "Accept All" without a full page reload.
    window.addEventListener("cookie-consent-changed", check);
    return () => window.removeEventListener("cookie-consent-changed", check);
  }, []);

  if (!consented || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
