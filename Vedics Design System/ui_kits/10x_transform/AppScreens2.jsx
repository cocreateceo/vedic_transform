// ===== 12 sidebar route implementations =====
// Builds out every remaining sidebar item with a complete, faithful screen.
// Pulled from src/app/(main)/*/page.tsx + src/lib/dosha.ts.
//
// Routes: journal · dosha-assessment · goals · library · posters · wisdom ·
// mood · achievements · insights · reports · reminders · settings

// ───────────────────────────────────────────────────────────
//  1. JOURNAL — Gratitude · Intention · Manifestation Board
// ───────────────────────────────────────────────────────────

const JournalPage = ({ setRoute }) => {
  const [loading, setLoading] = React.useState(true);
  const [grat, setGrat] = React.useState(['', '', '']);
  const [intent, setIntent] = React.useState('');
  const [manifestations, setManifestations] = React.useState([
    { id: 1, title: 'Wake at 5 AM every day this week', desc: 'Without snooze or hesitation.', achieved: true },
    { id: 2, title: 'Master Nadi Shodhana', desc: 'Practice 5 minutes daily for 21 days.', achieved: false },
    { id: 3, title: 'Lead a Sandhya practice', desc: 'Teach my morning circle the 5 AM ritual.', achieved: false },
  ]);
  const [newManifest, setNewManifest] = React.useState('');

  // First-paint shimmer — feels like a real fetch, fades after 600ms
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  if (loading && typeof LoadingSkeleton !== 'undefined') return <LoadingSkeleton rows={4} />;

  const recent = [
    { date: 'Mon, Mar 10', g: ['Mother\'s health is stable', 'The morning sun on my face', 'Quiet 30-min sit'] },
    { date: 'Sun, Mar 9',  g: ['A meaningful conversation', 'Hot ginger tea after the walk', 'Finishing day 11'] },
    { date: 'Sat, Mar 8',  g: ['Family dinner', 'A long walk by the river', 'Reading the Bhagavad Gita'] },
  ];

  const toggleAchieved = (id) =>
    setManifestations(ms => ms.map(m => m.id === id ? { ...m, achieved: !m.achieved } : m));
  const deleteManifest = (id) =>
    setManifestations(ms => ms.filter(m => m.id !== id));
  const addManifest = () => {
    if (!newManifest.trim()) return;
    setManifestations(ms => [...ms, { id: Date.now(), title: newManifest, desc: '', achieved: false }]);
    setNewManifest('');
  };

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="book-open" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Journal</h1>
          <p className="page-subtitle">Record your gratitude, intentions, and manifestations.</p>
        </div>
      </header>

      {/* Today's Gratitude + Intention side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="card-plain">
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <LucideIcon name="heart" size={18} color="#f97316" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Today's Gratitude</h3>
            </div>
            {[0,1,2].map(i => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4, display: 'block' }}>#{i+1}</label>
                <input value={grat[i]} onChange={e => setGrat(g => g.map((v, idx) => idx === i ? e.target.value : v))}
                  placeholder="I am grateful for..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#FFFEF5' }} />
              </div>
            ))}
            <Button style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>Save Gratitude</Button>
          </CardContent>
        </div>

        <div className="card-plain">
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <LucideIcon name="sparkles" size={18} color="#f59e0b" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Today's Intention</h3>
            </div>
            <textarea value={intent} onChange={e => setIntent(e.target.value)}
              placeholder="My intention for today is..." rows={5}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.875rem', outline: 'none', resize: 'none', background: '#FFFEF5', fontFamily: 'inherit', minHeight: 110 }} />
            <Button style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Set Intention</Button>
          </CardContent>
        </div>
      </div>

      {/* Manifestation Board */}
      <div className="card-plain">
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LucideIcon name="book-marked" size={18} color="#f59e0b" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Manifestation Board</h3>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newManifest} onChange={e => setNewManifest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addManifest()}
                placeholder="New manifestation..."
                style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.875rem', outline: 'none', minWidth: 200, background: '#FFFEF5' }} />
              <Button onClick={addManifest}>Add</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {manifestations.length === 0 && typeof EmptyState !== 'undefined' ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <EmptyState icon="sparkles" color="#A855F7"
                  title="Nothing manifesting yet"
                  message="Add your first manifestation above — a specific outcome you want to draw into your life."
                />
              </div>
            ) : manifestations.map(m => (
              <div key={m.id} style={{
                padding: 16, borderRadius: 14,
                background: m.achieved ? '#F0FDF4' : '#FEF3C7',
                border: '2px solid ' + (m.achieved ? '#86EFAC' : '#FCD34D'),
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{m.title}</h4>
                  {m.achieved && <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 999, background: '#10B981', color: '#fff', fontWeight: 600, flexShrink: 0 }}>Achieved!</span>}
                </div>
                {m.desc && <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 10 }}>{m.desc}</p>}
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button onClick={() => toggleAchieved(m.id)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem',
                    padding: '4px 10px', borderRadius: 999, fontWeight: 600,
                    background: m.achieved ? '#fff' : '#10B981',
                    color: m.achieved ? '#15803d' : '#fff',
                    border: m.achieved ? '1px solid #86EFAC' : 'none',
                  }}>
                    <LucideIcon name={m.achieved ? 'rotate-ccw' : 'check'} size={11} color={m.achieved ? '#15803d' : '#fff'} />
                    {m.achieved ? 'Undo' : 'Mark achieved'}
                  </button>
                  <button onClick={() => deleteManifest(m.id)} style={{ padding: 6, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}>
                    <LucideIcon name="trash-2" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Recent Entries */}
      <div className="card-plain">
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <LucideIcon name="calendar" size={18} color="#94a3b8" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Recent Entries</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((r, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 6 }}>{r.date}</p>
                {r.g.map((g, j) => <p key={j} style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>— {g}</p>)}
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  2. DOSHA ASSESSMENT — 12-question quiz with results
// ───────────────────────────────────────────────────────────

const DOSHA_QUESTIONS = [
  { id: 'body-frame',     q: 'What best describes your body frame?',           cat: 'Physical', opts: [['Thin, light, and lean with narrow shoulders', 'vata'], ['Medium build, muscular, well-proportioned', 'pitta'], ['Broad, solid, naturally strong and sturdy', 'kapha']] },
  { id: 'skin-type',      q: 'How would you describe your skin?',              cat: 'Physical', opts: [['Dry, rough, cool to touch', 'vata'], ['Warm, oily, sensitive', 'pitta'], ['Thick, smooth, soft, cool', 'kapha']] },
  { id: 'hair-type',      q: 'What is your hair like?',                        cat: 'Physical', opts: [['Dry, thin, frizzy, or curly', 'vata'], ['Fine, straight, oily, early greying', 'pitta'], ['Thick, wavy, lustrous, and strong', 'kapha']] },
  { id: 'appetite',       q: 'How is your appetite?',                          cat: 'Digestion',opts: [['Irregular — sometimes ravenous, sometimes none', 'vata'], ['Strong and sharp — I get irritable if I miss a meal', 'pitta'], ['Steady but moderate — I can easily skip meals', 'kapha']] },
  { id: 'digestion',      q: 'How is your digestion?',                         cat: 'Digestion',opts: [['Irregular with gas, bloating, or constipation', 'vata'], ['Fast — occasional acid reflux or loose stools', 'pitta'], ['Slow but steady — feel heavy after large meals', 'kapha']] },
  { id: 'sleep',          q: 'How do you sleep?',                              cat: 'Sleep',    opts: [['Light sleeper, wake easily', 'vata'], ['Moderate — sleep well but may wake from heat', 'pitta'], ['Deep and heavy sleeper, hard to wake up', 'kapha']] },
  { id: 'energy',         q: 'How does your energy fluctuate?',                cat: 'Energy',   opts: [['Bursts of energy followed by fatigue', 'vata'], ['High and focused energy, but can burn out', 'pitta'], ['Steady and enduring — slow to start', 'kapha']] },
  { id: 'mind',           q: 'How does your mind typically work?',             cat: 'Mental',   opts: [['Quick, restless, many ideas, hard to focus', 'vata'], ['Sharp, focused, analytical', 'pitta'], ['Calm, steady, methodical', 'kapha']] },
  { id: 'stress',         q: 'How do you respond to stress?',                  cat: 'Emotional',opts: [['Anxiety, worry, fear — I overthink', 'vata'], ['Irritation, anger, frustration — I get heated', 'pitta'], ['Withdrawal, comfort-seeking — I shut down', 'kapha']] },
  { id: 'weather',        q: 'What weather do you dislike most?',              cat: 'Physical', opts: [['Cold, dry, and windy weather', 'vata'], ['Hot, humid, and sunny weather', 'pitta'], ['Cold, damp, and rainy weather', 'kapha']] },
  { id: 'learning',       q: 'How do you learn best?',                         cat: 'Mental',   opts: [['Learn quickly but forget quickly', 'vata'], ['Grasp concepts fast with focus', 'pitta'], ['Take time to learn but remember long', 'kapha']] },
  { id: 'social',         q: 'How are you socially?',                          cat: 'Emotional',opts: [['Talkative, enthusiastic, surface-level', 'vata'], ['Selective, persuasive, natural leader', 'pitta'], ['Loyal, nurturing, few deep relationships', 'kapha']] },
];

const DOSHA_INFO = {
  vata:  { name: 'Vata',  sanskrit: 'वात',  element: 'Air + Space',   color: '#00BCD4', description: 'Vata governs movement, breath, and creativity. You think quickly, learn quickly, and feel deeply.',                                       qualities: ['Creative & Imaginative', 'Quick Learner', 'Energetic in Bursts', 'Adaptable & Flexible'],   recs: ['Follow a regular daily routine with consistent meal times', 'Favor warm, cooked, nourishing foods with healthy fats', 'Practice grounding yoga poses and slow breathing', 'Prioritize warm oil self-massage (Abhyanga)', 'Focus on Sleep, Morning Ritual, and Breathing pillars'] },
  pitta: { name: 'Pitta', sanskrit: 'पित्त',element: 'Fire + Water',   color: '#FF5722', description: 'Pitta governs transformation, digestion, and clarity. You are focused, driven, and naturally lead.',                                  qualities: ['Sharp Intellect', 'Natural Leader', 'Strong Digestion', 'Determined & Focused'],            recs: ['Avoid excessive heat — favor cooling foods', 'Practice calming, non-competitive exercise', 'Include sweet, bitter, and astringent tastes', 'Practice cooling breathwork (Sheetali)', 'Focus on Gratitude, Healing Meditation, and Sandhya pillars'] },
  kapha: { name: 'Kapha', sanskrit: 'कफ',  element: 'Earth + Water',  color: '#4CAF50', description: 'Kapha governs stability, strength, and devotion. You are steady, grounded, and naturally loving.',                                qualities: ['Calm & Grounded', 'Loyal & Loving', 'Strong Endurance', 'Steady & Patient'],                 recs: ['Stay active with vigorous exercise', 'Favor light, warm, spicy foods', 'Wake early (before 6am)', 'Practice energizing breathwork (Kapalabhati)', 'Focus on Movement, Fasting, and Thoughts & Intention pillars'] },
};

const DoshaAssessmentPage = ({ setRoute }) => {
  const [step, setStep] = React.useState(0); // -1 = intro? 0..11 = questions, 12 = result
  const [scores, setScores] = React.useState({ vata: 0, pitta: 0, kapha: 0 });
  const [started, setStarted] = React.useState(false);

  const choose = (dosha) => {
    const next = { ...scores, [dosha]: scores[dosha] + 3 };
    setScores(next);
    setStep(s => s + 1);
  };
  const reset = () => { setStep(0); setScores({ vata: 0, pitta: 0, kapha: 0 }); setStarted(false); };

  // Intro
  if (!started) {
    return (
      <div className="page" style={{ maxWidth: 720 }}>
        <header style={{ textAlign: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, #86EFAC, #10B981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 12px 30px rgba(16,185,129,0.25)' }}>
            <LucideIcon name="leaf" size={36} color="#fff" />
          </div>
          <h1 className="page-title">Discover Your Dosha</h1>
          <p className="page-subtitle" style={{ maxWidth: 540, margin: '8px auto 0' }}>
            12 questions about your body, digestion, and mind. Answer instinctively — your dominant Dosha (Vata · Pitta · Kapha) will guide your 48-day plan.
          </p>
        </header>
        <div className="vedic-card" style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {Object.values(DOSHA_INFO).map(d => (
              <div key={d.name} style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: d.color }}>{d.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{d.element}</div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 10, lineHeight: 1.5 }}>{d.description}</p>
              </div>
            ))}
          </div>
          <Button size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 22 }} onClick={() => setStarted(true)}>
            <LucideIcon name="play" size={16} color="#fff" /> Begin Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Result
  if (step >= DOSHA_QUESTIONS.length) {
    const total = scores.vata + scores.pitta + scores.kapha || 1;
    const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
    const primary = DOSHA_INFO[sorted[0][0]];
    const pct = (k) => Math.round((scores[k] / total) * 100);
    return (
      <div className="page" style={{ maxWidth: 880 }}>
        <header style={{ textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: primary.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 14px 40px ' + primary.color + '55' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#fff', fontWeight: 800 }}>{primary.sanskrit}</span>
          </div>
          <Eyebrow style={{ color: primary.color }}>Your dominant constitution</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginTop: 6 }}>You are <span style={{ color: primary.color }}>{primary.name}</span></h1>
          <p style={{ color: '#64748b', maxWidth: 560, margin: '8px auto 0', lineHeight: 1.6 }}>{primary.description}</p>
        </header>

        <div className="vedic-card" style={{ padding: 24 }}>
          {['vata', 'pitta', 'kapha'].map(k => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                <span style={{ color: DOSHA_INFO[k].color }}>{DOSHA_INFO[k].name} · {DOSHA_INFO[k].element}</span>
                <span>{pct(k)}%</span>
              </div>
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct(k) + '%', background: DOSHA_INFO[k].color, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card-plain" style={{ padding: 22 }}>
            <Eyebrow style={{ marginBottom: 10, display: 'block' }}>Your qualities</Eyebrow>
            {primary.qualities.map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <LucideIcon name="sparkles" size={13} color={primary.color} />
                <span style={{ fontSize: '0.9rem', color: '#374151' }}>{q}</span>
              </div>
            ))}
          </div>
          <div className="card-plain" style={{ padding: 22 }}>
            <Eyebrow style={{ marginBottom: 10, display: 'block' }}>Recommendations</Eyebrow>
            {primary.recs.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                <span style={{ color: primary.color, flexShrink: 0 }}>◈</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Button size="lg" onClick={() => setRoute('dashboard')}>
            <LucideIcon name="check" size={16} color="#fff" /> Customize my plan
          </Button>
          <Button variant="ghost" onClick={reset}>
            <LucideIcon name="rotate-ccw" size={14} /> Retake quiz
          </Button>
        </div>
      </div>
    );
  }

  // Question
  const q = DOSHA_QUESTIONS[step];
  const progress = (step / DOSHA_QUESTIONS.length) * 100;
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Eyebrow>Dosha Assessment</Eyebrow>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{step + 1} / {DOSHA_QUESTIONS.length}</span>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(to right, #f59e0b, #f97316)', transition: 'width 0.4s' }} />
      </div>
      <div className="vedic-card" style={{ padding: 32 }}>
        <PillBadge tone="amber">{q.cat}</PillBadge>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginTop: 14, marginBottom: 22, lineHeight: 1.35 }}>{q.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map(([label, dosha], i) => (
            <button key={i} onClick={() => choose(dosha)} style={{
              padding: '16px 20px', borderRadius: 12, background: '#FFFEF5',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.95rem', color: '#1a1a1a', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.2s',
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = DOSHA_INFO[dosha].color; e.currentTarget.style.background = DOSHA_INFO[dosha].color + '10'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = '#FFFEF5'; }}>
              <span>{label}</span>
              <LucideIcon name="arrow-right" size={16} color="#94a3b8" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  3. GOALS — weekly goals + focus pillar selector
// ───────────────────────────────────────────────────────────

const GoalsPage = ({ user, setRoute }) => {
  const [goals, setGoals] = React.useState([
    { id: 1, week: 2, text: 'Wake at 5 AM 7 days in a row',           done: true },
    { id: 2, week: 2, text: 'Practice Pranayama 5 min daily',          done: true },
    { id: 3, week: 2, text: 'Add 30-min Surya Namaskar 3x this week',  done: false },
    { id: 4, week: 2, text: 'Journal gratitude every evening',         done: false },
    { id: 5, week: 1, text: 'Start a 16:8 fasting window',             done: true },
    { id: 6, week: 1, text: 'Complete onboarding + dosha quiz',        done: true },
  ]);
  const [focusSlugs, setFocusSlugs] = React.useState(new Set(user.focusPillarSlugs));
  const [newGoal, setNewGoal] = React.useState('');
  const currentWeek = Math.ceil(user.currentDay / 7);

  const toggleGoal = (id) => setGoals(gs => gs.map(g => g.id === id ? { ...g, done: !g.done } : g));
  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals(gs => [...gs, { id: Date.now(), week: currentWeek, text: newGoal, done: false }]);
    setNewGoal('');
  };
  const toggleFocus = (slug) => {
    setFocusSlugs(s => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else if (next.size < 3) next.add(slug);
      return next;
    });
  };

  const grouped = {};
  for (const g of goals) (grouped[g.week] = grouped[g.week] || []).push(g);
  const weeks = Object.keys(grouped).map(Number).sort((a,b) => b - a);

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <header>
        <h1 className="page-title">Goals</h1>
        <p className="page-subtitle">Set weekly transformation goals and pick your focus pillars.</p>
      </header>

      {/* Focus pillars selector */}
      <div className="vedic-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <Eyebrow>Your focus pillars</Eyebrow>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>Pick 1–3 to commit to this journey</h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{focusSlugs.size} / 3 selected</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {PILLARS.map(p => {
            const selected = focusSlugs.has(p.slug);
            return (
              <button key={p.id} onClick={() => toggleFocus(p.slug)}
                style={{
                  padding: 14, borderRadius: 12, textAlign: 'left',
                  background: selected ? p.color + '15' : '#fff',
                  border: '2px solid ' + (selected ? p.color : 'var(--color-border)'),
                  transition: 'all 0.2s', cursor: 'pointer',
                  opacity: !selected && focusSlugs.size >= 3 ? 0.5 : 1,
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div className={'pillar-tile-icon-wrap ' + p.bgClass} style={{ width: 32, height: 32 }}>
                    <LucideIcon name={p.icon} size={16} color={p.color} />
                  </div>
                  {selected && <LucideIcon name="check-circle" size={18} color={p.color} />}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{p.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{p.sanskritName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add goal */}
      <div className="card-plain" style={{ padding: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="target" size={20} color="#fff" />
        </div>
        <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          placeholder="Add a goal for week " style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#FFFEF5' }} />
        <Button onClick={addGoal}>Add for week {currentWeek}</Button>
      </div>

      {/* Goals grouped by week */}
      {weeks.map(w => {
        const list = grouped[w];
        const completed = list.filter(g => g.done).length;
        return (
          <div key={w} className="card-plain">
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Week {w}</h3>
                  {w === currentWeek && <PillBadge tone="amber">Current</PillBadge>}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{completed} / {list.length} complete</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map(g => (
                  <div key={g.id} onClick={() => toggleGoal(g.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    background: g.done ? '#F0FDF4' : '#FFFEF5',
                    border: '1px solid ' + (g.done ? '#86EFAC' : 'var(--color-border)'),
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: g.done ? '#10B981' : '#fff',
                      border: '2px solid ' + (g.done ? '#10B981' : 'var(--color-border)'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{g.done && <LucideIcon name="check" size={12} color="#fff" />}</span>
                    <span style={{ flex: 1, fontSize: '0.92rem', color: '#1a1a1a', textDecoration: g.done ? 'line-through' : 'none', opacity: g.done ? 0.6 : 1 }}>{g.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, {
  JournalPage, DoshaAssessmentPage, GoalsPage,
  DOSHA_QUESTIONS, DOSHA_INFO,
});
