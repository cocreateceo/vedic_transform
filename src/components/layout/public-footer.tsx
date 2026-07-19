import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { NewsletterSignup } from "@/components/features/newsletter-signup";
import { SERIF_CLASS } from "@/lib/fonts";

const footerLinks = {
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/blog", label: "Blog" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Help Center" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Cookie Policy" },
    ],
  },
  connect: {
    title: "Connect",
    links: [
      { href: siteConfig.social.youtube, label: "YouTube", external: true },
      { href: "#", label: "Instagram", external: true },
      { href: "#", label: "Twitter", external: true },
    ],
  },
};

export function PublicFooter() {
  return (
    <footer className="bg-[#0F172A] text-[#94a3b8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="10X Vedic"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span
                className={`text-2xl font-bold text-white ${SERIF_CLASS}`}
              >
                10X Vedic
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <div className="mt-6">
              <NewsletterSignup source="footer" />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFD700] mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-6 border-t border-white/10">
          <p className="text-sm text-[#64748b]">
            &copy; 2026 10X Vedic. All rights reserved. | Vedic Transform
          </p>
        </div>
      </div>
    </footer>
  );
}
