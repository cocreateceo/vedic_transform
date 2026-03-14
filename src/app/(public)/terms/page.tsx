import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="text-[#e2e8f0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1e] to-[#1a1145] py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Terms
            </span>{" "}
            of Service
          </h1>
          <p className="text-[#94a3b8]">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#0f0a1e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <div className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
              <p className="text-[#94a3b8] leading-relaxed">
                Welcome to 10X Vedic. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  By creating an account or using any part of the 10X Vedic platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must not use our services.
                </p>
                <p>
                  You must be at least 13 years of age to use this platform. If you are under 18, you must have parental or guardian consent to use our services.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Account Registration</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  To access certain features of the platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.
                </p>
                <p>
                  You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>As a user of the 10X Vedic platform, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Use the platform only for lawful purposes and in accordance with these terms</li>
                  <li>Not share your account credentials with any third party</li>
                  <li>Not attempt to interfere with the proper functioning of the platform</li>
                  <li>Not upload or transmit any harmful, offensive, or illegal content</li>
                  <li>Respect the privacy and rights of other users</li>
                  <li>Follow the guidance provided in the program responsibly and at your own pace</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  All content on the 10X Vedic platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of 10X Vedic or its content providers and is protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content from our platform without prior written permission, except for personal, non-commercial use related to your participation in the 48-day Mandala journey.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptable Use</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Use the platform in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to any part of the platform or its systems</li>
                  <li>Use automated tools, bots, or scrapers to access or collect data from the platform</li>
                  <li>Impersonate another person or entity</li>
                  <li>Transmit spam, chain letters, or unsolicited communications</li>
                  <li>Introduce viruses, malware, or other harmful code</li>
                  <li>Use the platform to compete with or create a similar service</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  The 10X Vedic platform and its content are provided for educational and informational purposes only. The practices, techniques, and information shared through the 48-day Mandala program are rooted in Vedic traditions and are not intended as a substitute for professional medical, psychological, or psychiatric advice, diagnosis, or treatment.
                </p>
                <p>
                  Always consult with a qualified healthcare provider before beginning any new wellness program, especially if you have existing health conditions. You assume full responsibility for how you choose to use the information and practices provided.
                </p>
                <p>
                  The platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  To the fullest extent permitted by applicable law, 10X Vedic and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out of or in connection with your use of the platform.
                </p>
                <p>
                  In no event shall our total liability exceed the amount you have paid to us, if any, in the twelve months preceding the event giving rise to the claim.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Account Termination</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  We reserve the right to suspend or terminate your account at any time if we reasonably believe you have violated these Terms of Service. You may also delete your account at any time through your account settings.
                </p>
                <p>
                  Upon termination, your right to use the platform will immediately cease. Any provisions of these terms that by their nature should survive termination shall continue to apply, including intellectual property provisions, disclaimers, and limitations of liability.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  We reserve the right to modify these Terms of Service at any time. We will provide notice of material changes by posting the updated terms on our website and updating the &quot;Last updated&quot; date. Your continued use of the platform after changes are posted constitutes acceptance of the revised terms.
                </p>
                <p>
                  We encourage you to review these terms periodically to stay informed about your rights and obligations.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from or relating to these terms or your use of the platform shall be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be submitted to binding arbitration in accordance with applicable rules.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <p className="text-[#94a3b8] leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-3 text-white">
                  <a href="mailto:support@10xvedic.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                    support@10xvedic.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
