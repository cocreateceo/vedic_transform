// ===== Sessions page — guided interactive practice =====
// Mirrors src/app/(main)/sessions/page.tsx + the 5 timer components
//
// Tabs (left-to-right, in daily-ritual order):
//   Morning Routine · Fasting · Breathing · Movement · Meditation
//
// Each timer is a self-contained React component with its own state machine.
// Audio cues are stubbed (the production app uses pre-recorded MP3s); the
// mute/unmute button is wired but plays nothing. The visuals do the work.

// ──────────────────────────────────────────────────────────
//  1. BREATHING — animated lotus + 3 breath patterns
// ──────────────────────────────────────────────────────────

const BREATH_PATTERNS = [
  { name: 'basic',    label: '4:6 Basic',     phases: [{ name: 'Breathe In', duration: 4 }, { name: 'Breathe Out', duration: 6 }],
    note: 'The 4:6 pattern activates your parasympathetic nervous system, promoting calm and focus.' },
  { name: 'relaxing', label: '4:7:8 Relaxing',phases: [{ name: 'Breathe In', duration: 4 }, { name: 'Hold', duration: 7 }, { name: 'Breathe Out', duration: 8 }],
    note: 'The 4:7:8 pattern is deeply relaxing. Inhale through the nose, hold, then exhale through the mouth.' },
  { name: 'box',      label: '4:4:4:4 Box',   phases: [{ name: 'Breathe In', duration: 4 }, { name: 'Hold', duration: 4 }, { name: 'Breathe Out', duration: 4 }, { name: 'Hold', duration: 4 }],
    note: 'Box breathing is used by Navy SEALs for stress relief. Equal phases create balance and clarity.' },
];

// ── BreathingLotus SVG — petals open/close driven by openness 0–1 ──
const BreathingLotus = ({ openness, phase }) => {
  const petalSpread = 22 * openness;       // 0 → 22° outward rotation
  const petalScale = 0.85 + 0.25 * openness;
  const glowOpacity = 0.4 + 0.5 * openness;
  const palette = {
    in:   { core: '#22d3ee', edge: '#0891b2', aura: 'rgba(34,211,238,0.35)' },
    hold: { core: '#fb923c', edge: '#c2410c', aura: 'rgba(251,146,60,0.30)' },
    out:  { core: '#fbbf24', edge: '#b45309', aura: 'rgba(251,191,36,0.30)' },
    idle: { core: '#d1d5db', edge: '#6b7280', aura: 'rgba(156,163,175,0.20)' },
  }[phase];

  const outerAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const innerAngles = outerAngles.map(a => a + 22.5);

  return (
    <svg viewBox="-150 -150 300 300" width="320" height="320" role="img" aria-label={'Lotus, ' + phase}>
      <defs>
        <radialGradient id="lotusPetal" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={palette.core} stopOpacity="0.95" />
          <stop offset="65%" stopColor={palette.core} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette.edge} stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id="lotusAura" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={palette.aura} />
          <stop offset="70%" stopColor={palette.aura.replace(/,[\d.]+\)$/, ',0.1)')} />
          <stop offset="100%" stopColor={palette.aura.replace(/,[\d.]+\)$/, ',0)')} />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="135" fill="url(#lotusAura)" style={{ transition: 'opacity 0.3s' }} opacity={glowOpacity} />
      {outerAngles.map(angle => (
        <g key={'o' + angle} transform={`rotate(${angle})`}>
          <path d="M 0 -10 Q -28 -60 0 -120 Q 28 -60 0 -10 Z"
            fill="url(#lotusPetal)" stroke={palette.edge} strokeWidth="1" opacity="0.9"
            style={{
              transform: `rotate(${-petalSpread}deg) scale(${petalScale})`,
              transformOrigin: '0 0',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}/>
        </g>
      ))}
      {innerAngles.map(angle => (
        <g key={'i' + angle} transform={`rotate(${angle})`}>
          <path d="M 0 -8 Q -18 -40 0 -85 Q 18 -40 0 -8 Z"
            fill="url(#lotusPetal)" stroke={palette.edge} strokeWidth="1" opacity="0.95"
            style={{
              transform: `rotate(${-petalSpread * 0.6}deg) scale(${petalScale})`,
              transformOrigin: '0 0',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}/>
        </g>
      ))}
      <circle cx="0" cy="0" r={14 + 8 * openness} fill={palette.core} />
      <circle cx="0" cy="0" r={6 + 4 * openness} fill="#fff" opacity={0.4 + 0.4 * openness} />
    </svg>
  );
};

const BreathingPatterns = () => {
  const [patternIdx, setPatternIdx] = React.useState(0);
  const [active, setActive] = React.useState(false);
  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [phaseElapsed, setPhaseElapsed] = React.useState(0);
  const [cycles, setCycles] = React.useState(0);
  const [sound, setSound] = React.useState(true);

  const pattern = BREATH_PATTERNS[patternIdx];
  const phase = pattern.phases[phaseIdx];
  const phaseProgress = phase ? phaseElapsed / phase.duration : 0;

  const openness = (() => {
    if (!active || !phase) return 0;
    if (phase.name === 'Breathe In')  return phaseProgress;
    if (phase.name === 'Breathe Out') return 1 - phaseProgress;
    return phaseIdx === 1 ? 1 : 0;
  })();
  const lotusPhase = !active ? 'idle' : phase.name === 'Breathe In' ? 'in' : phase.name === 'Hold' ? 'hold' : 'out';

  const reset = () => {
    setActive(false); setPhaseIdx(0); setPhaseElapsed(0); setCycles(0);
  };

  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setPhaseElapsed(prev => {
        const next = prev + 0.1;
        if (next >= phase.duration) {
          const nextIdx = phaseIdx + 1;
          if (nextIdx >= pattern.phases.length) {
            setPhaseIdx(0);
            setCycles(c => c + 1);
          } else {
            setPhaseIdx(nextIdx);
          }
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [active, phaseIdx, phase, pattern]);

  const remaining = phase ? Math.ceil(phase.duration - phaseElapsed) : 0;

  return (
    <div className="session-stage">
      <div className="session-bg" style={{ backgroundImage: 'url(assets/pexels/pillar-breathing-meditation.jpg)' }} />
      <div className="session-bg-veil" />
      <div className="session-content">
        {/* Pattern selector */}
        <div className="pattern-row">
          {BREATH_PATTERNS.map((p, i) => (
            <button key={p.name} onClick={() => { if (!active) { setPatternIdx(i); reset(); } }}
              disabled={active}
              className={'pattern-btn ' + (patternIdx === i ? 'active' : '')}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Lotus with phase + countdown overlay */}
        <div style={{ position: 'relative', width: 320, height: 320 }}>
          <BreathingLotus openness={openness} phase={lotusPhase} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ textAlign: 'center', color: '#1a1a1a', textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}>
              {active && phase ? (
                <>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.02em' }}>{phase.name}</p>
                  <p style={{ fontSize: '3rem', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{remaining}</p>
                </>
              ) : (
                <span style={{ fontSize: '1rem', color: '#64748b' }}>Ready</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="session-stats">
          <div><div className="n">{cycles}</div><div className="l">Cycles</div></div>
          <div className="div" />
          <div><div className="n">{pattern.phases.map(p => p.duration).join(':')}</div><div className="l">Pattern</div></div>
        </div>

        {/* Controls */}
        <div className="session-controls">
          <Button onClick={() => active ? reset() : setActive(true)}
            style={active ? { background: '#ef4444', minWidth: 160, justifyContent: 'center' } : { minWidth: 160, justifyContent: 'center' }}>
            <LucideIcon name={active ? 'square' : 'play'} size={18} color="#fff" /> {active ? 'Stop' : 'Start'}
          </Button>
          <button className="btn btn-ghost" onClick={() => setSound(s => !s)} aria-label="Toggle audio">
            <LucideIcon name={sound ? 'volume-2' : 'volume-x'} size={18} />
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
          {pattern.note}
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  2. MEDITATION — sukhasana figure + circular progress
// ──────────────────────────────────────────────────────────

const MeditationPosture = ({ breathing }) => (
  <svg viewBox="0 0 240 200" width="220" height="180" role="img" aria-label="Cross-legged seated meditation (sukhasana)">
    <defs>
      <linearGradient id="postureFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFB873" />
        <stop offset="60%" stopColor="#FF9933" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="postureAura" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stopColor="#FFB873" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#FF9933" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="120" cy="110" rx="100" ry="85" fill="url(#postureAura)"
      className={breathing ? 'posture-aura-breathe' : ''} style={{ transformOrigin: '120px 110px' }} />
    <path d="M 60 175 Q 75 140 120 142 Q 165 140 180 175 Q 175 178 120 178 Q 65 178 60 175 Z"
      fill="url(#postureFill)" opacity="0.85" />
    <path d="M 95 168 Q 110 152 120 152 Q 130 152 145 168 Z" fill="#000" opacity="0.08" />
    <g className={breathing ? 'posture-torso-breathe' : ''} style={{ transformOrigin: '120px 130px', transformBox: 'fill-box' }}>
      <path d="M 120 70 Q 95 78 92 110 Q 90 135 120 142 Q 150 135 148 110 Q 145 78 120 70 Z" fill="url(#postureFill)" />
      <circle cx="120" cy="55" r="18" fill="url(#postureFill)" />
      <rect x="115" y="69" width="10" height="6" fill="#D97706" opacity="0.55" />
      <path d="M 98 92 Q 78 115 80 138 Q 82 144 92 142" stroke="url(#postureFill)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M 142 92 Q 162 115 160 138 Q 158 144 148 142" stroke="url(#postureFill)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="88" cy="142" r="4" fill="#D97706" opacity="0.7" />
      <circle cx="152" cy="142" r="4" fill="#D97706" opacity="0.7" />
    </g>
  </svg>
);

const MeditationTimer = () => {
  const DURATIONS = [5, 10, 15, 20, 30];
  const [duration, setDuration] = React.useState(10);
  const [remaining, setRemaining] = React.useState(10 * 60);
  const [active, setActive] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [sound, setSound] = React.useState(true);
  const total = duration * 60;
  const elapsed = total - remaining;
  const progress = elapsed / total;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  React.useEffect(() => {
    if (!active || complete) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { setActive(false); setComplete(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, complete]);

  const reset = () => {
    setActive(false); setComplete(false); setRemaining(duration * 60);
  };
  const selectDuration = (m) => {
    if (active) return;
    setDuration(m); setRemaining(m * 60); setComplete(false);
  };
  const fmt = (s) => {
    const m = Math.floor(s / 60), r = s % 60;
    return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
  };

  if (complete) {
    return (
      <div className="session-complete">
        <div className="session-complete-orb">
          <LucideIcon name="sparkles" size={42} color="#fff" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 8 }}>Namaste</div>
            <div style={{ fontSize: '0.78rem', color: '#FEF3C7', marginTop: 2 }}>Session Complete</div>
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem' }}>Well Done!</h3>
        <p style={{ color: '#64748b', textAlign: 'center', maxWidth: 380 }}>
          You meditated for {duration} minutes. Your mind is clearer and more focused.
        </p>
        <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <LucideIcon name="sparkles" size={12} /> +15 karma earned
        </span>
        <Button variant="ghost" onClick={reset}>
          <LucideIcon name="rotate-ccw" size={14} /> Restart meditation
        </Button>
      </div>
    );
  }

  return (
    <div className="session-stage">
      <div className="session-bg" style={{ backgroundImage: 'url(assets/pexels/pillar-healing-meditation.jpg)' }} />
      <div className="session-bg-veil" />
      <div className="session-content">
        {/* Duration selector */}
        <div className="pattern-row">
          {DURATIONS.map(m => (
            <button key={m} onClick={() => selectDuration(m)} disabled={active}
              className={'pattern-btn ' + (duration === m ? 'active' : '')}>{m} min</button>
          ))}
        </div>

        <MeditationPosture breathing={active} />

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', filter: 'blur(40px)', background: active ? 'rgba(255,153,51,0.15)' : 'rgba(255,153,51,0.05)', transform: 'scale(1.3)' }} />
          <svg width="280" height="280" style={{ position: 'relative', transform: 'rotate(-90deg)' }}>
            <circle cx="140" cy="140" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="8" opacity="0.3" />
            <circle cx="140" cy="140" r={radius} fill="none" stroke="url(#medGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
            <defs>
              <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>{fmt(remaining)}</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 6 }}>{active ? 'Meditating…' : 'Ready'}</span>
          </div>
        </div>

        <div className="session-controls">
          <button className="btn btn-ghost" onClick={reset} disabled={elapsed === 0}>
            <LucideIcon name="rotate-ccw" size={18} />
          </button>
          <Button onClick={() => setActive(a => !a)}
            style={active ? { background: '#ef4444', minWidth: 140, justifyContent: 'center' } : { minWidth: 140, justifyContent: 'center' }}>
            <LucideIcon name={active ? 'pause' : 'play'} size={18} color="#fff" /> {active ? 'Pause' : (elapsed > 0 ? 'Resume' : 'Start')}
          </Button>
          <button className="btn btn-ghost" onClick={() => setSound(s => !s)}>
            <LucideIcon name={sound ? 'volume-2' : 'volume-x'} size={18} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
          Find a comfortable position. Close your eyes and focus on your breath. Let thoughts pass without judgment.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  3. MOVEMENT — HIIT timer + yoga GIF gallery
// ──────────────────────────────────────────────────────────

const YOGA_POSES = [
  { name: 'Surya Namaskar',  description: '12-step sun salutation. Inhale on backbend, exhale on forward fold. Cycle 4–6 rounds.',  duration: '5–8 min',  gif: 'assets/pexels/posture-30min-movement.gif', accent: '#FF5722' },
  { name: 'Morning Stretch', description: 'Gentle full-body warm-up. Cat-cow, hip openers, side bends.',                              duration: '5 min',    gif: 'assets/pexels/posture-morning-stretch.gif', accent: '#F59E0B' },
  { name: 'Strength Flow',   description: 'Bodyweight strength sequence — plank, push-up, warrior holds.',                            duration: '15 min',   gif: 'assets/pexels/posture-strength.gif', accent: '#E91E63' },
  { name: 'Outdoor Walk',    description: 'Mindful walking — feel each step. Aim for 30 min in nature.',                              duration: '30 min',   gif: 'assets/pexels/posture-outdoor.gif', accent: '#10B981' },
  { name: 'Mindful Walk',    description: 'Slow indoor pacing with attention on the breath.',                                         duration: '10 min',   gif: 'assets/pexels/posture-walking.gif', accent: '#22D3EE' },
  { name: 'Hourly Standing', description: 'Stand up every hour for 2 minutes. Resets posture and circulation.',                       duration: '2 min',    gif: 'assets/pexels/posture-hourly-standing.gif', accent: '#673AB7' },
  { name: 'Body Scan',       description: 'Lie still, sweep attention from toes to crown. Releases held tension.',                    duration: '10 min',   gif: 'assets/pexels/posture-body-scan.jpg', accent: '#A855F7' },
];

const MovementTimer = () => {
  const [poseIdx, setPoseIdx] = React.useState(0);
  const [workTime, setWorkTime] = React.useState(30);
  const [restTime, setRestTime] = React.useState(10);
  const [rounds, setRounds] = React.useState(8);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [phase, setPhase] = React.useState('idle'); // idle / work / rest / complete
  const [remaining, setRemaining] = React.useState(30);
  const [active, setActive] = React.useState(false);
  const [sound, setSound] = React.useState(true);

  const pose = YOGA_POSES[poseIdx];
  const phaseDuration = phase === 'work' ? workTime : restTime;
  const radius = 110, circumference = 2 * Math.PI * radius;
  const progress = phase === 'idle' || phase === 'complete' ? 0 : (phaseDuration - remaining) / phaseDuration;
  const offset = circumference * (1 - progress);

  const reset = () => {
    setActive(false); setPhase('idle'); setCurrentRound(1); setRemaining(workTime);
  };

  React.useEffect(() => {
    if (!active || phase === 'idle' || phase === 'complete') return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (phase === 'work') {
            if (currentRound >= rounds) {
              setPhase('complete'); setActive(false); return 0;
            }
            setPhase('rest'); return restTime;
          } else {
            setCurrentRound(r => r + 1); setPhase('work'); return workTime;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, phase, currentRound, rounds, workTime, restTime]);

  const start = () => {
    if (phase === 'idle' || phase === 'complete') {
      setPhase('work'); setCurrentRound(1); setRemaining(workTime);
    }
    setActive(true);
  };
  const pause = () => setActive(false);
  const adjust = (setter, delta, min, max) => {
    if (active) return;
    setter(v => Math.max(min, Math.min(max, v + delta)));
  };

  if (phase === 'complete') {
    return (
      <div className="session-complete">
        <div className="session-complete-orb">
          <LucideIcon name="trophy" size={56} color="#fff" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem' }}>Workout Complete!</h3>
        <p style={{ color: '#64748b', textAlign: 'center', maxWidth: 380 }}>
          You crushed {rounds} rounds of <strong>{pose.name}</strong>. Stay consistent, stay strong.
        </p>
        <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <LucideIcon name="sparkles" size={12} /> +12 karma earned
        </span>
        <Button variant="ghost" onClick={reset}>
          <LucideIcon name="rotate-ccw" size={14} /> New workout
        </Button>
      </div>
    );
  }

  return (
    <div className="session-stage movement-stage">
      <div className="session-content" style={{ alignItems: 'stretch' }}>
        <div className="movement-layout">
          {/* Left — pose gallery */}
          <aside className="pose-gallery">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Choose a movement</div>
            <div className="pose-list">
              {YOGA_POSES.map((p, i) => (
                <button key={p.name}
                  className={'pose-card ' + (poseIdx === i ? 'active' : '')}
                  onClick={() => { if (!active) setPoseIdx(i); }}
                  disabled={active}
                  style={{ '--accent': p.accent }}>
                  <img src={p.gif} alt={p.name} />
                  <div className="pose-card-body">
                    <h4>{p.name}</h4>
                    <div className="pose-meta">
                      <LucideIcon name="clock" size={11} /> {p.duration}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Right — active pose + HIIT timer */}
          <section className="movement-active">
            <div className="movement-active-hero">
              <img src={pose.gif} alt={pose.name} />
              <div className="movement-active-overlay">
                <h2>{pose.name}</h2>
                <p>{pose.description}</p>
              </div>
            </div>

            {/* HIIT controls (visible only when idle) */}
            {phase === 'idle' && (
              <div className="hiit-row">
                <div className="hiit-stepper">
                  <div className="l">Work (sec)</div>
                  <div className="ctrl">
                    <button onClick={() => adjust(setWorkTime, -5, 10, 120)}>−</button>
                    <span>{workTime}</span>
                    <button onClick={() => adjust(setWorkTime, 5, 10, 120)}>+</button>
                  </div>
                </div>
                <div className="hiit-stepper">
                  <div className="l">Rest (sec)</div>
                  <div className="ctrl">
                    <button onClick={() => adjust(setRestTime, -5, 5, 60)}>−</button>
                    <span>{restTime}</span>
                    <button onClick={() => adjust(setRestTime, 5, 5, 60)}>+</button>
                  </div>
                </div>
                <div className="hiit-stepper">
                  <div className="l">Rounds</div>
                  <div className="ctrl">
                    <button onClick={() => adjust(setRounds, -1, 1, 20)}>−</button>
                    <span>{rounds}</span>
                    <button onClick={() => adjust(setRounds, 1, 1, 20)}>+</button>
                  </div>
                </div>
              </div>
            )}

            {/* Circular HIIT timer */}
            <div style={{ position: 'relative', alignSelf: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', filter: 'blur(40px)',
                background: phase === 'work' ? 'rgba(249,115,22,0.20)' : phase === 'rest' ? 'rgba(34,197,94,0.20)' : 'rgba(0,0,0,0.05)',
                transform: 'scale(1.3)' }} />
              <svg width="240" height="240" style={{ position: 'relative', transform: 'rotate(-90deg)' }}>
                <circle cx="120" cy="120" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="8" opacity="0.3" />
                <circle cx="120" cy="120" r={radius} fill="none"
                  stroke={phase === 'work' ? 'url(#workG)' : phase === 'rest' ? 'url(#restG)' : 'var(--color-border)'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
                <defs>
                  <linearGradient id="workG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933" /><stop offset="100%" stopColor="#E8860D" />
                  </linearGradient>
                  <linearGradient id="restG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: phase === 'work' ? '#EA580C' : phase === 'rest' ? '#16A34A' : '#64748b' }}>
                  {phase === 'idle' ? 'Ready' : phase === 'work' ? 'Work' : 'Rest'}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{remaining}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                  {phase !== 'idle' ? `Round ${currentRound} / ${rounds}` : `${rounds} rounds`}
                </span>
              </div>
            </div>

            {/* Round indicators */}
            {phase !== 'idle' && (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {Array.from({ length: rounds }).map((_, i) => (
                  <span key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < currentRound - 1 ? '#FF9933' : i === currentRound - 1
                      ? (phase === 'work' ? '#FF9933' : '#22c55e') : 'var(--color-border)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            )}

            <div className="session-controls">
              {(phase === 'work' || phase === 'rest') && (
                <button className="btn btn-ghost" onClick={reset}><LucideIcon name="rotate-ccw" size={18} /></button>
              )}
              <Button onClick={active ? pause : start}
                style={active && phase === 'work' ? { background: '#ef4444', minWidth: 140, justifyContent: 'center' } : { minWidth: 140, justifyContent: 'center' }}>
                <LucideIcon name={active ? 'pause' : 'play'} size={18} color="#fff" /> {active ? 'Pause' : (phase === 'idle' ? 'Start' : 'Resume')}
              </Button>
              <button className="btn btn-ghost" onClick={() => setSound(s => !s)}>
                <LucideIcon name={sound ? 'volume-2' : 'volume-x'} size={18} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  4. MORNING ROUTINE — checklist of dawn practices
// ──────────────────────────────────────────────────────────

const MORNING_STEPS = [
  { name: 'Wake at 5 AM',   description: 'Brahma Muhurta — the most sattvic time of day.',  icon: 'sunrise',    color: '#FFD700', duration: '0 min',  gif: null },
  { name: 'Tongue scraping',description: 'Remove ama (toxins) accumulated overnight.',       icon: 'sparkles',   color: '#10B981', duration: '1 min',  gif: null },
  { name: 'Warm water',     description: 'Drink 16oz of warm water to stimulate digestion.', icon: 'glass-water',color: '#06B6D4', duration: '1 min',  gif: null },
  { name: 'Sun salutation', description: '4–6 rounds of Surya Namaskar.',                    icon: 'sun',        color: '#F59E0B', duration: '5–8 min',gif: 'assets/pexels/posture-30min-movement.gif' },
  { name: 'Pranayama',      description: 'Nadi Shodhana — alternate-nostril breathing.',     icon: 'wind',       color: '#00BCD4', duration: '5 min',  gif: null },
  { name: 'Sandhya',        description: 'Dawn meditation facing the sun.',                  icon: 'sun-medium', color: '#FFC107', duration: '15 min', gif: null },
  { name: 'Sankalpa',       description: 'Set the intention for today in writing.',          icon: 'pen-line',   color: '#9C27B0', duration: '3 min',  gif: null },
];

const MorningRoutine = () => {
  const [done, setDone] = React.useState(new Set([0, 1, 2]));
  const toggle = (i) => {
    setDone(s => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div className="session-stage">
      <div className="session-bg" style={{ backgroundImage: 'url(assets/pexels/pillar-morning-initiation.jpg)' }} />
      <div className="session-bg-veil" />
      <div className="session-content" style={{ alignItems: 'stretch', maxWidth: 720, margin: '0 auto' }}>
        <header style={{ textAlign: 'center' }}>
          <Eyebrow>The Brahma Muhurta sequence</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginTop: 6 }}>
            <span className="text-orange-amber-gradient">Morning Routine</span>
          </h2>
          <p style={{ color: '#64748b', marginTop: 6 }}>{done.size} of {MORNING_STEPS.length} steps complete this morning.</p>
        </header>
        <div className="morning-list">
          {MORNING_STEPS.map((s, i) => (
            <div key={s.name} className={'morning-step ' + (done.has(i) ? 'done' : '')} onClick={() => toggle(i)}>
              <button className={'morning-check ' + (done.has(i) ? 'on' : '')}>
                {done.has(i) && <LucideIcon name="check" size={14} color="#fff" />}
              </button>
              <div className="morning-step-icon" style={{ background: s.color + '22', color: s.color }}>
                <LucideIcon name={s.icon} size={22} color={s.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4>{s.name}</h4>
                <p>{s.description}</p>
              </div>
              <span className="morning-dur">{s.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  5. FASTING — eating window tracker
// ──────────────────────────────────────────────────────────

const FastingTimer = () => {
  const [eatingHours, setEatingHours] = React.useState(8);
  const fastingHours = 24 - eatingHours;
  // Mock: fasting started 11h ago at 8 PM yesterday
  const elapsed = 11;
  const progress = elapsed / fastingHours;
  const radius = 110, circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const remaining = fastingHours - elapsed;
  const fmt = (h) => Math.floor(h) + 'h ' + Math.round((h % 1) * 60) + 'm';

  return (
    <div className="session-stage">
      <div className="session-bg" style={{ backgroundImage: 'url(assets/pexels/pillar-nutrition-fasting.jpg)' }} />
      <div className="session-bg-veil" />
      <div className="session-content">
        <Eyebrow>Intermittent fasting</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>{fastingHours}-hour fast active</h2>

        <div className="pattern-row">
          {[6, 8, 10, 12].map(h => (
            <button key={h} onClick={() => setEatingHours(h)}
              className={'pattern-btn ' + (eatingHours === h ? 'active' : '')}>
              {24 - h}:{h}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <svg width="260" height="260" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="8" opacity="0.3" />
            <circle cx="130" cy="130" r={radius} fill="none" stroke="url(#fastG)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset} />
            <defs>
              <linearGradient id="fastG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D97706' }}>Time remaining</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: '#1a1a1a', marginTop: 4 }}>{fmt(remaining)}</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>{Math.round(progress * 100)}% complete</span>
          </div>
        </div>

        <div className="session-stats">
          <div><div className="n">{fmt(elapsed)}</div><div className="l">Elapsed</div></div>
          <div className="div" />
          <div><div className="n">8:00 PM</div><div className="l">Started</div></div>
          <div className="div" />
          <div><div className="n">7:00 AM</div><div className="l">Eat next</div></div>
        </div>

        <Button>
          <LucideIcon name="square" size={16} color="#fff" /> End fast early
        </Button>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
          Eating window: 11 AM – 7 PM. Drink water freely; herbal tea and black coffee are fine.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  Sessions tab shell
// ──────────────────────────────────────────────────────────

const SESSION_TABS = [
  { name: 'Morning Routine', icon: 'sun', Component: MorningRoutine },
  { name: 'Fasting', icon: 'utensils-crossed', Component: FastingTimer },
  { name: 'Breathing', icon: 'wind', Component: BreathingPatterns },
  { name: 'Movement', icon: 'dumbbell', Component: MovementTimer },
  { name: 'Meditation', icon: 'timer', Component: MeditationTimer },
  { name: 'Sandhya', icon: 'sun-medium', Component: () => typeof SandhyaPractice !== 'undefined' ? <SandhyaPractice /> : null },
  { name: 'Brahman', icon: 'infinity', Component: () => typeof BrahmanPractice !== 'undefined' ? <BrahmanPractice /> : null },
  { name: 'Manifest', icon: 'sparkles', Component: () => typeof ManifestationPractice !== 'undefined' ? <ManifestationPractice /> : null },
  { name: 'Sleep', icon: 'moon', Component: () => typeof SleepPractice !== 'undefined' ? <SleepPractice /> : null },
];

const SessionsPage = ({ initialTab = 0 }) => {
  const [tab, setTab] = React.useState(initialTab);
  const Active = SESSION_TABS[tab].Component;
  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <header>
        <h1 className="page-title">Guided Sessions</h1>
        <p className="page-subtitle">Interactive tools to support your daily practice and transformation.</p>
      </header>
      <div className="sessions-tabs">
        {SESSION_TABS.map((t, i) => (
          <button key={t.name} className={'sessions-tab ' + (tab === i ? 'active' : '')} onClick={() => setTab(i)}>
            <LucideIcon name={t.icon} size={16} color={tab === i ? '#fff' : '#64748b'} />
            <span>{t.name}</span>
          </button>
        ))}
      </div>
      <div className="vedic-card" style={{ padding: 0, overflow: 'hidden' }}>
        <Active />
      </div>
    </div>
  );
};

Object.assign(window, {
  SessionsPage, BreathingPatterns, BreathingLotus, MeditationTimer, MeditationPosture,
  MovementTimer, MorningRoutine, FastingTimer, YOGA_POSES,
});
