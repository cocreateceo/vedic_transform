import { Metadata } from "next";
import { SERIF_CLASS } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FFFEF5] text-[#1a1a1a]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FF9933] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className={`text-4xl sm:text-5xl font-semibold text-white mb-4 ${SERIF_CLASS}`}>
            Privacy Policy
          </h1>
          <p className="text-[#94a3b8]">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#FFFEF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <div className="p-8 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
              <p className="text-[#64748b] leading-relaxed">
                At 10X Vedic, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform and services.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Information We Collect</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-[#1a1a1a]">Account Information:</strong> Name, email address, and password when you create an account.</li>
                  <li><strong className="text-[#1a1a1a]">Profile Data:</strong> Optional information you choose to add to your profile, such as a display name or avatar.</li>
                  <li><strong className="text-[#1a1a1a]">Journey Data:</strong> Your progress through the 48-day Mandala, including pillar completions, streak information, Karma Points, and daily reflections.</li>
                  <li><strong className="text-[#1a1a1a]">Communications:</strong> Messages you send to us through the contact form or email.</li>
                  <li><strong className="text-[#1a1a1a]">Usage Data:</strong> Automatically collected information about how you interact with our platform, including pages visited, features used, and timestamps.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>How We Use Your Information</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Track your progress through the 48-day Mandala journey</li>
                  <li>Personalize your experience and deliver relevant content</li>
                  <li>Send you important updates about your account and journey</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Analyze usage patterns to improve platform functionality</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Data Storage &amp; Security</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your personal data. All data is encrypted in transit using TLS/SSL and at rest using AES-256 encryption. Our infrastructure is hosted on secure, SOC 2-compliant cloud providers.
                </p>
                <p>
                  While we take every reasonable precaution to protect your data, no method of transmission over the internet is completely secure. We encourage you to use strong passwords and keep your account credentials confidential.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Third-Party Services</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  We may use third-party services to help us operate our platform, including authentication providers, email delivery services, and analytics tools. These services have access to your data only as necessary to perform their functions and are obligated to maintain its confidentiality.
                </p>
                <p>
                  We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Your Rights</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-[#1a1a1a]">Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong className="text-[#1a1a1a]">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li><strong className="text-[#1a1a1a]">Deletion:</strong> Request deletion of your account and associated data.</li>
                  <li><strong className="text-[#1a1a1a]">Export:</strong> Request a portable copy of your data in a standard format.</li>
                  <li><strong className="text-[#1a1a1a]">Opt-out:</strong> Unsubscribe from non-essential communications at any time.</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us through our Contact page or email us at support@10xvedic.com.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Cookie Policy</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  We use cookies and similar technologies to maintain your session, remember your preferences, and understand how you use our platform. Essential cookies are required for the platform to function properly. Analytics cookies help us improve our services and are only used with your consent.
                </p>
                <p>
                  You can manage cookie preferences through your browser settings. Disabling essential cookies may affect your ability to use certain features of the platform.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Data Retention</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  We retain your personal data for as long as your account is active or as needed to provide you services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.
                </p>
                <p>
                  Anonymized and aggregated data that cannot identify you may be retained indefinitely for research and improvement purposes.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Changes to This Policy</h2>
              <div className="space-y-4 text-[#64748b] leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and, where appropriate, by email. Your continued use of the platform after changes are posted constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold text-[#1a1a1a] mb-4 ${SERIF_CLASS}`}>Contact for Privacy Concerns</h2>
              <div className="p-6 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm">
                <p className="text-[#64748b] leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mt-3">
                  <a href="mailto:support@10xvedic.com" className="text-[#E8860D] hover:text-[#FF9933] transition-colors">
                    support@10xvedic.com
                  </a>
                </p>
                <p className="mt-2 text-sm text-[#64748b]">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
