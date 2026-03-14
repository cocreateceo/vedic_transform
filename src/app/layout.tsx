import type { Metadata } from "next";
import "./globals.css";
import { ClientOnlyProviders } from "@/components/ui/client-only-providers";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "10X Vedic Transform - 48 Day Journey",
  description: "Transform your body, mind, and spirit with the ancient Vedic wisdom in 48 days",
  manifest: "/manifest.json",
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
          __html: `(function(){try{var t=localStorage.getItem('vedic-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
        }} />
        <AuthProvider>
          {children}
        </AuthProvider>
        <ClientOnlyProviders />
      </body>
    </html>
  );
}
