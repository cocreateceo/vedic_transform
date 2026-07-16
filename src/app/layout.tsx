import type { Metadata, Viewport } from "next";
import "./globals.css";
import { introSerif } from "@/lib/fonts";
import { ClientOnlyProviders } from "@/components/ui/client-only-providers";
import { AuthProvider } from "@/context/auth-context";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { VedicAssistant } from "@/components/features/chat/vedic-assistant";
import { MiniPlayer } from "@/components/features/audio/mini-player";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF9933",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://10x.vedics.net",
  ),
  title: "10X Vedic Transform - 48 Day Journey",
  description: "Transform your body, mind, and spirit with ancient Vedic wisdom in 48 days",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "10X Vedic",
  },
  icons: {
    icon: [
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${introSerif.variable} antialiased`}
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('vedic-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
        }} />
        {/* Sitewide Organization + WebSite structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://10x.vedics.net/#org",
                  name: "10X Vedic Transform",
                  url: "https://10x.vedics.net",
                  logo: "https://10x.vedics.net/icons/icon-192.png",
                  description:
                    "A 48-day Vedic transformation program for body, mind, and spirit.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://10x.vedics.net/#website",
                  url: "https://10x.vedics.net",
                  name: "10X Vedic Transform",
                  publisher: { "@id": "https://10x.vedics.net/#org" },
                },
              ],
            }),
          }}
        />
        <AuthProvider>
          <AudioPlayerProvider>
            {children}
            <MiniPlayer />
            <VedicAssistant />
          </AudioPlayerProvider>
        </AuthProvider>
        <ClientOnlyProviders />
      </body>
    </html>
  );
}
