"use client";

import { Sunrise, Sun, Sunset, Moon, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSolarTimes } from "@/lib/solar/use-solar-times";
import {
  brahmaMuhurta,
  sandhyaJunctions,
  eatingWindow,
  windDown,
} from "@/lib/solar/windows";

type WindowKind = "brahma" | "sandhya" | "eating" | "winddown";

const fmt = (d: Date) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function SunWindowsCard({ show }: { show: WindowKind[] }) {
  const { status, sunTimes, request } = useSolarTimes();

  if (status !== "ready" || !sunTimes) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            {status === "denied"
              ? "Location blocked — enable it to see your local sun windows."
              : status === "unsupported"
                ? "Location isn't available on this device."
                : "See today's practice windows for your location."}
          </p>
          <Button size="sm" onClick={request} disabled={status === "locating"}>
            <MapPin className="w-4 h-4 mr-2" />
            {status === "locating" ? "Locating…" : "Use my location"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const rows: { icon: typeof Sun; label: string; value: string }[] = [];
  if (show.includes("brahma")) {
    const w = brahmaMuhurta(sunTimes.sunrise);
    rows.push({ icon: Sunrise, label: "Brahma Muhurta", value: `${fmt(w.start)} – ${fmt(w.end)}` });
  }
  if (show.includes("sandhya")) {
    for (const j of sandhyaJunctions(sunTimes)) {
      const Icon = j.id === "sunrise" ? Sunrise : j.id === "noon" ? Sun : Sunset;
      rows.push({ icon: Icon, label: j.label, value: fmt(j.at) });
    }
  }
  if (show.includes("eating")) {
    const w = eatingWindow(sunTimes.sunrise);
    rows.push({ icon: Sun, label: "Eating window", value: `${fmt(w.start)} – ${fmt(w.end)}` });
  }
  if (show.includes("winddown")) {
    const w = windDown(sunTimes.sunset);
    rows.push({ icon: Moon, label: "Screens off", value: fmt(w.screensOff) });
    rows.push({ icon: Moon, label: "In bed by", value: fmt(w.bedtime) });
  }

  return (
    <Card>
      <CardContent className="py-5 space-y-3">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Icon className="w-4 h-4 text-amber-500" />
                {r.label}
              </span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {r.value}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
