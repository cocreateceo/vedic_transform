"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/context/auth-context";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Sidebar />
        <div className="lg:pl-64">
          <Header user={{ email: user?.email || "", name: user?.name }} />
          <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
