import { FAQPageClient } from "./faq-client";
import { FAQ_DATA } from "@/data/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ — 10X Vedic Transform",
  description:
    "Answers to common questions about the 48-day journey, the 11 pillars, daily practice, streaks, doshas, and the Vedic Guide.",
  path: "/faq",
});

export default function FAQPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <FAQPageClient />
    </>
  );
}
