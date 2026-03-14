import { FAQPageClient } from "./faq-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "FAQ — Help Center" };

export default function FAQPage() {
  return <FAQPageClient />;
}
