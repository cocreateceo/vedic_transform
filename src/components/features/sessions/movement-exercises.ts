// The circuit the Movement session cycles through, one exercise per round.
// Each has a demo loop (stock Pexels clip cached under public/videos/pexels/)
// and a one-line form cue so the user knows exactly what to do — turning the
// generic interval timer into a real guided workout.

export interface Exercise {
  name: string;
  /** Primary muscles / quality worked, e.g. "Legs · Glutes". */
  target: string;
  /** One-line form cue shown under the demo. */
  cue: string;
  /** PexelsVideo slug for the demonstration loop. */
  demoSlug: string;
}

export const MOVEMENT_EXERCISES: Exercise[] = [
  {
    name: "Jumping Jacks",
    target: "Full body · Cardio",
    cue: "Land soft through the knees; take the arms fully overhead each rep.",
    demoSlug: "exercise-jumping-jacks",
  },
  {
    name: "Bodyweight Squats",
    target: "Legs · Glutes",
    cue: "Sit back into the heels, knees tracking over the toes, chest tall.",
    demoSlug: "exercise-squats",
  },
  {
    name: "Push-ups",
    target: "Chest · Arms · Core",
    cue: "Body in one straight line; lower to ~90° at the elbows. Drop to knees if needed.",
    demoSlug: "exercise-pushups",
  },
  {
    name: "Lunges",
    target: "Legs · Glutes",
    cue: "Step out, both knees to 90°, front knee over the ankle. Alternate legs.",
    demoSlug: "exercise-lunges",
  },
  {
    name: "Plank",
    target: "Core",
    cue: "Forearms down, hips level with the shoulders, belly braced — don't let it sag.",
    demoSlug: "exercise-plank",
  },
  {
    name: "High Knees",
    target: "Cardio · Core",
    cue: "Drive the knees to hip height, stay light on the balls of the feet.",
    demoSlug: "exercise-high-knees",
  },
  {
    name: "Mountain Climbers",
    target: "Core · Cardio",
    cue: "Hands under the shoulders, drive knees to chest, hips low and steady.",
    demoSlug: "exercise-mountain-climbers",
  },
  {
    name: "Burpees",
    target: "Full body",
    cue: "Squat, kick back to a plank, jump the feet in, then jump up tall.",
    demoSlug: "exercise-burpees",
  },
];

/** Exercise for a given 1-based round, cycling through the circuit. */
export function exerciseForRound(round: number): Exercise {
  const len = MOVEMENT_EXERCISES.length;
  const idx = ((round - 1) % len + len) % len;
  return MOVEMENT_EXERCISES[idx];
}
