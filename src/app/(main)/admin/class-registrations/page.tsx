"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Download, GraduationCap } from "lucide-react";

interface RegistrationRow {
  email: string;
  cohortId: string;
  name?: string;
  phone?: string | null;
  region?: string;
  referralSource?: string;
  referredBy?: string | null;
  registeredAt?: string;
  status?: string;
}

function toCsv(rows: RegistrationRow[]): string {
  const cols = ["name", "email", "phone", "region", "referralSource", "referredBy", "registeredAt"] as const;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c])).join(",")),
  ].join("\n");
}

export default function AdminClassRegistrationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side gate. The Lambda also enforces this — this just avoids a
  // confusing 401 flash for non-admin users who somehow navigate here.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if ((user as { role?: string }).role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let alive = true;
    apiFetch("/admin/class-registrations")
      .then((res) => {
        if (!alive) return;
        setRows(res?.registrations ?? []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? "Failed to load registrations");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "10x-vedic-cohort-2026-08-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Cohort registrations
            </h1>
            <p className="text-sm text-gray-500">
              10x Vedic live cohort — August 2026.{" "}
              {loading ? "Loading…" : `${rows.length} registered.`}
            </p>
          </div>
        </div>
        <button
          onClick={exportCsv}
          disabled={loading || rows.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {!error && !loading && rows.length === 0 && (
        <Card>
          <CardContent className="p-6 text-sm text-gray-500 text-center">
            No registrations yet.
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Referred by</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.email}-${r.cohortId}`} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium">{r.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.email}</td>
                    <td className="px-4 py-3 text-gray-600">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.region || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.referralSource || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.referredBy || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
