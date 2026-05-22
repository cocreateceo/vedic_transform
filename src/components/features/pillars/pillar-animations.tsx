"use client";

// Animated SVG scenes per pillar — ported from the Vedics Design System
// kit (ui_kits/10x_transform/PillarAnimations.jsx). Each scene is a
// self-contained CSS-keyframed SVG. Reduced-motion safe.
//
// Used by the pillar detail hero. For pillars without a custom scene, the
// caller should fall back to the static Pexels hero image.

import React from "react";

interface SceneProps {
  className?: string;
}

const SHARED_STYLES = `
  .pa-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 16px;
    overflow: hidden;
    background: #0c1334;
  }
  .pa-stage-light { background: #FFFEF5; }
  .pa-svg { width: 100%; height: 100%; display: block; }
  .pa-caption {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 18px 24px;
    color: #fff;
    background: linear-gradient(0deg, rgba(0,0,0,0.5), transparent);
  }
  .pa-caption-light {
    color: #1a1a1a;
    background: linear-gradient(0deg, rgba(255,255,255,0.92), transparent);
  }
  .pa-caption-light .pa-eyebrow { color: #92400E; opacity: 1; }
  .pa-caption-light .pa-sub { color: #64748b; }
  .pa-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
  .pa-title { font-family: var(--font-display, inherit); font-size: 1.25rem; font-weight: 700; margin-top: 4px; }
  .pa-sub { font-size: 0.85rem; opacity: 0.85; margin-top: 2px; }
  @keyframes pa-star-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

// ── 1. Morning Initiation — Brahma Muhurta dawn ─────────────────────────
function BrahmaMuhurtaScene() {
  return (
    <div className="pa-stage">
      <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="pa-svg" role="img" aria-label="Dawn breaking over distant hills">
        <defs>
          <linearGradient id="bm-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1334" />
            <stop offset="60%" stopColor="#1a1f4a" />
            <stop offset="100%" stopColor="#3b2a52" />
          </linearGradient>
          <linearGradient id="bm-dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b3a" />
            <stop offset="40%" stopColor="#7b5a8a" />
            <stop offset="75%" stopColor="#f0a062" />
            <stop offset="100%" stopColor="#fed7a8" />
          </linearGradient>
          <linearGradient id="bm-morning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9bc7e8" />
            <stop offset="55%" stopColor="#ffd89c" />
            <stop offset="100%" stopColor="#fff4dc" />
          </linearGradient>
          <radialGradient id="bm-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbe6" stopOpacity="1" />
            <stop offset="35%" stopColor="#ffd166" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ff9933" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff9933" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bm-halo" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#fff3c8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#ffd166" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bm-hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2548" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1a1024" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect className="bm-sky-night" x="0" y="0" width="600" height="360" fill="url(#bm-night)" />
        <rect className="bm-sky-dawn" x="0" y="0" width="600" height="360" fill="url(#bm-dawn)" />
        <rect className="bm-sky-morning" x="0" y="0" width="600" height="360" fill="url(#bm-morning)" />
        <g className="bm-stars">
          {Array.from({ length: 40 }, (_, i) => {
            const x = (i * 37) % 600;
            const y = 30 + ((i * 19) % 180);
            const r = 0.5 + (i % 3) * 0.4;
            const d = (i % 7) * 0.4;
            return <circle key={i} cx={x} cy={y} r={r} fill="#fffbe6" style={{ animation: `pa-star-twinkle 3s ease-in-out ${d}s infinite` }} />;
          })}
        </g>
        <ellipse className="bm-halo" cx="300" cy="280" rx="280" ry="120" fill="url(#bm-halo)" />
        <g className="bm-sun-group">
          <circle cx="300" cy="280" r="70" fill="url(#bm-sun)" />
          <circle cx="300" cy="280" r="34" fill="#fff8dc" opacity="0.92" />
        </g>
        <path d="M 0 290 Q 80 250 160 270 Q 260 290 360 250 Q 460 220 540 245 Q 580 255 600 250 L 600 360 L 0 360 Z" fill="#4a325c" opacity="0.65" />
        <path d="M 0 310 Q 100 280 180 300 Q 280 320 380 285 Q 480 260 560 295 L 600 305 L 600 360 L 0 360 Z" fill="url(#bm-hill)" opacity="0.85" />
        <path d="M 0 335 Q 120 315 220 332 Q 320 345 420 325 Q 520 312 600 330 L 600 360 L 0 360 Z" fill="#0d0716" />
        <text className="bm-om" x="300" y="170" textAnchor="middle" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="42" fontWeight="700" fill="#fff8dc" opacity="0">ॐ</text>
      </svg>
      <div className="pa-caption">
        <div className="pa-eyebrow">Brahma Muhurta · ब्रह्म मुहूर्त</div>
        <div className="pa-title">The hour before dawn</div>
        <div className="pa-sub">4:30 — 5:00 AM · the most sattvic time of day</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes bm-night   { 0%, 18% { opacity: 1; } 30%, 100% { opacity: 0; } }
        @keyframes bm-dawn    { 0%, 18% { opacity: 0; } 32%, 62% { opacity: 1; } 78%, 100% { opacity: 0; } }
        @keyframes bm-morning { 0%, 62% { opacity: 0; } 78%, 100% { opacity: 1; } }
        @keyframes bm-stars   { 0%, 22% { opacity: 1; } 38%, 100% { opacity: 0; } }
        @keyframes bm-halo    { 0%, 18% { opacity: 0; transform: scaleY(0.4); } 50% { opacity: 0.85; transform: scaleY(1); } 100% { opacity: 0.55; transform: scaleY(1.1); } }
        @keyframes bm-sun     { 0%, 22% { transform: translateY(80px); opacity: 0; } 50% { transform: translateY(40px); opacity: 0.9; } 100% { transform: translateY(-20px); opacity: 1; } }
        @keyframes bm-om      { 0%, 60% { opacity: 0; transform: translateY(20px); } 78% { opacity: 0.7; transform: translateY(0); } 100% { opacity: 0.85; transform: translateY(-5px); } }
        .pa-stage .bm-sky-night   { animation: bm-night 12s ease-in-out infinite; }
        .pa-stage .bm-sky-dawn    { animation: bm-dawn 12s ease-in-out infinite; }
        .pa-stage .bm-sky-morning { animation: bm-morning 12s ease-in-out infinite; }
        .pa-stage .bm-stars       { animation: bm-stars 12s ease-in-out infinite; }
        .pa-stage .bm-halo        { animation: bm-halo 12s ease-in-out infinite; transform-origin: 300px 360px; transform-box: fill-box; }
        .pa-stage .bm-sun-group   { animation: bm-sun 12s ease-in-out infinite; }
        .pa-stage .bm-om          { animation: bm-om 12s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pa-stage .bm-sky-night, .pa-stage .bm-sky-dawn, .pa-stage .bm-sky-morning,
          .pa-stage .bm-stars, .pa-stage .bm-halo, .pa-stage .bm-sun-group, .pa-stage .bm-om { animation: none; }
          .pa-stage .bm-sky-morning { opacity: 1; }
          .pa-stage .bm-sky-night, .pa-stage .bm-sky-dawn, .pa-stage .bm-stars { opacity: 0; }
          .pa-stage .bm-sun-group { transform: translateY(-20px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── 2. Nutrition + Fasting — Ahara Vidhi 24h dial ───────────────────────
function AharaVidhiScene() {
  const cx = 300, cy = 200, r = 130;
  const arcStart = 11 * 15 - 90;
  const arcEnd = 19 * 15 - 90;
  const polar = (deg: number, radius = r): [number, number] => [
    cx + radius * Math.cos((deg * Math.PI) / 180),
    cy + radius * Math.sin((deg * Math.PI) / 180),
  ];
  const [sx, sy] = polar(arcStart);
  const [ex, ey] = polar(arcEnd);
  const eatingArcD = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  const ticks: React.ReactElement[] = [];
  for (let h = 0; h < 24; h++) {
    const ang = ((h * 15 - 90) * Math.PI) / 180;
    const x1 = cx + (r - 8) * Math.cos(ang);
    const y1 = cy + (r - 8) * Math.sin(ang);
    const x2 = cx + (r + 4) * Math.cos(ang);
    const y2 = cy + (r + 4) * Math.sin(ang);
    const isMajor = h % 6 === 0;
    ticks.push(<line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? "#D97706" : "#94a3b8"} strokeWidth={isMajor ? 2 : 1} opacity={isMajor ? 1 : 0.5} />);
  }
  const numbers: Array<[number, string]> = [[0, "12"], [6, "6 AM"], [12, "12 PM"], [18, "6 PM"]];

  return (
    <div className="pa-stage pa-stage-light">
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" className="pa-svg" role="img" aria-label="24-hour eating-window circadian dial">
        <defs>
          <radialGradient id="ah-bg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </radialGradient>
          <linearGradient id="ah-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <radialGradient id="ah-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="60%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="600" height="400" fill="url(#ah-bg)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#cbd5e1" strokeWidth="14" opacity="0.45" />
        <path d={eatingArcD} fill="none" stroke="url(#ah-arc)" strokeWidth="14" strokeLinecap="round" />
        {ticks}
        {numbers.map(([h, label]) => {
          const ang = ((h * 15 - 90) * Math.PI) / 180;
          const tx = cx + (r + 24) * Math.cos(ang);
          const ty = cy + (r + 24) * Math.sin(ang) + 4;
          return <text key={h} x={tx} y={ty} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">{label}</text>;
        })}
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#94A3B8" letterSpacing="2">FASTING</text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="28" fontWeight="800" fill="#1a1a1a">16 : 8</text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">Ahara Vidhi · आहार विधि</text>
        <g className="ah-bowl">
          <path d="M -22 -2 Q 0 14 22 -2 Q 22 8 0 18 Q -22 8 -22 -2 Z" transform={`translate(${cx} ${cy + 50})`} fill="#FFD89C" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx={cx} cy={cy + 48} rx="22" ry="3" fill="#92400E" opacity="0.5" />
          <circle cx={cx - 6} cy={cy + 44} r="2.5" fill="#4CAF50" />
          <circle cx={cx + 6} cy={cy + 44} r="2.5" fill="#FF5722" />
          <circle cx={cx} cy={cy + 41} r="2.5" fill="#F59E0B" />
        </g>
        <g className="ah-sun">
          <circle r="18" fill="url(#ah-sun)" />
          <circle r="10" fill="#FFF8DC" />
        </g>
      </svg>
      <div className="pa-caption pa-caption-light">
        <div className="pa-eyebrow">Vedic Nutrition + Fasting</div>
        <div className="pa-title">Eat with the sun, fast with the moon</div>
        <div className="pa-sub">11 AM – 7 PM window · circadian-aligned, plant-forward</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes ah-orbit { 0% { transform: translate(300px, 70px); } 25% { transform: translate(430px, 200px); } 50% { transform: translate(300px, 330px); } 75% { transform: translate(170px, 200px); } 100% { transform: translate(300px, 70px); } }
        @keyframes ah-bowl { 0%, 40% { opacity: 0; transform: scale(0.9); } 46%, 79% { opacity: 1; transform: scale(1); } 85%, 100% { opacity: 0; transform: scale(0.9); } }
        .pa-stage .ah-sun  { animation: ah-orbit 16s linear infinite; transform-box: fill-box; }
        .pa-stage .ah-bowl { animation: ah-bowl 16s ease-in-out infinite; transform-origin: 300px 250px; transform-box: fill-box; }
        @media (prefers-reduced-motion: reduce) {
          .pa-stage .ah-sun, .pa-stage .ah-bowl { animation: none; }
          .pa-stage .ah-sun  { transform: translate(390px, 110px); }
          .pa-stage .ah-bowl { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── 3. Sankalpa — thought-to-intention ──────────────────────────────────
function SankalpaScene() {
  return (
    <div className="pa-stage pa-stage-light">
      <svg viewBox="0 0 600 400" className="pa-svg" role="img" aria-label="Scattered thoughts coalescing into a clear intention">
        <defs>
          <radialGradient id="sk-bg" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#FAF5FF" /><stop offset="100%" stopColor="#EDE9FE" /></radialGradient>
          <linearGradient id="sk-brain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient>
          <radialGradient id="sk-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FDE68A" /><stop offset="100%" stopColor="#FDE68A" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#sk-bg)" />
        <g>{Array.from({ length: 14 }, (_, i) => {
          const x = 60 + (i * 37) % 480;
          const y = 70 + ((i * 53) % 240);
          const sz = 12 + (i % 4) * 4;
          return <circle key={i} cx={x} cy={y} r={sz} fill="#94A3B8" opacity="0.25" style={{ animation: `sk-chaos 8s ease-in-out ${i * 0.15}s infinite` }} />;
        })}</g>
        <g transform="translate(300 195)">
          <circle r="100" fill="url(#sk-glow)" className="sk-glow" />
          <path d="M -55 -20 Q -65 -50 -30 -55 Q -10 -70 10 -55 Q 45 -50 35 -20 Q 50 -5 35 20 Q 45 50 10 55 Q -10 70 -30 55 Q -65 50 -55 20 Q -70 -5 -55 -20 Z" fill="url(#sk-brain)" opacity="0.85" className="sk-brain" />
          <g className="sk-scroll">
            <rect x="-60" y="-12" width="120" height="24" rx="12" fill="#FFD700" stroke="#D97706" strokeWidth="2" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="13" fontWeight="800" fill="#92400E">I AM CALM &amp; CLEAR</text>
          </g>
        </g>
      </svg>
      <div className="pa-caption pa-caption-light">
        <div className="pa-eyebrow">Sankalpa · सङ्कल्प</div>
        <div className="pa-title">Replace scattered thoughts with one clear intention</div>
        <div className="pa-sub">Set it once at dawn — return to it when the mind scatters</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes sk-chaos { 0%, 30% { opacity: 0.25; } 60%, 100% { opacity: 0; } }
        @keyframes sk-brain { 0%, 60% { opacity: 0.85; transform: scale(1); } 75%, 100% { opacity: 0; transform: scale(0.4); } }
        @keyframes sk-scroll { 0%, 65% { opacity: 0; transform: scale(0.6) translateY(20px); } 85%, 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes sk-glow { 0%, 60% { opacity: 0; } 80%, 100% { opacity: 0.7; } }
        .pa-stage .sk-brain { animation: sk-brain 8s ease-in-out infinite; transform-origin: 0 0; transform-box: fill-box; }
        .pa-stage .sk-scroll { animation: sk-scroll 8s ease-in-out infinite; transform-origin: 0 0; transform-box: fill-box; }
        .pa-stage .sk-glow { animation: sk-glow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ── 4. Gratitude — Kritajnata pulsing heart ─────────────────────────────
function KritajnataScene() {
  return (
    <div className="pa-stage pa-stage-light">
      <svg viewBox="0 0 600 400" className="pa-svg" role="img" aria-label="Glowing heart with gratitude entries rising">
        <defs>
          <radialGradient id="kr-bg" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#FEF3C7" /><stop offset="100%" stopColor="#FFE4B5" /></radialGradient>
          <radialGradient id="kr-heart" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#FCA5A5" /><stop offset="60%" stopColor="#EF4444" /><stop offset="100%" stopColor="#B91C1C" /></radialGradient>
          <radialGradient id="kr-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.55" /><stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#kr-bg)" />
        <circle cx="300" cy="200" r="140" fill="url(#kr-aura)" className="kr-aura" />
        <g transform="translate(300 200)" className="kr-heart">
          <path d="M 0 40 C -60 20 -75 -30 -45 -50 C -25 -60 -10 -55 0 -38 C 10 -55 25 -60 45 -50 C 75 -30 60 20 0 40 Z" fill="url(#kr-heart)" stroke="#7F1D1D" strokeWidth="1.5" />
        </g>
        {["Mother's health", "Morning sun", "Quiet meditation"].map((g, i) => (
          <g key={i} className={`kr-note kr-note-${i}`}>
            <rect x="-70" y="-14" width="140" height="28" rx="14" fill="#fff" stroke="#FCD34D" strokeWidth="1.5" />
            <text y="5" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400E">{g}</text>
          </g>
        ))}
      </svg>
      <div className="pa-caption pa-caption-light">
        <div className="pa-eyebrow">Kritajnata · कृतज्ञता</div>
        <div className="pa-title">Three things, every day</div>
        <div className="pa-sub">Gratitude rewires the neural pathways for positivity</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes kr-heart { 0%, 100% { transform: scale(1); } 40% { transform: scale(1.08); } 50% { transform: scale(1.03); } 60% { transform: scale(1.10); } }
        @keyframes kr-aura  { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.08); } }
        @keyframes kr-note  { 0%, 20% { opacity: 0; transform: translate(300px, 280px); } 50% { opacity: 1; } 100% { opacity: 0; transform: translate(300px, 60px); } }
        .pa-stage .kr-heart { animation: kr-heart 2.4s ease-in-out infinite; transform-origin: 0 0; transform-box: fill-box; }
        .pa-stage .kr-aura  { animation: kr-aura 2.4s ease-in-out infinite; transform-origin: 300px 200px; transform-box: fill-box; }
        .pa-stage .kr-note  { animation: kr-note 6s ease-out infinite; }
        .pa-stage .kr-note-0 { animation-delay: 0s; }
        .pa-stage .kr-note-1 { animation-delay: 2s; }
        .pa-stage .kr-note-2 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

// ── 5. Sandhya — 3 suns across the sky ─────────────────────────────────
function SandhyaScene() {
  return (
    <div className="pa-stage">
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="pa-svg" role="img" aria-label="Sun crosses the sky three times for the three Sandhyas">
        <defs>
          <linearGradient id="sd-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5B2C6F" /><stop offset="50%" stopColor="#E67E22" /><stop offset="100%" stopColor="#F8D7A6" /></linearGradient>
          <linearGradient id="sd-noon" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3498DB" /><stop offset="60%" stopColor="#85C1E9" /><stop offset="100%" stopColor="#FAD7A0" /></linearGradient>
          <linearGradient id="sd-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4A235A" /><stop offset="50%" stopColor="#D35400" /><stop offset="100%" stopColor="#1B2631" /></linearGradient>
          <radialGradient id="sd-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF8DC" /><stop offset="60%" stopColor="#FFD166" /><stop offset="100%" stopColor="#FF9933" stopOpacity="0" /></radialGradient>
        </defs>
        <rect className="sd-bg-dawn" width="600" height="400" fill="url(#sd-dawn)" />
        <rect className="sd-bg-noon" width="600" height="400" fill="url(#sd-noon)" />
        <rect className="sd-bg-dusk" width="600" height="400" fill="url(#sd-dusk)" />
        <path d="M 50 300 Q 300 50 550 300" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 4" />
        <g className="sd-sun sd-sun-dawn"><circle r="22" fill="url(#sd-sun)" /><circle r="11" fill="#fff8dc" /></g>
        <g className="sd-sun sd-sun-noon"><circle r="22" fill="url(#sd-sun)" /><circle r="11" fill="#fff8dc" /></g>
        <g className="sd-sun sd-sun-dusk"><circle r="22" fill="url(#sd-sun)" /><circle r="11" fill="#fff8dc" /></g>
        <path d="M 0 305 L 600 305 Z" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
        <g transform="translate(300 280)" fill="#0d0716">
          <ellipse cx="0" cy="20" rx="32" ry="6" />
          <path d="M -20 20 Q -10 0 0 -2 Q 10 0 20 20 Z" />
          <path d="M 0 -2 Q -16 -8 -16 -22 Q -16 -34 0 -34 Q 16 -34 16 -22 Q 16 -8 0 -2 Z" />
          <circle cx="0" cy="-44" r="10" />
        </g>
        <text x="300" y="60" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="3" fill="#fff" className="sd-lbl-dawn">PRATAH · DAWN</text>
        <text x="300" y="60" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="3" fill="#1a1a1a" className="sd-lbl-noon">MADHYA · NOON</text>
        <text x="300" y="60" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="3" fill="#fff" className="sd-lbl-dusk">SAYAM · DUSK</text>
      </svg>
      <div className="pa-caption">
        <div className="pa-eyebrow">Sandhyavandana · सन्ध्यावन्दना</div>
        <div className="pa-title">Greet the three junctures of the day</div>
        <div className="pa-sub">Dawn · Noon · Dusk — face east, north, west</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes sd-dawn { 0%, 28% { opacity: 1; } 38%, 100% { opacity: 0; } }
        @keyframes sd-noon { 0%, 35% { opacity: 0; } 42%, 62% { opacity: 1; } 70%, 100% { opacity: 0; } }
        @keyframes sd-dusk { 0%, 65% { opacity: 0; } 75%, 95% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes sd-sun-dawn { 0%, 28% { opacity: 1; transform: translate(120px, 240px); } 38%, 100% { opacity: 0; } }
        @keyframes sd-sun-noon { 0%, 35% { opacity: 0; } 42%, 62% { opacity: 1; transform: translate(300px, 95px); } 70%, 100% { opacity: 0; } }
        @keyframes sd-sun-dusk { 0%, 65% { opacity: 0; } 75%, 95% { opacity: 1; transform: translate(480px, 240px); } 100% { opacity: 0; } }
        .pa-stage .sd-bg-dawn { animation: sd-dawn 15s ease-in-out infinite; }
        .pa-stage .sd-bg-noon { animation: sd-noon 15s ease-in-out infinite; }
        .pa-stage .sd-bg-dusk { animation: sd-dusk 15s ease-in-out infinite; }
        .pa-stage .sd-sun { transform-box: fill-box; }
        .pa-stage .sd-sun-dawn { animation: sd-sun-dawn 15s ease-in-out infinite; }
        .pa-stage .sd-sun-noon { animation: sd-sun-noon 15s ease-in-out infinite; }
        .pa-stage .sd-sun-dusk { animation: sd-sun-dusk 15s ease-in-out infinite; }
        .pa-stage .sd-lbl-dawn { animation: sd-dawn 15s ease-in-out infinite; }
        .pa-stage .sd-lbl-noon { animation: sd-noon 15s ease-in-out infinite; }
        .pa-stage .sd-lbl-dusk { animation: sd-dusk 15s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ── 6. Brahman — expanding cosmic mandala ──────────────────────────────
function BrahmaConnectionScene() {
  return (
    <div className="pa-stage" style={{ background: "#0c0820" }}>
      <svg viewBox="0 0 600 400" className="pa-svg" role="img" aria-label="Cosmic mandala expanding outward in concentric rings">
        <defs>
          <radialGradient id="bc-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF8DC" /><stop offset="50%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FF9933" stopOpacity="0" /></radialGradient>
          <radialGradient id="bc-stars" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#4338CA" stopOpacity="0.5" /><stop offset="100%" stopColor="#0c0820" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="600" height="400" fill="#0c0820" />
        <ellipse cx="300" cy="200" rx="280" ry="180" fill="url(#bc-stars)" opacity="0.6" />
        {Array.from({ length: 60 }, (_, i) => {
          const x = (i * 73) % 600;
          const y = (i * 37) % 400;
          const r = 0.6 + (i % 3) * 0.4;
          return <circle key={i} cx={x} cy={y} r={r} fill="#FFF8DC" opacity="0.7" style={{ animation: `pa-star-twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.1}s infinite` }} />;
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="300" cy="200" r="20" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.6" style={{ animation: `bc-ring 6s ease-out ${i * 1.2}s infinite` }} />
        ))}
        <g transform="translate(300 200)" className="bc-mandala">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <path key={a} d="M 0 -10 Q -12 -40 0 -70 Q 12 -40 0 -10 Z" transform={`rotate(${a})`} fill="#FFD700" opacity="0.8" />
          ))}
          <circle r="14" fill="url(#bc-core)" />
          <circle r="6" fill="#FFF8DC" />
        </g>
        <g className="bc-om" transform="translate(300 200)">
          <text textAnchor="middle" dy="6" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="22" fontWeight="800" fill="#FFD700">ॐ</text>
        </g>
      </svg>
      <div className="pa-caption">
        <div className="pa-eyebrow">Brahma Sambandha · ब्रह्म सम्बन्ध</div>
        <div className="pa-title">Connect to the infinite consciousness</div>
        <div className="pa-sub">Every breath is a thread to Brahman</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes bc-ring { 0% { r: 20; opacity: 0.7; } 100% { r: 200; opacity: 0; } }
        @keyframes bc-mandala { 0%, 100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.08); } }
        @keyframes bc-om { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
        .pa-stage .bc-mandala { animation: bc-mandala 12s ease-in-out infinite; transform-origin: 0 0; transform-box: fill-box; }
        .pa-stage .bc-om { animation: bc-om 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ── 7. Manifestation — upward intention spiral ──────────────────────────
function ManifestationScene() {
  return (
    <div className="pa-stage pa-stage-light" style={{ background: "linear-gradient(180deg, #FAF5FF 0%, #FEF3C7 100%)" }}>
      <svg viewBox="0 0 600 400" className="pa-svg" role="img" aria-label="Intention rising as an upward spiral">
        <defs>
          <linearGradient id="ms-spiral" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#FFD700" /></linearGradient>
          <radialGradient id="ms-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FFD700" stopOpacity="0" /></radialGradient>
        </defs>
        <path className="ms-spiral" d="M 300 350 C 240 340, 220 310, 270 290 C 320 270, 360 250, 320 220 C 280 200, 250 170, 300 150 C 350 130, 360 100, 310 80 C 270 70, 290 50, 300 40" fill="none" stroke="url(#ms-spiral)" strokeWidth="4" strokeLinecap="round" strokeDasharray="600" strokeDashoffset="600" />
        <g className="ms-sparks">
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = 300 + 60 * Math.cos(angle);
            const y = 40 + 60 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="5" fill="url(#ms-spark)" style={{ animationDelay: `${i * 0.15}s` }} />;
          })}
        </g>
        <g className="ms-crystal" transform="translate(300 40)">
          <path d="M 0 -22 L 18 -2 L 12 22 L -12 22 L -18 -2 Z" fill="#FFD700" stroke="#D97706" strokeWidth="2" />
          <path d="M 0 -22 L 0 22" stroke="#fff8dc" strokeWidth="1.5" opacity="0.6" />
        </g>
        <rect x="220" y="340" width="160" height="36" rx="18" fill="#fff" stroke="#A855F7" strokeWidth="2" />
        <text x="300" y="363" textAnchor="middle" fontSize="13" fontWeight="700" fill="#5B21B6">My intention</text>
      </svg>
      <div className="pa-caption pa-caption-light">
        <div className="pa-eyebrow">Sankalpa Shakti · सङ्कल्प शक्ति</div>
        <div className="pa-title">Intention rises into form</div>
        <div className="pa-sub">What you focus on with discipline manifests</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes ms-spiral { 0% { stroke-dashoffset: 600; } 70%, 100% { stroke-dashoffset: 0; } }
        @keyframes ms-crystal { 0%, 70% { opacity: 0; transform: scale(0.4) translateY(20px); } 90%, 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes ms-spark { 0%, 80% { opacity: 0; transform: scale(0.4); } 90%, 100% { opacity: 1; transform: scale(1); } }
        .pa-stage .ms-spiral { animation: ms-spiral 6s ease-out infinite; }
        .pa-stage .ms-crystal { animation: ms-crystal 6s ease-out infinite; transform-origin: 300px 40px; transform-box: fill-box; }
        .pa-stage .ms-sparks circle { animation: ms-spark 6s ease-out infinite; }
      `}</style>
    </div>
  );
}

// ── 8. Sleep — Nidra moon phases ────────────────────────────────────────
function NidraScene() {
  return (
    <div className="pa-stage" style={{ background: "#050514" }}>
      <svg viewBox="0 0 600 400" className="pa-svg" role="img" aria-label="Moon traversing the night sky through its phases">
        <defs>
          <radialGradient id="nd-sky" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" /><stop offset="100%" stopColor="#050514" stopOpacity="0" /></radialGradient>
          <radialGradient id="nd-moon" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#fef9c3" /><stop offset="65%" stopColor="#fde68a" /><stop offset="100%" stopColor="#92400e" /></radialGradient>
          <radialGradient id="nd-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.4" /><stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="600" height="400" fill="#050514" />
        <ellipse cx="300" cy="200" rx="300" ry="140" fill="url(#nd-sky)" />
        {Array.from({ length: 80 }, (_, i) => {
          const x = (i * 47) % 600;
          const y = (i * 29) % 320;
          const r = 0.5 + (i % 4) * 0.4;
          return <circle key={i} cx={x} cy={y} r={r} fill="#fef9c3" opacity={0.5 + (i % 5) * 0.1} style={{ animation: `pa-star-twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.08}s infinite` }} />;
        })}
        <path d="M 0 340 Q 200 320 400 335 Q 500 340 600 330 L 600 400 L 0 400 Z" fill="#1a0f3e" opacity="0.85" />
        <circle cx="300" cy="160" r="80" fill="url(#nd-halo)" className="nd-halo" />
        <g className="nd-moon">
          <circle cx="300" cy="160" r="38" fill="url(#nd-moon)" />
          <ellipse className="nd-moon-shadow" cx="280" cy="160" rx="38" ry="38" fill="#050514" />
          <circle cx="290" cy="155" r="3" fill="#92400e" opacity="0.4" />
          <circle cx="312" cy="170" r="2" fill="#92400e" opacity="0.4" />
          <circle cx="302" cy="180" r="2.5" fill="#92400e" opacity="0.4" />
        </g>
        <g transform="translate(300 345)" fill="#0d0716">
          <ellipse cx="0" cy="0" rx="80" ry="10" />
          <path d="M -60 0 Q -50 -22 -30 -20 Q 0 -30 30 -20 Q 50 -22 60 0 Z" fill="#1a0f3e" />
        </g>
        <g className="nd-z" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontWeight="800" fill="#fde68a">
          <text x="370" y="320" fontSize="20">z</text>
          <text x="385" y="300" fontSize="16">z</text>
          <text x="395" y="280" fontSize="12">z</text>
        </g>
      </svg>
      <div className="pa-caption">
        <div className="pa-eyebrow">Nidra · निद्रा</div>
        <div className="pa-title">Deep sleep is half the practice</div>
        <div className="pa-sub">7–9 hours · in bed by 10 PM · phones off, candles low</div>
      </div>
      <style>{`
        ${SHARED_STYLES}
        @keyframes nd-shadow { 0%, 100% { transform: translate(-80px, 0); } 25% { transform: translate(-30px, 0); } 50% { transform: translate(0, 0); } 75% { transform: translate(30px, 0); } }
        @keyframes nd-halo { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.1); } }
        @keyframes nd-z { 0%, 100% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 70%, 90% { opacity: 0; transform: translateY(-30px); } }
        .pa-stage .nd-moon-shadow { animation: nd-shadow 18s ease-in-out infinite; transform-origin: 300px 160px; transform-box: fill-box; }
        .pa-stage .nd-halo { animation: nd-halo 6s ease-in-out infinite; transform-origin: 300px 160px; transform-box: fill-box; }
        .pa-stage .nd-z text { animation: nd-z 4s ease-out infinite; }
        .pa-stage .nd-z text:nth-child(2) { animation-delay: 1s; }
        .pa-stage .nd-z text:nth-child(3) { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

export function PillarAnimation({ slug, className }: { slug: string; className?: string }) {
  const wrap = (child: React.ReactElement) => (
    <div className={className} style={{ width: "100%" }}>{child}</div>
  );
  switch (slug) {
    case "morning-initiation":   return wrap(<BrahmaMuhurtaScene />);
    case "nutrition-fasting":    return wrap(<AharaVidhiScene />);
    case "thoughts-intention":   return wrap(<SankalpaScene />);
    case "gratitude":            return wrap(<KritajnataScene />);
    case "sandhya-meditation":   return wrap(<SandhyaScene />);
    case "brahman-connection":   return wrap(<BrahmaConnectionScene />);
    case "divine-manifestation": return wrap(<ManifestationScene />);
    case "sleep-optimization":   return wrap(<NidraScene />);
    default: return null;
  }
}

// Expose individual scenes for direct use if needed.
export const Scenes = {
  BrahmaMuhurtaScene,
  AharaVidhiScene,
  SankalpaScene,
  KritajnataScene,
  SandhyaScene,
  BrahmaConnectionScene,
  ManifestationScene,
  NidraScene,
};
