// Sacred-geometry SVG primitives for the Introduction experience.
// Pure line work drawn with currentColor so parents control hue and opacity.

const PETALS = 12;
const RAYS = 24;

/**
 * Concentric mandala: rings, a lotus-petal band, and fine outer rays.
 * Scale with width/height via className; keep opacity low (0.05–0.2).
 */
export function Mandala({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="200" cy="200" r="36" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="72" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="196" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="4" fill="currentColor" />
      {/* Lotus-petal band between the 72 and 120 rings */}
      {Array.from({ length: PETALS }, (_, i) => (
        <path
          key={`petal-${i}`}
          d="M200 80 Q216 106 200 128 Q184 106 200 80 Z"
          stroke="currentColor"
          strokeWidth="0.75"
          transform={`rotate(${(360 / PETALS) * i} 200 200)`}
        />
      ))}
      {/* Fine rays between the 160 and 196 rings */}
      {Array.from({ length: RAYS }, (_, i) => (
        <line
          key={`ray-${i}`}
          x1="200"
          y1="40"
          x2="200"
          y2="14"
          stroke="currentColor"
          strokeWidth="0.5"
          transform={`rotate(${(360 / RAYS) * i} 200 200)`}
        />
      ))}
    </svg>
  );
}

/** Small lotus flanked by hairlines — a quiet divider between major sections. */
export function LotusDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 ${className ?? ""}`}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#DAA520]/50" />
      <svg viewBox="0 0 48 24" fill="none" className="w-10 h-5 text-[#DAA520]">
        <path
          d="M24 3 Q29 11 24 20 Q19 11 24 3 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M24 20 Q14 18 9 9 Q20 10 24 20 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M24 20 Q34 18 39 9 Q28 10 24 20 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#DAA520]/50" />
    </div>
  );
}
