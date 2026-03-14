import { FAQPageClient } from "./faq-client";

export const metadata = { title: "FAQ — Help Center" };
export const dynamic = "force-dynamic";

export default function FAQPage() {
  return <FAQPageClient />;
}
