import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
