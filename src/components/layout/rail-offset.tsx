"use client";

// The content column's left offset, kept in lockstep with the rail's width.
//
// Its own component so the layout can stay a thin shell: only this subtree
// re-renders when the rail is toggled, and the padding can never drift from
// the width in sidebar.tsx because both read the same context.

import { cn } from "@/lib/utils/cn";
import { useRail } from "./rail-context";

export function RailOffset({ children }: { children: React.ReactNode }) {
  const { collapsed } = useRail();
  return (
    <div
      className={cn(
        "transition-[padding] duration-200",
        collapsed ? "lg:pl-20" : "lg:pl-64",
      )}
    >
      {children}
    </div>
  );
}
