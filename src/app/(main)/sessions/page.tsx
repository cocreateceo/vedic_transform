"use client";

// /sessions is now two screens, not one.
//
// With no ?practice= it is the index: every practice, its duration, and what
// is already done today. With one, it is that practice and nothing else —
// a back link, the session, and no permanent chrome.
//
// What went: the page's own <h1>Guided Sessions</h1>, the sixteen-button tab
// strip (142–148px, three wrapped rows on a phone, on screen even while a
// timer ran), and the outer card that double-padded every session against the
// component's own padding. Between them they cost ~250px in every state.

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { parseTrainingReturnContext } from "@/lib/training-return-context";
import { TrainingReturnProvider } from "@/components/features/sessions/training-return-provider";
import { SessionsIndex } from "@/components/features/sessions/sessions-index";
import { sessionTabForParam } from "@/components/features/sessions/session-tabs";

export default function SessionsPage() {
  const searchParams = useSearchParams();
  const tab = sessionTabForParam(searchParams?.get("practice"));

  // Parsed through the central validator. Anything malformed — hand-edited
  // URLs, a missing step, an unknown chapter — comes back null and this
  // behaves as an ordinary Sessions visit.
  const trainingReturn = parseTrainingReturnContext(searchParams);

  if (!tab) {
    return (
      <div className="mx-auto max-w-4xl">
        <SessionsIndex />
      </div>
    );
  }

  const ActiveComponent = tab.component;

  return (
    <div className="mx-auto max-w-4xl">
      {/* One back link, and it says where it goes. A learner sent here by a
          chapter returns to the chapter; everyone else returns to the index. */}
      {trainingReturn ? (
        <Link
          href={trainingReturn.originHref}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#DAA520]/40 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 text-sm font-semibold text-[#8B6914] transition-colors hover:border-[#DAA520]"
        >
          <ArrowLeft className="h-4 w-4" />
          {trainingReturn.label}
          <span className="font-normal text-[#B8860B]">
            · part of your learning cycle
          </span>
        </Link>
      ) : (
        <Link
          href="/sessions"
          className="mb-5 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[#B8860B]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sessions
        </Link>
      )}

      {/* The provider is the only channel through which a session learns it
          was launched by Training. */}
      <TrainingReturnProvider value={trainingReturn}>
        <ActiveComponent />
      </TrainingReturnProvider>
    </div>
  );
}
