"use client";

import { useState } from "react";
import { ReminderSettingsForm } from "@/components/features/reminders";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle } from "lucide-react";

interface ReminderSettings {
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
  sandhyaEnabled: boolean;
  sandhyaMorningTime: string;
  sandhyaNoonTime: string;
  sandhyaEveningTime: string;
  streakWarningEnabled: boolean;
  streakWarningTime: string;
  dailyDigestEnabled: boolean;
  weeklyDigestEnabled: boolean;
  weeklyDigestDay: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  timezone: string;
}

interface RemindersPageClientProps {
  initialSettings: ReminderSettings;
}

export function RemindersPageClient({ initialSettings }: RemindersPageClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async (newSettings: ReminderSettings) => {
    try {
      const res = await fetch("/api/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        setSettings(newSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Configure notifications to stay on track with your practice
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="py-3 px-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">Settings saved successfully!</p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="py-4 px-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Stay consistent with reminders
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Research shows that consistent timing builds stronger habits.
                Set reminders that align with your natural routine for best results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <ReminderSettingsForm settings={settings} onSave={handleSave} />
    </div>
  );
}
