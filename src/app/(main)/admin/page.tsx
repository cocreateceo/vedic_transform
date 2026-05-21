"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, ChevronRight } from "lucide-react";

interface AdminUserRow {
  id: string;
  email: string;
  name?: string | null;
  onboardingCompleted?: boolean;
  createdAt?: string;
  doshaType?: string | null;
  role?: string | null;
}

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

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
    setLoading(true);
    setError(null);
    const params = q ? `?q=${encodeURIComponent(q.toLowerCase())}` : "";
    apiFetch(`/admin/users${params}`)
      .then((res) => {
        if (!alive) return;
        setUsers(res?.users ?? []);
        setTotal(res?.total ?? 0);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? "Failed to load users");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [q]);

  const heading = useMemo(() => {
    if (loading) return "Loading…";
    if (q) return `${users.length} match${users.length === 1 ? "" : "es"} for "${q}"`;
    return `${total} user${total === 1 ? "" : "s"}`;
  }, [loading, users.length, total, q]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <p className="text-sm text-gray-500">User search and inspection.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by email (prefix match)…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          {heading}
        </p>

        {error && (
          <Card>
            <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
          </Card>
        )}

        {!error && !loading && users.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-gray-500 text-center">
              No users found.
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/admin/users/${encodeURIComponent(u.id)}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {u.name ?? u.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      {u.role === "admin" && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white">
                          admin
                        </span>
                      )}
                      {u.doshaType && <span>dosha: {u.doshaType}</span>}
                      {u.onboardingCompleted ? (
                        <span>onboarded</span>
                      ) : (
                        <span className="text-amber-600">not onboarded</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
