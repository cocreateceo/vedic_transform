"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  Bell,
  Sun,
  Moon,
  Flame,
  Mail,
  Smartphone,
  Clock,
  Save,
  AlertCircle,
} from "lucide-react";

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

interface ReminderSettingsProps {
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => Promise<void>;
  className?: string;
}

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

const dayOptions = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

export function ReminderSettingsForm({
  settings: initialSettings,
  onSave,
  className = "",
}: ReminderSettingsProps) {
  const [settings, setSettings] = useState<ReminderSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof ReminderSettings>(
    key: K,
    value: ReminderSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({
    enabled,
    onChange,
    label,
    icon: Icon,
    color,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    icon: typeof Bell;
    color: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            enabled ? `bg-${color}-100` : "bg-gray-100"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              enabled ? `text-${color}-600` : "text-gray-400"
            )}
          />
        </div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          enabled ? "bg-amber-500" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
            enabled && "translate-x-5"
          )}
        />
      </button>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base">Reminder Settings</CardTitle>
            <p className="text-xs text-gray-500">Configure your daily notifications</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Morning Reminders */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Morning Practice
          </h3>
          <Toggle
            enabled={settings.morningEnabled}
            onChange={(v) => updateSetting("morningEnabled", v)}
            label="Morning reminder"
            icon={Sun}
            color="amber"
          />
          {settings.morningEnabled && (
            <div className="ml-11">
              <label className="text-xs text-gray-500">Time</label>
              <select
                value={settings.morningTime}
                onChange={(e) => updateSetting("morningTime", e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {timeOptions.filter((t) => parseInt(t.value) < 12).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Evening Reminders */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            Evening Reflection
          </h3>
          <Toggle
            enabled={settings.eveningEnabled}
            onChange={(v) => updateSetting("eveningEnabled", v)}
            label="Evening reminder"
            icon={Moon}
            color="indigo"
          />
          {settings.eveningEnabled && (
            <div className="ml-11">
              <label className="text-xs text-gray-500">Time</label>
              <select
                value={settings.eveningTime}
                onChange={(e) => updateSetting("eveningTime", e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {timeOptions.filter((t) => parseInt(t.value) >= 18).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sandhya Vandana (3x daily) */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Sandhya Vandana (3x daily)
          </h3>
          <Toggle
            enabled={settings.sandhyaEnabled}
            onChange={(v) => updateSetting("sandhyaEnabled", v)}
            label="Tri-sandhya reminders"
            icon={Flame}
            color="orange"
          />
          {settings.sandhyaEnabled && (
            <div className="ml-11 grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">Morning</label>
                <select
                  value={settings.sandhyaMorningTime}
                  onChange={(e) => updateSetting("sandhyaMorningTime", e.target.value)}
                  className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                >
                  {timeOptions.filter((t) => parseInt(t.value) < 9).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Noon</label>
                <select
                  value={settings.sandhyaNoonTime}
                  onChange={(e) => updateSetting("sandhyaNoonTime", e.target.value)}
                  className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                >
                  {timeOptions.filter((t) => parseInt(t.value) >= 11 && parseInt(t.value) <= 13).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Evening</label>
                <select
                  value={settings.sandhyaEveningTime}
                  onChange={(e) => updateSetting("sandhyaEveningTime", e.target.value)}
                  className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg"
                >
                  {timeOptions.filter((t) => parseInt(t.value) >= 17 && parseInt(t.value) <= 19).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Streak Protection */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Streak Protection
          </h3>
          <Toggle
            enabled={settings.streakWarningEnabled}
            onChange={(v) => updateSetting("streakWarningEnabled", v)}
            label="Streak at risk warning"
            icon={AlertCircle}
            color="red"
          />
          {settings.streakWarningEnabled && (
            <div className="ml-11">
              <label className="text-xs text-gray-500">Warning time</label>
              <select
                value={settings.streakWarningTime}
                onChange={(e) => updateSetting("streakWarningTime", e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
              >
                {timeOptions.filter((t) => parseInt(t.value) >= 19).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Email Digests */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            Email Digests
          </h3>
          <Toggle
            enabled={settings.dailyDigestEnabled}
            onChange={(v) => updateSetting("dailyDigestEnabled", v)}
            label="Daily progress digest"
            icon={Mail}
            color="blue"
          />
          <Toggle
            enabled={settings.weeklyDigestEnabled}
            onChange={(v) => updateSetting("weeklyDigestEnabled", v)}
            label="Weekly summary email"
            icon={Mail}
            color="blue"
          />
          {settings.weeklyDigestEnabled && (
            <div className="ml-11">
              <label className="text-xs text-gray-500">Send on</label>
              <select
                value={settings.weeklyDigestDay}
                onChange={(e) => updateSetting("weeklyDigestDay", e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
              >
                {dayOptions.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Notification Channels */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700">Notification Channels</h3>
          <Toggle
            enabled={settings.emailNotifications}
            onChange={(v) => updateSetting("emailNotifications", v)}
            label="Email notifications"
            icon={Mail}
            color="gray"
          />
          <Toggle
            enabled={settings.pushNotifications}
            onChange={(v) => updateSetting("pushNotifications", v)}
            label="Push notifications"
            icon={Smartphone}
            color="gray"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
