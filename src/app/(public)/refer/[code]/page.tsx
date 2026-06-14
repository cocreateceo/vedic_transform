"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

// Public referral capture: stash the inviter's code in a cookie, then send
// the visitor to register. On signup the backend credits both sides +100 karma.
export default function ReferPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();

  useEffect(() => {
    try {
      document.cookie = `vedic-ref=${encodeURIComponent(code)}; max-age=2592000; path=/`;
    } catch {}
    router.replace("/register");
  }, [code, router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
        <p className="mt-4 text-gray-600">A friend invited you — setting things up…</p>
      </div>
    </main>
  );
}
