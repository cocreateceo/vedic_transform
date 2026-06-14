"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/ui/share-button";
import { Gift, Copy, Check } from "lucide-react";

/**
 * Invite-a-friend card. Gives the user a referral link (/refer/<code>) and
 * shows how many friends joined + karma earned. Both sides get +100 karma
 * when an invited friend signs up.
 */
export function InviteCard() {
  const [data, setData] = useState<{
    code: string;
    count: number;
    karmaEarned: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch("/data/referral")
      .then((res) => res && setData(res))
      .catch(() => {});
  }, []);

  if (!data) return null;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://10x.vedics.net";
  const link = `${origin}/refer/${data.code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-lg">Invite friends, earn karma</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Share your link — when a friend joins, you both get{" "}
          <span className="font-semibold text-amber-600">+100 karma</span>.
        </p>

        <div className="flex items-center gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          />
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{data.count}</span>{" "}
            joined ·{" "}
            <span className="font-semibold text-amber-600">
              {data.karmaEarned}
            </span>{" "}
            karma earned
          </p>
          <ShareButton
            title="Join me on 10X Vedic Transform"
            text="Start your own 48-day Vedic transformation — body, mind & spirit. Use my invite:"
            url={`/refer/${data.code}`}
            variant="primary"
            size="sm"
            label="Invite"
          />
        </div>
      </CardContent>
    </Card>
  );
}
