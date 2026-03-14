import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LibraryPageClient } from "./library-client";

export const dynamic = "force-dynamic";
export default async function LibraryPage() {
  const user = await requireAuth();

  const progress = await db.contentProgress.findMany({
    where: { userId: user.id },
  });

  return <LibraryPageClient initialProgress={progress} />;
}
