"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (user && user.onboardingCompleted === false) {
      router.push("/onboarding");
    } else {
      setChecked(true);
    }
  }, [user, router]);

  // Don't render until we've checked onboarding status
  // But if onboardingCompleted is undefined (existing users), let them through
  if (!checked && user?.onboardingCompleted === false) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Sidebar />
        <div className="lg:pl-64">
          <Header user={{ email: user?.email || "", name: user?.name }} />
          <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
        </div>
        <MobileNav />
        <CommandPalette />
      </div>
    </AuthGuard>
  );
}
