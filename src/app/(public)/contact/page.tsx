import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
export const dynamic = "force-dynamic";
  title: "Contact Us",
};

async function submitContactForm(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  console.log("Contact form submission:", { name, email, subject, message });

  // TODO: Wire up actual email sending
}

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
                <form action={submitContactForm} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#64748b] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#64748b] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                    >
                      <option value="" className="bg-[#1a1145]">Select a subject</option>
                      <option value="general" className="bg-[#1a1145]">General Inquiry</option>
                      <option value="support" className="bg-[#1a1145]">Support</option>
                      <option value="feedback" className="bg-[#1a1145]">Feedback</option>
                      <option value="partnership" className="bg-[#1a1145]">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#64748b] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
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
