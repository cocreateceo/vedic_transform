import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircle } from "lucide-react";
import { ContactFormClient } from "./contact-form-client";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="text-[#e2e8f0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1e] to-[#1a1145] py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
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
      <section className="py-16 bg-[#0f0a1e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <h2 className="text-xl font-semibold text-white mb-6">Send us a message</h2>
                <ContactFormClient />
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold">Email</h3>
                </div>
                <p className="text-[#94a3b8] text-sm">
                  <a href="mailto:support@10xvedic.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    support@10xvedic.com
                  </a>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-white font-semibold">Response Time</h3>
                </div>
                <p className="text-[#94a3b8] text-sm">
                  We typically respond within 24-48 hours during business days. For urgent matters, please indicate so in your subject line.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold">Community</h3>
                </div>
                <p className="text-[#94a3b8] text-sm mb-3">
                  Connect with fellow practitioners and share your journey.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-white/[0.05] text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.1] transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-white/[0.05] text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.1] transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 rounded-lg bg-white/[0.05] text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.1] transition-colors"
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
