"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    apiFetch("/data/user")
      // /data/user GET returns the user row directly (no { user: ... }
      // wrapper). Previously read .user → always null → blank form.
      .then((res) => setDbUser(res || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await apiFetch("/data/user", {
        // API exposes PATCH /data/user; PUT was never registered, so the
        // previous code silently 404'd on every save.
        method: "PATCH",
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
        }),
      });
      // Re-read with the corrected response shape.
      const res = await apiFetch("/data/user");
      setDbUser(res || null);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Save success banner — auto-dismisses after 3s, same pattern as the
          Reminders page so the visual language is consistent. */}
      {savedAt && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="py-3 px-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">Profile saved successfully!</p>
          </CardContent>
        </Card>
      )}

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={dbUser?.name || ""}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                type="tel"
                defaultValue={dbUser?.phone || ""}
                placeholder="Your phone number"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <Button type="submit" size="sm" className="w-full" isLoading={saving}>
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="/reminders"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Reminder Settings
              </p>
              <p className="text-xs text-gray-500">
                Configure your daily reminders
              </p>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
