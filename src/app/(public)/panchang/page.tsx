import { Sunrise, Moon, Star, Link2, Clock, CalendarDays } from "lucide-react";
import { getSunTimes } from "@/lib/solar/sun-times";
import { getPanchang } from "@/lib/panchang";
import { pageMetadata } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

// Recompute hourly so "today" stays current without a full rebuild.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Today's Panchang (New Delhi) — 10X Vedic Transform",
  description:
    "Today's tithi, nakshatra, yoga, karana, and vara — computed for New Delhi sunrise using the Lahiri ayanamsha.",
  path: "/panchang",
});

const DELHI = { lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata", name: "New Delhi" };
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function weekdayInTZ(date: Date, tz: string): number {
  const wd = date.toLocaleDateString("en-US", { weekday: "short", timeZone: tz });
  return WD.indexOf(wd.slice(0, 3));
}

export default function PanchangPage() {
  const now = new Date();
  const { sunrise } = getSunTimes(now, DELHI.lat, DELHI.lng);
  const weekday = weekdayInTZ(sunrise, DELHI.tz);
  const p = getPanchang(sunrise, { weekday });

  const dateLabel = sunrise.toLocaleDateString("en-IN", {
    dateStyle: "full",
    timeZone: DELHI.tz,
  });
  const sunriseLabel = sunrise.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: DELHI.tz,
  });

  const rows = [
    { icon: Moon, label: "Tithi", value: p.tithi.name, sub: `${p.tithi.paksha} paksha` },
    { icon: Star, label: "Nakshatra", value: p.nakshatra.name, sub: `Pada ${p.nakshatra.pada}` },
    { icon: Link2, label: "Yoga", value: p.yoga.name, sub: "" },
    { icon: Clock, label: "Karana", value: p.karana.name, sub: "" },
    { icon: CalendarDays, label: "Vara", value: p.vara, sub: "" },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-[#1a1a1a]">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8860D]">
        PANCHANG · पञ्चाङ्ग
      </div>
      <h1 className={`mt-2 text-3xl font-semibold text-[#1a1a1a] ${SERIF_CLASS}`}>Today&apos;s Panchang</h1>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748b]">
        <span>{DELHI.name}</span>
        <span>·</span>
        <span>{dateLabel}</span>
        <span className="inline-flex items-center gap-1">
          <Sunrise className="h-4 w-4 text-[#E8860D]" /> {sunriseLabel}
        </span>
      </p>

      <div className="mt-8 divide-y divide-[#1a1a1a]/8 rounded-2xl border border-[#FF9933]/20 bg-white shadow-sm">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center justify-between px-5 py-4">
              <span className="flex items-center gap-3 text-sm text-[#64748b]">
                <Icon className="h-4 w-4 text-[#E8860D]" />
                {r.label}
              </span>
              <span className="text-right">
                <span className="font-semibold text-[#1a1a1a]">{r.value}</span>
                {r.sub && (
                  <span className="block text-xs text-[#64748b]">{r.sub}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[#64748b]">
        Computed at {DELHI.name} sunrise with the Lahiri (Chitrapaksha) ayanamsha
        ({p.ayanamsha.toFixed(3)}°). Tithi and karana derive from the Moon–Sun
        elongation; nakshatra and yoga from sidereal longitudes.
      </p>
    </main>
  );
}
