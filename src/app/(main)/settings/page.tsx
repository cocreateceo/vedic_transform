import { requireAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const user = await requireAuth();

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server";
              const { db } = await import("@/lib/db");
              const { requireAuth } = await import("@/lib/auth");

              const currentUser = await requireAuth();
              const name = formData.get("name") as string;
              const phone = formData.get("phone") as string;

              await db.user.update({
                where: { id: currentUser.id },
                data: {
                  name: name || null,
                  phone: phone || null,
                },
              });

              redirect("/settings");
            }}
            className="space-y-4"
          >
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
                value={user.email}
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

            <Button type="submit" size="sm" className="w-full">
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
              <p className="text-sm font-medium text-gray-900">
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
          <form
            action={async () => {
              "use server";
              const { logoutUser } = await import("@/lib/auth");
              await logoutUser();
              const { redirect } = await import("next/navigation");
              redirect("/login");
            }}
          >
            <Button
              type="submit"
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
