"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { MoodPageClient } from "./mood-client";

export default function MoodPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/data/mood")
      .then((res) => setLogs(res?.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return <MoodPageClient initialLogs={logs} />;
}
