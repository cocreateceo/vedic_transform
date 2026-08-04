// How wide a page is allowed to get.
//
// Every page used to pick its own max-width by hand, and they had drifted
// across five different values with no rule behind them: Sessions — a catalogue
// of fifteen cards — was capped at 896px, which left roughly 380px of dead
// space on each side of a 1920px screen, while Insights and Reports, which are
// charts and want room, sat at the same 896px.
//
// The rule is the page's job, not its author's taste:
//
//   form      672px   a single column of inputs
//   reading   896px   prose and writing, where line length is the constraint
//   standard  1280px  data pages — charts, tables, reports
//   wide      1536px  catalogues and card grids, which scale with the screen
//
// Reading pages deliberately do NOT grow. A 1500px line of body text is worse
// than empty margins, so "use the whole screen" is not applied uniformly — it
// is applied where more room means more content rather than longer lines.
//
// Horizontal padding stays on <main> in (main)/layout.tsx so it is applied
// once; this component sets width only.

import { cn } from "@/lib/utils/cn";

export type PageWidth = "form" | "reading" | "standard" | "wide";

export const PAGE_WIDTH: Record<PageWidth, string> = {
  form: "max-w-2xl",
  reading: "max-w-4xl",
  standard: "max-w-7xl",
  wide: "max-w-[1536px]",
};

export function PageContainer({
  width = "standard",
  className,
  children,
}: {
  width?: PageWidth;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full", PAGE_WIDTH[width], className)}>
      {children}
    </div>
  );
}
