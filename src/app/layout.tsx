import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/ui/analytics";
import { CookieConsent } from "@/components/ui/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('vedic-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
        }} />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
