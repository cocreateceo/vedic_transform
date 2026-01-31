import { requireAuth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        <Header
          user={{
            email: user.email,
            name: user.name || undefined,
          }}
        />

        {/* Main content with bottom padding for mobile nav */}
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
