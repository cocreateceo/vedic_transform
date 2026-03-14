"use client";

import dynamic from "next/dynamic";

const Analytics = dynamic(
  () => import("@/components/ui/analytics").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

const CookieConsent = dynamic(
  () => import("@/components/ui/cookie-consent").then((m) => ({ default: m.CookieConsent })),
  { ssr: false }
);

export function ClientOnlyProviders() {
  return (
    <>
      <Analytics />
      <CookieConsent />
    </>
  );
}
