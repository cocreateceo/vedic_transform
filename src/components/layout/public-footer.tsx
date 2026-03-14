import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";

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
    <footer className="bg-[var(--color-bg-surface)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and name */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="10X Vedic"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              10X Vedic
            </span>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-md">
            {siteConfig.description}
          </p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] text-center">
            &copy; 2026 10X Vedic. All rights reserved. | Vedic Transform
          </p>
        </div>
      </div>
    </footer>
  );
}
