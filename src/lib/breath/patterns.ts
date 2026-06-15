export interface BreathPattern {
  id: string;
  label: string;
  /** Seconds for each phase. holdIn/holdOut may be 0. */
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  /** Short rationale shown under the pacer. */
  note: string;
}

export const BREATH_PRESETS: BreathPattern[] = [
  {
    id: "coherent-4-6",
    label: "Calm 4:6",
    inhale: 4, holdIn: 0, exhale: 6, holdOut: 0,
    note: "Longer exhale than inhale — shifts you toward parasympathetic calm.",
  },
  {
    id: "box-4-4-4-4",
    label: "Box 4-4-4-4",
    inhale: 4, holdIn: 4, exhale: 4, holdOut: 4,
    note: "Equal four-count box breathing — steadies focus under stress.",
  },
  {
    id: "relax-4-7-8",
    label: "4-7-8",
    inhale: 4, holdIn: 7, exhale: 8, holdOut: 0,
    note: "Extended hold + long exhale — a strong wind-down before sleep.",
  },
  {
    id: "bhramari-4-8",
    label: "Bhramari 4:8",
    inhale: 4, holdIn: 0, exhale: 8, holdOut: 0,
    note: "Slow humming exhale (Bhramari) — soothing; good for Pitta and evenings.",
  },
];

export const DEFAULT_PRESET = BREATH_PRESETS[0];

export const cycleLength = (p: BreathPattern) =>
  p.inhale + p.holdIn + p.exhale + p.holdOut;
