import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0d08]">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
