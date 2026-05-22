// ===== Sessions extended — 4 new tabs for Sandhya · Brahman · Manifestation · Sleep =====
// Each is a self-contained interactive timer/practice that completes the
// 9-tab Sessions grid (Morning · Fasting · Breathing · Movement · Meditation +
// Sandhya · Brahman · Manifestation · Sleep).

// ──────────────────────────────────────────────────────────
//  6. SANDHYA — 3-times-daily face-direction + mantra counter
// ──────────────────────────────────────────────────────────
const SANDHYAS = [
  { id: 'pratah',  label: 'Pratah · Dawn',     time: '5:30 AM',  face: 'East',   color: '#F59E0B', bgGrad: 'linear-gradient(135deg, #5B2C6F, #E67E22)' },
  { id: 'madhya',  label: 'Madhya · Noon',     time: '12:00 PM', face: 'North',  color: '#3498DB', bgGrad: 'linear-gradient(135deg, #3498DB, #85C1E9)' },
  { id: 'sayam',   label: 'Sayam · Dusk',      time: '6:00 PM',  face: 'West',   color: '#D35400', bgGrad: 'linear-gradient(135deg, #D35400, #4A235A)' },
];

const SandhyaPractice = () => {
  const [active, setActive] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [chanting, setChanting] = React.useState(false);
  const sandhya = SANDHYAS[active];

  React.useEffect(() => {
    if (!chanting) return;
    const id = setInterval(() => setCount(c => c + 1 >= 108 ? (setChanting(false), 108) : c + 1), 800);
    return () => clearInterval(id);
  }, [chanting]);

  return (
    <div className="session-stage" style={{ background: sandhya.bgGrad, padding: 32 }}>
      <div className="session-content">
        <Eyebrow style={{ color: 'rgba(255,255,255,0.85)' }}>Sandhyavandana · सन्ध्यावन्दना</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.5rem', fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>The three junctures of the day</h2>

        {/* Sandhya picker */}
        <div className="pattern-row">
          {SANDHYAS.map((s, i) => (
            <button key={s.id} onClick={() => { setActive(i); setCount(0); setChanting(false); }}
              className={'pattern-btn ' + (active === i ? 'active' : '')}
              style={active === i ? {} : { background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Compass — face this direction */}
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg viewBox="0 0 220 220" width="220" height="220">
            <circle cx="110" cy="110" r="100" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            <circle cx="110" cy="110" r="70" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="110" y="32"  textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" opacity={sandhya.face === 'North' ? 1 : 0.4}>N</text>
            <text x="195" y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" opacity={sandhya.face === 'East'  ? 1 : 0.4}>E</text>
            <text x="110" y="200" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" opacity={sandhya.face === 'South' ? 1 : 0.4}>S</text>
            <text x="25"  y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" opacity={sandhya.face === 'West'  ? 1 : 0.4}>W</text>
            {/* Needle pointing at the right direction */}
            <g transform={`translate(110 110) rotate(${{North:0,East:90,South:180,West:270}[sandhya.face]})`}>
              <path d="M 0 -70 L 10 0 L 0 -8 L -10 0 Z" fill="#FFD700" stroke="#fff" strokeWidth="1" />
              <circle r="6" fill="#FFD700" />
            </g>
          </svg>
        </div>

        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85 }}>Face {sandhya.face} · {sandhya.time}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{count} <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>/ 108</span></div>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: 4 }}>Gayatri mantra · ॐ भूर्भुवः स्वः</div>
        </div>

        <div className="session-controls">
          <Button onClick={() => { setChanting(c => !c); }} style={count === 108 ? { background: '#10B981', minWidth: 160, justifyContent: 'center' } : { minWidth: 160, justifyContent: 'center' }}>
            {count === 108 ? <><LucideIcon name="check" size={16} color="#fff" /> Complete</> : chanting ? <><LucideIcon name="pause" size={16} color="#fff" /> Pause</> : <><LucideIcon name="play" size={16} color="#fff" /> {count === 0 ? 'Begin chant' : 'Resume'}</>}
          </Button>
          <button className="btn" onClick={() => { setCount(0); setChanting(false); }} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            <LucideIcon name="rotate-ccw" size={16} color="#fff" />
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 420, fontSize: '0.85rem' }}>
          Recite 108 times. Each repetition is one bead on the mala. Eyes closed, attention on the inner space between the brows.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  9. BRAHMAN CONNECTION — silent expansion meditation
// ──────────────────────────────────────────────────────────

const BrahmanPractice = () => {
  const [phase, setPhase] = React.useState('idle'); // idle | expanding | infinite | returning
  const [elapsed, setElapsed] = React.useState(0);
  const SEQ = [['expanding', 60], ['infinite', 180], ['returning', 60]];

  React.useEffect(() => {
    if (phase === 'idle') return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  React.useEffect(() => {
    let cum = 0;
    for (const [name, dur] of SEQ) {
      cum += dur;
      if (elapsed === cum) {
        const next = SEQ[SEQ.findIndex(s => s[0] === name) + 1];
        setPhase(next ? next[0] : 'complete');
        return;
      }
    }
  }, [elapsed]);

  const phaseLabel = {
    idle: 'Sit comfortably · close your eyes',
    expanding: 'Expanding · feel your edges dissolve',
    infinite: 'Infinite · rest in awareness',
    returning: 'Returning · bring it back to the body',
    complete: 'Namaste',
  }[phase];

  const ringScale = phase === 'idle' ? 0.5 : phase === 'expanding' ? 0.5 + (elapsed/60) * 0.5 : phase === 'infinite' ? 1 : 1 - ((elapsed - 240)/60) * 0.5;

  return (
    <div className="session-stage" style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b4b, #050514)', minHeight: 540 }}>
      <div className="session-content">
        <Eyebrow style={{ color: '#FCD34D' }}>Brahma Sambandha · ब्रह्म सम्बन्ध</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Connection to the infinite</h2>

        <div style={{ position: 'relative', width: 280, height: 280 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid rgba(255,215,0,' + (0.5 - i*0.1) + ')',
              transform: 'scale(' + (ringScale * (1 - i*0.18)) + ')',
              transition: 'transform 1s ease-out',
            }} />
          ))}
          <div style={{ position: 'absolute', inset: '40%', borderRadius: '50%', background: 'radial-gradient(circle, #FFD700, #FF9933)', boxShadow: '0 0 50px #FFD700' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#FFD700', fontWeight: 800 }}>ॐ</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, color: '#FCD34D' }}>{phaseLabel}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')} <span style={{ fontSize: '1rem', opacity: 0.7 }}> / 5:00</span></div>
        </div>

        <div className="session-controls">
          <Button onClick={() => { if (phase === 'idle' || phase === 'complete') { setPhase('expanding'); setElapsed(0); } else setPhase('idle'); }} style={{ minWidth: 160, justifyContent: 'center' }}>
            <LucideIcon name={phase === 'idle' || phase === 'complete' ? 'play' : 'square'} size={16} color="#fff" /> {phase === 'idle' || phase === 'complete' ? 'Begin' : 'End'}
          </Button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: 460, fontSize: '0.85rem' }}>
          5 minutes of silent expansion meditation. Let go of body, breath, and thought. Rest in pure awareness.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  10. MANIFESTATION — intention writing + visualization
// ──────────────────────────────────────────────────────────

const ManifestationPractice = () => {
  const [intention, setIntention] = React.useState('');
  const [step, setStep] = React.useState('write'); // write | visualize | seal
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (step !== 'visualize') return;
    const id = setInterval(() => setSeconds(s => {
      if (s + 1 >= 60) { setStep('seal'); return 0; }
      return s + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className="session-stage anim-stage-light" style={{ background: 'linear-gradient(180deg, #FAF5FF 0%, #FEF3C7 100%)' }}>
      <div className="session-content">
        <Eyebrow style={{ color: '#7C3AED' }}>Sankalpa Shakti · सङ्कल्प शक्ति</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>Manifest with intention</h2>

        {step === 'write' && (
          <React.Fragment>
            <div style={{ width: '100%', maxWidth: 520 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Write your intention in one clear sentence — present tense.</label>
              <textarea value={intention} onChange={e => setIntention(e.target.value)} rows={3}
                placeholder="I am calm, clear, and grounded in everything I do."
                style={{ width: '100%', padding: 16, border: '2px solid var(--color-border)', borderRadius: 12, fontSize: '1.05rem', outline: 'none', resize: 'none', background: '#fff', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} />
            </div>
            <Button onClick={() => intention.trim() && setStep('visualize')} disabled={!intention.trim()} style={{ minWidth: 200, justifyContent: 'center' }}>
              <LucideIcon name="arrow-right" size={16} color="#fff" /> Begin 60-sec visualization
            </Button>
          </React.Fragment>
        )}

        {step === 'visualize' && (
          <React.Fragment>
            <div style={{ position: 'relative', width: 260, height: 260 }}>
              <svg viewBox="0 0 260 260" width="260" height="260">
                <defs>
                  <radialGradient id="mfCore" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF8DC" /><stop offset="60%" stopColor="#FFD700" /><stop offset="100%" stopColor="#A855F7" stopOpacity="0" /></radialGradient>
                </defs>
                <circle cx="130" cy="130" r="120" fill="none" stroke="#A855F7" strokeWidth="3" opacity="0.3" strokeDasharray={2 * Math.PI * 120} strokeDashoffset={(2 * Math.PI * 120) * (1 - seconds/60)} transform="rotate(-90 130 130)" />
                <circle cx="130" cy="130" r="60" fill="url(#mfCore)" style={{ transform: `scale(${1 + Math.sin(seconds * 0.4) * 0.08})`, transformOrigin: '130px 130px', transition: 'transform 0.2s' }} />
                <text x="130" y="138" textAnchor="middle" fontFamily="Plus Jakarta Sans, Inter, system-ui" fontSize="40" fontWeight="800" fill="#1a1a1a">{60 - seconds}</text>
              </svg>
            </div>
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Visualize as if it's already true</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#7C3AED', fontStyle: 'italic' }}>"{intention}"</p>
            </div>
          </React.Fragment>
        )}

        {step === 'seal' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24, #d97706)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 12px 30px rgba(217,119,6,0.25)' }}>
              <LucideIcon name="sparkles" size={42} color="#fff" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>Sealed in.</h3>
            <p style={{ color: '#64748b', maxWidth: 380, margin: '8px auto', lineHeight: 1.6 }}>
              Your intention has been sent. Now — release attachment to the outcome.
            </p>
            <Button onClick={() => { setIntention(''); setStep('write'); setSeconds(0); }} variant="ghost" style={{ marginTop: 16 }}>
              <LucideIcon name="rotate-ccw" size={14} /> Set another
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  11. SLEEP OPTIMIZATION — bedtime wind-down checklist
// ──────────────────────────────────────────────────────────

const SLEEP_RITUAL = [
  { id: 1, label: 'Screens off',           icon: 'smartphone',  color: '#3F51B5', desc: 'Phones, TVs, laptops — at least 60 min before bed.' },
  { id: 2, label: 'Warm milk + nutmeg',    icon: 'coffee',      color: '#92400E', desc: 'A teaspoon of ghee + a pinch of nutmeg in warm milk.' },
  { id: 3, label: 'Dim the lights',        icon: 'moon',        color: '#6366F1', desc: 'Candle or salt lamp only after 9 PM.' },
  { id: 4, label: 'Foot massage',          icon: 'hand',        color: '#10B981', desc: '2-min self-massage with warm sesame oil.' },
  { id: 5, label: 'Gratitude journal',     icon: 'book-open',   color: '#F59E0B', desc: 'Three things from today. Close the book.' },
  { id: 6, label: 'Yoga Nidra (10 min)',   icon: 'sparkles',    color: '#A855F7', desc: 'Body scan from the Audio Library.' },
  { id: 7, label: 'Right-side sleep',      icon: 'bed',         color: '#0EA5E9', desc: 'Lie on your right side first — opens the lunar nadi.' },
];

const SleepPractice = () => {
  const [done, setDone] = React.useState(new Set([1, 2]));
  const [bedTime, setBedTime] = React.useState('22:00');
  const [wakeTime, setWakeTime] = React.useState('05:00');
  const toggle = (id) => setDone(s => { const next = new Set(s); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const allDone = done.size === SLEEP_RITUAL.length;

  // Compute hours (handle wrap-around)
  const [bh, bm] = bedTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let hours = (wh + (wh < bh ? 24 : 0)) - bh + (wm - bm) / 60;
  if (hours < 0) hours += 24;

  return (
    <div className="session-stage" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #050514 100%)' }}>
      <div className="session-content">
        <Eyebrow style={{ color: '#FCD34D' }}>Nidra · निद्रा</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Tonight's wind-down ritual</h2>

        {/* Bed/wake time */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: 14, borderRadius: 12, textAlign: 'center', minWidth: 130 }}>
            <div style={{ fontSize: '0.7rem', color: '#A5B4FC', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Bedtime</div>
            <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', outline: 'none' }} />
          </div>
          <div style={{ color: '#A5B4FC', fontSize: '1.5rem' }}>→</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: 14, borderRadius: 12, textAlign: 'center', minWidth: 130 }}>
            <div style={{ fontSize: '0.7rem', color: '#A5B4FC', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Wake</div>
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', outline: 'none' }} />
          </div>
          <div style={{ background: 'rgba(252,211,77,0.15)', padding: 14, borderRadius: 12, textAlign: 'center', minWidth: 130, border: '1px solid rgba(252,211,77,0.3)' }}>
            <div style={{ fontSize: '0.7rem', color: '#FCD34D', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>You get</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: hours >= 7 ? '#10B981' : '#FCA5A5' }}>{hours.toFixed(1)}h</div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SLEEP_RITUAL.map(s => {
            const isDone = done.has(s.id);
            return (
              <div key={s.id} onClick={() => toggle(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 12,
                background: isDone ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.06)',
                border: '1px solid ' + (isDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.12)'),
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: isDone ? '#10B981' : 'transparent', border: '2px solid ' + (isDone ? '#10B981' : 'rgba(255,255,255,0.3)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isDone && <LucideIcon name="check" size={12} color="#fff" />}
                </span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LucideIcon name={s.icon} size={18} color={s.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.6 : 1 }}>{s.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#A5B4FC' }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {allDone && (
          <div style={{ background: 'rgba(16,185,129,0.15)', padding: '14px 22px', borderRadius: 14, color: '#86EFAC', fontWeight: 600 }}>
            <LucideIcon name="moon" size={16} color="#86EFAC" /> Sleep well. See you at {wakeTime}.
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { SandhyaPractice, BrahmanPractice, ManifestationPractice, SleepPractice });
