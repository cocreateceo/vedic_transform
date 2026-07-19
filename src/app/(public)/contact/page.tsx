import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircle } from "lucide-react";
import { ContactFormClient } from "./contact-form-client";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — 10X Vedic Transform",
  description:
    "Get in touch with the 10X Vedic Transform team — questions about the 48-day journey, the 11 pillars, doshas, or your account.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact 10X Vedic Transform",
            url: `${SITE_URL}/contact`,
            mainEntity: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              email: "support@10xvedic.com",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "support@10xvedic.com",
              },
            },
          }),
        }}
      />
      {/* Hero — navy band */}
      <section className="relative overflow-hidden bg-[#0F172A] py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl sm:text-5xl font-semibold text-white mb-4 ${SERIF_CLASS}`}>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Contact
            </span>{" "}
            Us
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            Have a question or want to connect? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#FFF9F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
                <h2 className={`text-xl font-semibold text-[#1a1a1a] mb-6 ${SERIF_CLASS}`}>Send us a message</h2>
                <ContactFormClient />
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-[#1a1a1a] font-semibold">Email</h3>
                </div>
                <p className="text-[#64748b] text-sm">
                  <a href="mailto:support@10xvedic.com" className="text-[#E8860D] hover:text-[#FF9933] transition-colors">
                    support@10xvedic.com
                  </a>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-[#1a1a1a] font-semibold">Response Time</h3>
                </div>
                <p className="text-[#64748b] text-sm">
                  We typically respond within 24-48 hours during business days. For urgent matters, please indicate so in your subject line.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-[#1a1a1a] font-semibold">Community</h3>
                </div>
                <p className="text-[#64748b] text-sm mb-3">
                  Connect with fellow practitioners and share your journey.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-[#FFF9F0] border border-[#FF9933]/15 text-sm text-[#64748b] hover:text-[#1a1a1a] hover:border-[#FF9933]/40 transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-[#FFF9F0] border border-[#FF9933]/15 text-sm text-[#64748b] hover:text-[#1a1a1a] hover:border-[#FF9933]/40 transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-[#FFF9F0] border border-[#FF9933]/15 text-sm text-[#64748b] hover:text-[#1a1a1a] hover:border-[#FF9933]/40 transition-colors"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
