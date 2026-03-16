import type { Metadata, Viewport } from "next";
import "./globals.css";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('vedic-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
        }} />
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
