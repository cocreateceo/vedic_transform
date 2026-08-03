"use client";

// Orientation content that a reader meets once.
//
// The chapter snapshot answers "what am I about to read?" — a question a
// returning reader has already answered for themselves. Rendering it above
// every activity turns it into chrome. It renders while the chapter is
// untouched and steps aside once the reader is underway.
//
// Nothing is destroyed: the same description anchors this chapter's card on
// /training, and the snapshot returns whenever progress is reset.

import { useChapterProgressContext } from "./chapter-progress-context";

export function FirstVisitOnly({ children }: { children: React.ReactNode }) {
  const { loaded, completedCount } = useChapterProgressContext();
  // Render before progress resolves: a new reader is the case this serves, and
  // showing it then removing it reads better than a card appearing late.
  if (loaded && completedCount > 0) return null;
  return <>{children}</>;
}
