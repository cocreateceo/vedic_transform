export interface Cue {
  /** Stable id, used to ensure a cue fires at most once per session. */
  id: string;
  /** When to fire, in seconds of elapsed session time. */
  atSeconds: number;
  /** Audio file to play. */
  src: string;
}

/**
 * Given all cues, the current elapsed seconds, and the set of ids already
 * fired, return the cues that should fire NOW (reached their time and not yet
 * fired). Pure: the caller is responsible for actually playing them and
 * adding their ids to `firedIds`.
 */
export function cuesToFire(
  cues: Cue[],
  elapsedSeconds: number,
  firedIds: ReadonlySet<string>,
): Cue[] {
  return cues.filter(
    (c) => elapsedSeconds >= c.atSeconds && !firedIds.has(c.id),
  );
}
