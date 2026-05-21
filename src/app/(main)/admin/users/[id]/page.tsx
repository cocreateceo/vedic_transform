"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!params?.id) return;
    let alive = true;
    apiFetch(`/admin/users/${encodeURIComponent(params.id)}`)
      .then((res) => {
        if (alive) setData(res);
      })
      .catch((e) => {
        if (alive) setError(e?.message ?? "Failed to load user");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-gray-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to users
        </Link>
        <Card>
          <CardContent className="p-6 text-sm text-red-600">
            {error ?? "User not found."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const u = data.user as any;
  const pack = data.contextPack as any;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-gray-500"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to users
      </Link>

      <Card>
        <CardContent className="p-5">
          <h1 className="text-xl font-bold text-gray-900">
            {u.name ?? u.email}
          </h1>
          <p className="text-sm text-gray-500">{u.email}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
            <Field label="Role" value={u.role ?? "user"} />
            <Field label="Onboarded" value={String(Boolean(u.onboardingCompleted))} />
            <Field label="Dosha" value={u.doshaType ?? "—"} />
            <Field label="Lifecycle" value={pack?.lifecycleState ?? "—"} />
            <Field
              label="Created"
              value={u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
            />
            <Field
              label="Updated"
              value={u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—"}
            />
            <Field label="User ID" value={u.id} mono />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Field label="Status" value={pack?.journey?.status ?? "—"} />
            <Field
              label="Day"
              value={`${pack?.journey?.day ?? 0} / ${pack?.journey?.totalDays ?? 48}`}
            />
            <Field label="Start date" value={pack?.journey?.startDate ?? "—"} />
            <Field label="Current streak" value={String(pack?.streak?.current ?? 0)} />
            <Field label="Longest streak" value={String(pack?.streak?.longest ?? 0)} />
            <Field
              label="Shields"
              value={String(pack?.streak?.shieldsAvailable ?? 0)}
            />
            <Field
              label="Last check-in"
              value={pack?.streak?.lastCheckinDate ?? "—"}
            />
            <Field
              label="Days since"
              value={String(pack?.streak?.daysSinceLastCheckin ?? "—")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Field label="Karma total" value={String(pack?.karma?.total ?? 0)} />
            <Field
              label="Karma today"
              value={String(pack?.karma?.todayEarned ?? 0)}
            />
            <Field
              label="Karma last 7d"
              value={String(pack?.karma?.last7Earned ?? 0)}
            />
            <Field
              label="Weekly %"
              value={`${pack?.pillarStats?.weeklyCompletionPct ?? 0}%`}
            />
            <Field
              label="Strongest pillar"
              value={pack?.pillarStats?.strongestPillarSlug ?? "—"}
            />
            <Field
              label="Weakest pillar"
              value={pack?.pillarStats?.weakestPillarSlug ?? "—"}
            />
            <Field
              label="Mood entries 7d"
              value={String(pack?.recentMood?.count7d ?? 0)}
            />
            <Field
              label="Avg mood 7d"
              value={String(pack?.recentMood?.last7Avg?.moodScore ?? "—")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Focus pillars
          </h2>
          {pack?.focusPillars?.length ? (
            <ul className="text-sm space-y-1">
              {pack.focusPillars.map((fp: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-5">
                    #{fp.priority}
                  </span>
                  <span className="font-medium">{fp.pillarName ?? fp.pillarSlug}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">None selected.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Raw Context Pack (debug)
          </h2>
          <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-x-auto max-h-96">
            {JSON.stringify(pack, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={
          mono
            ? "font-mono text-xs text-gray-900 mt-0.5 break-all"
            : "text-sm text-gray-900 mt-0.5"
        }
      >
        {value}
      </p>
    </div>
  );
}
