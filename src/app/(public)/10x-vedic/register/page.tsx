import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Video,
  Users,
  Award,
  Mail,
  Handshake,
  Mic,
  PersonStanding,
  AudioLines,
  BookOpenText,
  Sparkles,
  Brain,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";
import { RegistrationForm } from "./registration-form";

export const metadata = pageMetadata({
  title: "Register — 10x Vedic Live Cohort",
  description:
    "Register for the 10x Vedic live cohort — a guided 48-day, 11-chapter training starting Monday, August 17, 2026. $399, with discounts available through service exchange.",
  path: "/10x-vedic/register",
});

const HERO_BENEFITS = [
  "Starts Monday, August 17, 2026",
  "48-day guided journey — ends October 3",
  "All 11 chapters of the 10x Vedic framework",
  "Live sessions and weekly Q&A",
  "Private community of fellow seekers",
  "$399 — refer 4 friends who join and it's free",
];

const WHY_JOIN = [
  { icon: CalendarDays, title: "48 Days", text: "Daily guided journey" },
  { icon: GraduationCap, title: "11 Chapters", text: "Complete transformation" },
  { icon: Video, title: "Live Sessions", text: "Interactive learning" },
  { icon: Users, title: "Community", text: "Learn together" },
];

const TRUST_ITEMS = [
  { icon: Handshake, text: "Service-exchange discounts" },
  { icon: Video, text: "Live weekly Q&A" },
  { icon: Award, text: "Certificate of completion" },
  { icon: Users, text: "Private community" },
  { icon: Mail, text: "Email reminders" },
];

// $100 off for every referred friend who joins the cohort.
const REFERRAL_TIERS = [
  { label: "Just you", price: "$399" },
  { label: "1 friend joins", price: "$299" },
  { label: "2 friends join", price: "$199" },
  { label: "3 friends join", price: "$99" },
  { label: "4 friends join", price: "FREE" },
];

const COMM_SKILLS = [
  { icon: Mic, title: "Speaking", text: "Speak with clarity and confidence" },
  { icon: PersonStanding, title: "Body Language", text: "Presence that commands a room" },
  { icon: AudioLines, title: "Voice Control", text: "Tone, pace, and power" },
  { icon: BookOpenText, title: "Storytelling", text: "Speak in a way people remember" },
  { icon: Sparkles, title: "First Impressions", text: "Connect effortlessly from hello" },
  { icon: Brain, title: "Social Intelligence", text: "Read the room, hold attention" },
];

const FAQS = [
  {
    q: "How much does the course cost?",
    a: "The full 48-day live cohort is $399. You can lower it two ways: refer friends ($100 off for each one who joins — four referrals make it free) or exchange your skills and services for a reduced fee. Registration is free; we'll email you the payment and discount details after you reserve your seat.",
  },
  {
    q: "How does the referral discount work?",
    a: "For every person you refer who registers and joins the cohort, we take $100 off your fee: one referral brings it to $299, two to $199, three to $99, and with four referrals your seat is completely free. Just have your friends enter your email in the “Referred by” field when they register.",
  },
  {
    q: "How does the service-exchange discount work?",
    a: "If the fee is a stretch, you can exchange your professional skills or services for a discount on the course. After you register, reply to your confirmation email with what you can offer and we'll work out the details together.",
  },
  {
    q: "When does it start and how long does it run?",
    a: "The cohort starts Monday, August 17, 2026 and runs 48 days, ending October 3, 2026.",
  },
  {
    q: "What happens after I register?",
    a: "You'll receive the joining details by email before the cohort begins — the schedule, payment instructions, how to join the live sessions, and how to access the course materials.",
  },
  {
    q: "What if I can't attend a live session?",
    a: "The course materials are self-paced, so you can catch up on your own time and rejoin the group at the next session.",
  },
  {
    q: "Do I need any prior knowledge?",
    a: "No. The training starts from first principles — all you need is an email address and the willingness to practice daily.",
  },
];

export default function CohortRegisterPage() {
  return (
    <div className="text-[#1a1a1a]">
      {/* ═══ Compact hero with form above the fold ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: headline + benefits */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                Live cohort — limited seats
              </span>
              <h1 className={`mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-white ${SERIF_CLASS}`}>
                Transform Your Life in{" "}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  48 Days
                </span>
              </h1>
              <p className="mt-3 text-lg text-[#cbd5e1] font-medium">
                Join the Live 10x Vedic Cohort
              </p>
              <p className="mt-2 text-base text-[#94a3b8] leading-relaxed max-w-md">
                Awaken your consciousness. Build lasting habits. Learn alongside
                a global community.
              </p>
              <ul className="mt-6 space-y-2.5">
                {HERO_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[15px] text-[#e2e8f0]">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: premium form card */}
            <div className="w-full max-w-[500px] lg:ml-auto">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Trust strip ═══ */}
      <section className="py-8 bg-[#FFF9F3] border-b border-[#FF9933]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-2 text-sm font-medium text-[#475569]">
              <Icon className="w-4.5 h-4.5 text-[#E8860D]" />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ Referral pricing — $100 off per friend who joins ═══ */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-center ${SERIF_CLASS}`}>
            Bring friends, <span className="text-[#E8860D]">pay less</span>
          </h2>
          <p className="mt-3 text-base text-[#64748b] text-center max-w-2xl mx-auto leading-relaxed">
            For every person you refer who joins the cohort, we take $100 off
            your fee. Refer four and your seat is completely free.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {REFERRAL_TIERS.map(({ label, price }, i) => (
              <div
                key={label}
                className={`rounded-2xl border shadow-sm p-5 text-center ${
                  i === REFERRAL_TIERS.length - 1
                    ? "bg-gradient-to-b from-orange-500 to-amber-500 border-transparent text-white"
                    : "bg-[#FFF9F3] border-[#FF9933]/20"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    i === REFERRAL_TIERS.length - 1 ? "text-white" : "text-[#E8860D]"
                  }`}
                >
                  {price}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    i === REFERRAL_TIERS.length - 1 ? "text-orange-50" : "text-[#64748b]"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[#94a3b8]">
            Have your friends enter your email in the &ldquo;Referred by&rdquo;
            field when they register — every joiner counts toward your discount.
          </p>
        </div>
      </section>

      {/* ═══ Why join — compact cards ═══ */}
      <section className="py-14 bg-[#FFF9F3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-center mb-8 ${SERIF_CLASS}`}>
            Why <span className="text-[#E8860D]">join</span>?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_JOIN.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-5 text-center"
              >
                <Icon className="w-8 h-8 text-[#E8860D] mx-auto" />
                <h3 className="mt-2.5 text-base font-semibold">{title}</h3>
                <p className="mt-0.5 text-sm text-[#64748b]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Communication Mastery ═══ */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-center ${SERIF_CLASS}`}>
            Communication <span className="text-[#E8860D]">Mastery</span>
          </h2>
          <p className="mt-3 text-base text-[#64748b] text-center max-w-2xl mx-auto leading-relaxed">
            Learn to communicate effectively, command a room, hold attention,
            connect effortlessly, and speak in a way people remember. Executive
            presence and charisma are skills you can develop — come join us.
          </p>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {COMM_SKILLS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-[#FFF9F3] border border-[#FF9933]/20 shadow-sm p-5 text-center"
              >
                <Icon className="w-8 h-8 text-[#E8860D] mx-auto" />
                <h3 className="mt-2.5 text-base font-semibold">{title}</h3>
                <p className="mt-0.5 text-sm text-[#64748b]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What the journey covers (testimonial slot until real quotes exist) ═══ */}
      <section className="py-14 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-xl sm:text-2xl leading-relaxed text-[#334155] ${SERIF_CLASS}`}>
            &ldquo;The future belongs to the{" "}
            <span className="text-[#E8860D]">most conscious</span>.&rdquo;
          </p>
          <p className="mt-4 text-base text-[#64748b] leading-relaxed">
            Five dimensions, one journey — consciousness, health, relationships,
            leadership, and wealth. 48 days of daily practice, walked together.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-14 bg-[#FAF6EF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-center mb-8 ${SERIF_CLASS}`}>
            Frequently asked <span className="text-[#E8860D]">questions</span>
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-5 open:pb-5"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold">
                  {q}
                  <span className="text-[#E8860D] text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-[#64748b] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[#94a3b8]">
            Prefer to start on your own?{" "}
            <a href="/register" className="text-[#E8860D] underline">
              Take the free self-paced course
            </a>{" "}
            anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
