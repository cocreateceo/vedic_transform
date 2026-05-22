// ===== Onboarding flow + 404 + Avatar uploader + Streak shield UI =====

// ──────────────────────────────────────────────────────────
//  ONBOARDING — 4-step intro for new users
// ──────────────────────────────────────────────────────────
const ONBOARDING_GOALS = [
  { id: 'discipline', icon: 'target',  label: 'Build daily discipline',     desc: 'I want a structured 48-day routine I can\'t skip.' },
  { id: 'stress',     icon: 'wind',    label: 'Reduce stress + anxiety',    desc: 'I want my mind to feel quieter.' },
  { id: 'health',     icon: 'leaf',    label: 'Heal my body',               desc: 'Better sleep, digestion, and energy.' },
  { id: 'spirit',     icon: 'sparkles',label: 'Spiritual depth',            desc: 'Connect with something larger than myself.' },
];

const OnboardingFlow = ({ setRoute, user }) => {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(user.name || '');
  const [goal, setGoal] = React.useState(null);
  const [focus, setFocus] = React.useState(new Set());
  const toggleFocus = (slug) => setFocus(s => {
    const next = new Set(s);
    if (next.has(slug)) next.delete(slug); else if (next.size < 3) next.add(slug);
    return next;
  });
  const progress = ((step + 1) / 4) * 100;
  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));
  const finish = () => setRoute('dashboard');

  return (
    <div className="page" style={{ maxWidth: 720, margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Eyebrow>Onboarding · Step {step + 1} of 4</Eyebrow>
        <a onClick={finish} style={{ fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>Skip</a>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(to right, #f59e0b, #f97316)', transition: 'width 0.4s' }} />
      </div>

      <div className="vedic-card" style={{ padding: 36 }}>
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 12px 30px rgba(249,115,22,0.25)' }}>
              <LucideIcon name="sunrise" size={40} color="#fff" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>Welcome to <span className="text-orange-amber-gradient">10X Vedic</span></h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '12px auto', lineHeight: 1.6 }}>
              48 days. 11 daily Vedic practices. One transformation. Let's get you set up in under 2 minutes.
            </p>
            <div style={{ marginTop: 18 }}>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>What should we call you?</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--color-border)', borderRadius: 12, fontSize: '1rem', outline: 'none', background: '#FFFEF5' }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>What brings you to the Vedas?</h2>
            <p style={{ color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 24 }}>Your primary goal shapes which pillars we'll emphasize.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {ONBOARDING_GOALS.map(g => {
                const selected = goal === g.id;
                return (
                  <button key={g.id} onClick={() => setGoal(g.id)} style={{
                    padding: 18, borderRadius: 14, textAlign: 'left',
                    background: selected ? 'rgba(249,115,22,0.05)' : '#fff',
                    border: '2px solid ' + (selected ? '#f97316' : 'var(--color-border)'),
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: selected ? '#f97316' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LucideIcon name={g.icon} size={22} color={selected ? '#fff' : '#D97706'} />
                      </div>
                      {selected && <LucideIcon name="check-circle" size={18} color="#f97316" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{g.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{g.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>Pick your 1–3 focus pillars</h2>
            <p style={{ color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 20 }}>{focus.size} / 3 selected · all 11 stay available, but these get extra emphasis.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
              {PILLARS.map(p => {
                const selected = focus.has(p.slug);
                return (
                  <button key={p.id} onClick={() => toggleFocus(p.slug)}
                    disabled={!selected && focus.size >= 3}
                    style={{
                      padding: 14, borderRadius: 12, textAlign: 'left',
                      background: selected ? p.color + '15' : '#fff',
                      border: '2px solid ' + (selected ? p.color : 'var(--color-border)'),
                      cursor: !selected && focus.size >= 3 ? 'not-allowed' : 'pointer',
                      opacity: !selected && focus.size >= 3 ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}>
                    <div className={'pillar-tile-icon-wrap ' + p.bgClass} style={{ width: 36, height: 36, marginBottom: 8 }}>
                      <LucideIcon name={p.icon} size={18} color={p.color} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2, fontStyle: 'italic' }}>{p.sanskritName}</div>
                    {selected && (
                      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 700, color: p.color }}>
                        <LucideIcon name="check" size={11} color={p.color} /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24, #d97706)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 12px 30px rgba(217,119,6,0.25)' }}>
              <LucideIcon name="sparkles" size={40} color="#fff" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>You're ready, {name || 'Seeker'}.</h2>
            <p style={{ color: '#64748b', maxWidth: 460, margin: '14px auto', lineHeight: 1.6 }}>
              Your Mandala starts today. {goal ? 'Your goal: ' : ''}<strong style={{ color: '#D97706' }}>{ONBOARDING_GOALS.find(g => g.id === goal)?.label || 'Discipline'}</strong>.<br />
              Focus pillars: <strong style={{ color: '#D97706' }}>{focus.size > 0 ? [...focus].map(s => PILLARS.find(p => p.slug === s)?.name).join(', ') : 'You can pick later in Goals'}</strong>.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 12 }}>The 48-day journey begins the moment you complete your first pillar.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
          {step > 0
            ? <Button variant="ghost" onClick={back}><LucideIcon name="arrow-left" size={14} /> Back</Button>
            : <span />}
          {step < 3
            ? <Button onClick={next} style={{ minWidth: 140, justifyContent: 'center' }}
                disabled={(step === 0 && !name) || (step === 1 && !goal)}>
                Next <LucideIcon name="arrow-right" size={14} color="#fff" />
              </Button>
            : <Button onClick={finish} size="lg" style={{ minWidth: 200, justifyContent: 'center' }}>
                <LucideIcon name="sparkles" size={16} color="#fff" /> Begin My 48-Day Mandala
              </Button>}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  404 — graceful unknown-route fallback
// ──────────────────────────────────────────────────────────
const NotFoundPage = ({ setRoute, route }) => (
  <div className="page" style={{ maxWidth: 520, textAlign: 'center', margin: '80px auto' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(to right, #f97316, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginTop: 8 }}>Path not found</h2>
    <p style={{ color: '#64748b', marginTop: 8 }}>
      <code style={{ background: '#FEF3C7', padding: '2px 8px', borderRadius: 6, fontSize: '0.9em' }}>/{route}</code> doesn't exist in this mandala. Even the Vedas needed an index.
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
      <Button onClick={() => setRoute('dashboard')}>
        <LucideIcon name="layout-dashboard" size={14} color="#fff" /> Back to Dashboard
      </Button>
      <Button variant="ghost" onClick={() => setRoute('home')}>
        <LucideIcon name="home" size={14} /> Marketing home
      </Button>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────
//  Streak Shield UI — small visual showing protective shields
// ──────────────────────────────────────────────────────────
const StreakShield = ({ count = 2 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.3)' }}>
    <LucideIcon name="shield" size={12} color="#6366F1" />
    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4338CA' }}>{count} streak shield{count !== 1 ? 's' : ''}</span>
    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>protects your streak if you miss a day</span>
  </div>
);

// ──────────────────────────────────────────────────────────
//  Avatar uploader — file input → object URL preview
// ──────────────────────────────────────────────────────────
const AvatarUploader = ({ name }) => {
  const [src, setSrc] = React.useState(null);
  const inputRef = React.useRef(null);
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSrc(URL.createObjectURL(f));
  };
  const initial = (name || 'A').trim().charAt(0).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, background: '#FFFEF5', border: '1px dashed var(--color-border)', borderRadius: 12 }}>
      <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', boxShadow: '0 6px 16px rgba(249,115,22,0.25)' }}>
        {src ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
        <button onClick={() => inputRef.current?.click()} aria-label="Change avatar" style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#fff', border: '2px solid var(--goldenrod)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <LucideIcon name="camera" size={12} color="#D97706" />
        </button>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>Profile photo</div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{src ? 'Looking sharp.' : 'Click the camera icon to upload — JPG / PNG / SVG.'}</div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        {src && (
          <button onClick={() => setSrc(null)} style={{ marginTop: 6, fontSize: '0.78rem', color: '#DC2626', fontWeight: 600 }}>Remove photo</button>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  Phase-transition reflection card — surfaces on days 8, 15, 22, 31, 41, 49
// ──────────────────────────────────────────────────────────
const PHASE_REFLECTIONS = {
  cleansing:     { from: 'Foundation', summary: 'You laid the rhythm. 5 mornings before 6 AM, 4 consistent Pranayama sessions. Phase 2 asks you to lighten the system.' },
  integration:   { from: 'Cleansing',  summary: 'Your diet shifted; energy steadied. You\'re ready to layer healing meditation onto the daily structure.' },
  expansion:     { from: 'Integration',summary: 'Practices feel less like effort, more like rhythm. Time to widen — sandhya 3x, Brahman connection.' },
  manifestation: { from: 'Expansion',  summary: 'You\'re generating internal energy. Channel it outward into one focused intention this phase.' },
  completion:    { from: 'Manifestation',summary: 'The final stretch. Reflect, integrate, prepare to enter the next mandala from a different self.' },
};

const PhaseReflectionCard = ({ day, currentPhase, onDismiss }) => {
  // Show on day 8 / 15 / 22 / 31 / 41 (start of each new phase after first)
  const showOn = [8, 15, 22, 31, 41];
  if (!showOn.includes(day)) return null;
  const ref = PHASE_REFLECTIONS[currentPhase.id];
  if (!ref) return null;
  return (
    <div className="vedic-card" style={{
      padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start',
      background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(245,158,11,0.06))',
      borderColor: '#A855F7',
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #a855f7, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 20px rgba(168,85,247,0.25)' }}>
        <LucideIcon name="sparkles" size={22} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eyebrow style={{ color: '#7C3AED', marginBottom: 4 }}>Phase transition · {ref.from} → {currentPhase.name}</Eyebrow>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: 6 }}>You crossed a threshold today.</h3>
        <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.6 }}>{ref.summary}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{ padding: 6, color: '#94a3b8' }}>
          <LucideIcon name="x" size={16} />
        </button>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────
//  Command palette — Cmd-K / Ctrl-K to jump anywhere
// ──────────────────────────────────────────────────────────
const COMMAND_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',       icon: 'layout-dashboard', kbd: 'D' },
  { id: 'pillars',         label: 'All 11 Pillars',  icon: 'layers',           kbd: 'P' },
  { id: 'sessions',        label: 'Guided Sessions', icon: 'timer',            kbd: 'S' },
  { id: 'sessions#breathing', label: 'Breathing — Pranayama lotus', icon: 'wind' },
  { id: 'sessions#movement',  label: 'Movement — Yoga library',     icon: 'person-standing' },
  { id: 'sessions#meditation',label: 'Meditation timer',            icon: 'heart' },
  { id: 'goals',           label: 'Weekly Goals',    icon: 'target' },
  { id: 'progress',        label: 'Your Progress',   icon: 'trending-up' },
  { id: 'journal',         label: 'Journal · gratitude / intention',icon: 'book-open' },
  { id: 'dosha-assessment',label: 'Dosha Quiz',      icon: 'leaf' },
  { id: 'library',         label: 'Audio Library',   icon: 'headphones' },
  { id: 'wisdom',          label: 'Daily Wisdom',    icon: 'quote' },
  { id: 'mood',            label: 'Mood Log',        icon: 'smile-plus' },
  { id: 'achievements',    label: 'Achievements',    icon: 'trophy' },
  { id: 'insights',        label: 'AI Insights',     icon: 'sparkles' },
  { id: 'reports',         label: 'Weekly Reports',  icon: 'file-text' },
  { id: 'reminders',       label: 'Reminders',       icon: 'bell' },
  { id: 'settings',        label: 'Settings',        icon: 'settings' },
];

const CommandPalette = ({ setRoute }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setQ(''); setSel(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = COMMAND_ITEMS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  const pick = (item) => { setRoute(item.id.split('#')[0]); setOpen(false); };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    if (e.key === 'Enter')     { e.preventDefault(); filtered[sel] && pick(filtered[sel]); }
  };

  if (!open) return null;
  return (
    <React.Fragment>
      <div className="cmdk-backdrop" onClick={() => setOpen(false)} />
      <div className="cmdk-panel">
        <div className="cmdk-search">
          <LucideIcon name="search" size={16} color="#94a3b8" />
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setSel(0); }} onKeyDown={onKeyDown}
            placeholder="Jump to a page or session..." />
          <span className="cmdk-esc">esc</span>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 ? (
            <div className="cmdk-empty">Nothing matches "{q}"</div>
          ) : filtered.map((it, i) => (
            <div key={it.id} className={'cmdk-item ' + (sel === i ? 'sel' : '')}
              onMouseEnter={() => setSel(i)} onClick={() => pick(it)}>
              <LucideIcon name={it.icon} size={16} color={sel === i ? '#fff' : '#64748b'} />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.kbd && <span className="cmdk-kbd">{it.kbd}</span>}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>⌘K</kbd> close</span>
        </div>
      </div>
    </React.Fragment>
  );
};

Object.assign(window, { OnboardingFlow, NotFoundPage, StreakShield, AvatarUploader, PhaseReflectionCard, CommandPalette });

// ──────────────────────────────────────────────────────────
//  LoadingSkeleton — generic shimmering placeholder
// ──────────────────────────────────────────────────────────
const LoadingSkeleton = ({ rows = 3, withHeader = true }) => (
  <div className="page" style={{ maxWidth: 960 }}>
    {withHeader && <div className="skel" style={{ width: 200, height: 32, marginBottom: 8 }} />}
    {withHeader && <div className="skel" style={{ width: 320, height: 14 }} />}
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="skel-card">
        <div className="skel skel-circle" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skel" style={{ width: '60%', height: 16 }} />
          <div className="skel" style={{ width: '90%', height: 12 }} />
          <div className="skel" style={{ width: '40%', height: 12 }} />
        </div>
      </div>
    ))}
  </div>
);

// ──────────────────────────────────────────────────────────
//  EmptyState — illustrated placeholder for empty lists
// ──────────────────────────────────────────────────────────
const EmptyState = ({ icon = 'sparkles', title, message, ctaLabel, onCta, color = '#F59E0B' }) => (
  <div className="empty-state">
    <div className="empty-state-orb" style={{ background: color + '22' }}>
      <LucideIcon name={icon} size={36} color={color} />
    </div>
    <h3 className="empty-state-title">{title}</h3>
    {message && <p className="empty-state-msg">{message}</p>}
    {ctaLabel && (
      <Button onClick={onCta} style={{ marginTop: 16 }}>
        <LucideIcon name="plus" size={14} color="#fff" /> {ctaLabel}
      </Button>
    )}
  </div>
);

Object.assign(window, { LoadingSkeleton, EmptyState });
