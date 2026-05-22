// ===== Pillar Detail page =====
// Mirrors src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx
// Renders the hero image, sanskrit + English headline, category, practice
// guide, related yoga poses (for movement pillar), and a "Begin Practice"
// CTA that deep-links into the right Sessions tab.

// Maps each pillar slug to its Sessions tab index (matches the order in
// SESSION_TABS exactly).
const PILLAR_TO_SESSION_TAB = {
  'morning-initiation':   0, // Morning Routine
  'nutrition-fasting':    1, // Fasting
  'breathing-meditation': 2, // Breathing
  'movement':             3, // Movement
  'healing-meditation':   4, // Meditation
  'sandhya-meditation':   5, // Sandhya (dedicated tab)
  'brahman-connection':   6, // Brahman
  'divine-manifestation': 7, // Manifestation
  'sleep-optimization':   8, // Sleep
};

// Pillar-specific practice guides (5-step instructions)
const PRACTICE_GUIDES = {
  'morning-initiation': [
    'Set your alarm for 4:30–5:00 AM the night before.',
    'On waking, immediately drink 500ml warm water with lemon.',
    'Scrape your tongue, brush, splash cold water on the face.',
    'Sit in sukhasana, eyes closed, take 7 deep breaths.',
    'Step outside; greet the rising sun before any screen.',
  ],
  'breathing-meditation': [
    'Sit upright, spine straight, shoulders relaxed.',
    'Choose a pattern — 4:6 for calm, 4:7:8 for sleep, 4:4:4:4 for focus.',
    'Inhale slowly through the nose, expand the belly first.',
    'Hold (if your pattern includes hold) without strain.',
    'Exhale through pursed lips, twice as slow as the inhale.',
  ],
  'movement': [
    'Pick one of the seven poses on the left.',
    'Begin with 4–6 rounds of Surya Namaskar to warm up.',
    'On inhale, lengthen and open the chest; on exhale, fold forward.',
    'Hold each pose for 3–5 breaths — never force the body.',
    'End in śavāsana (corpse pose) for 2 minutes of stillness.',
  ],
  'healing-meditation': [
    'Find a quiet space — ideally facing east, away from screens.',
    'Sit comfortably with spine straight, hands resting on knees.',
    'Set a 10–20 minute timer. Close your eyes.',
    'Focus on the breath at the nostrils; do not force depth.',
    'Each time the mind wanders, gently return — that IS the practice.',
  ],
  'gratitude': [
    'Open your journal first thing in the morning or last at night.',
    'List THREE specific things you are grateful for from today.',
    'For each, write one sentence on WHY you are grateful.',
    'End with one person you want to thank tomorrow.',
    'Close the journal with a moment of silent appreciation.',
  ],
  'sandhya-meditation': [
    'Practice three times daily: dawn, noon, sunset.',
    'Face east at dawn, north at noon, west at sunset.',
    'Begin with three rounds of Anulom Vilom (alternate-nostril).',
    'Chant the Gayatri mantra mentally — 12, 24, or 108 times.',
    'Sit silently for 5 minutes absorbing the practice.',
  ],
};

const defaultGuide = [
  'Find a quiet, undisturbed space — ideally facing east.',
  'Sit upright with spine straight, hands resting on knees.',
  'Begin with 3 deep breaths to ground yourself.',
  'Follow the guided audio or set a timer for your full session.',
  'Close with a moment of gratitude before opening your eyes.',
];

const PillarDetailPage = ({ slug, user, setRoute, setSessionTab }) => {
  const pillar = PILLARS.find(p => p.slug === slug);
  if (!pillar) {
    return (
      <div className="page">
        <p>Pillar not found.</p>
        <Button variant="ghost" onClick={() => setRoute('pillars')}>← Back to Pillars</Button>
      </div>
    );
  }

  const guide = PRACTICE_GUIDES[slug] || defaultGuide;
  const isDone = user.completedPillars.includes(slug);
  const sessionTab = PILLAR_TO_SESSION_TAB[slug];

  // Related yoga poses — only for the Movement pillar
  const relatedPoses = slug === 'movement' ? YOGA_POSES : null;

  const handleBegin = () => {
    if (typeof sessionTab === 'number' && setSessionTab) {
      setSessionTab(sessionTab);
      setRoute('sessions');
    } else if (slug === 'gratitude' || slug === 'thoughts-intention' || slug === 'divine-manifestation') {
      setRoute('journal');
    } else {
      setRoute('sessions');
    }
  };

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#64748b' }}>
        <a onClick={() => setRoute('pillars')} style={{ cursor: 'pointer', color: '#D97706', fontWeight: 600 }}>Pillars</a>
        <LucideIcon name="chevron-right" size={14} color="#94a3b8" />
        <span>{pillar.name}</span>
      </div>

      {/* HERO with pillar image — or custom animated scene for pillars that have one */}
      {typeof PillarAnimation !== 'undefined' && PillarAnimation({ slug }) ? (
        <div className="pillar-hero pillar-hero-anim">
          <PillarAnimation slug={slug} />
          <div className="pillar-hero-meta-row">
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>{pillar.category}</span>
            {pillar.defaultDurationMinutes > 0 && (
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                <LucideIcon name="clock" size={11} color="#fff" /> {pillar.defaultDurationMinutes} min
              </span>
            )}
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              <LucideIcon name="sparkles" size={11} color="#fff" /> +{pillar.karmaPointsBase} karma
            </span>
            {isDone && (
              <span className="badge" style={{ background: 'rgba(16,185,129,0.95)', color: '#fff' }}>
                <LucideIcon name="check" size={11} color="#fff" /> Done today
              </span>
            )}
          </div>
        </div>
      ) : (
      <div className="pillar-hero">
        <img src={pillar.image} alt={pillar.name} className="pillar-hero-img" />
        <div className="pillar-hero-veil" />
        <div className="pillar-hero-content">
          <div className="pillar-hero-icon" style={{ background: pillar.color }}>
            <LucideIcon name={pillar.icon} size={28} color="#fff" />
          </div>
          <Eyebrow style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {pillar.sanskritName}
          </Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.4)', marginTop: 8, maxWidth: 640 }}>
            {pillar.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.1rem', marginTop: 10, maxWidth: 580, lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            {pillar.description}
          </p>
          <div className="pillar-hero-meta">
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              {pillar.category}
            </span>
            {pillar.defaultDurationMinutes > 0 && (
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                <LucideIcon name="clock" size={11} color="#fff" /> {pillar.defaultDurationMinutes} min
              </span>
            )}
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              <LucideIcon name="sparkles" size={11} color="#fff" /> +{pillar.karmaPointsBase} karma
            </span>
            {isDone && (
              <span className="badge" style={{ background: 'rgba(16,185,129,0.95)', color: '#fff' }}>
                <LucideIcon name="check" size={11} color="#fff" /> Done today
              </span>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Two-column: practice guide left · stats card right */}
      <div className="pillar-detail-grid">
        <div className="card-plain" style={{ padding: 28 }}>
          <Eyebrow style={{ marginBottom: 14, display: 'block' }}>Practice Guide</Eyebrow>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>5 steps to today's practice</h3>
          <ol className="practice-steps">
            {guide.map((step, i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
            <Eyebrow style={{ marginBottom: 10, display: 'block' }}>Why this pillar matters</Eyebrow>
            <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>
              This pillar systematically rewires the {pillar.category === 'body' ? 'physical' : pillar.category === 'mind' ? 'mental' : 'energetic'} layer of your being. Practiced daily across the 48-day Mandala, it compounds into lasting transformation — not as a discipline imposed, but as a natural rhythm you come home to.
            </p>
          </div>
        </div>

        <aside className="pillar-side-card">
          <div className="card-plain" style={{ padding: 22 }}>
            <Eyebrow style={{ marginBottom: 14, display: 'block' }}>This Practice</Eyebrow>
            <div className="pillar-side-stats">
              <div className="row">
                <span className="l">Duration</span>
                <span className="v">{pillar.defaultDurationMinutes > 0 ? pillar.defaultDurationMinutes + ' min' : 'All day'}</span>
              </div>
              <div className="row">
                <span className="l">Category</span>
                <span className="v" style={{ textTransform: 'capitalize' }}>{pillar.category}</span>
              </div>
              <div className="row">
                <span className="l">Karma</span>
                <span className="v" style={{ color: '#D97706' }}>+{pillar.karmaPointsBase}</span>
              </div>
              <div className="row">
                <span className="l">Practice type</span>
                <span className="v" style={{ textTransform: 'capitalize' }}>{pillar.practice}</span>
              </div>
            </div>
            <Button style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={handleBegin}>
              <LucideIcon name="play" size={16} color="#fff" /> Begin Practice
            </Button>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              <LucideIcon name="check" size={16} /> Mark done manually
            </button>
          </div>

          <div className="card-plain" style={{ padding: 22, marginTop: 14 }}>
            <Eyebrow style={{ marginBottom: 12, display: 'block' }}>Your progress</Eyebrow>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Days practiced</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#D97706' }}>9 / 12</span>
            </div>
            <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '75%', background: 'linear-gradient(to right, #f59e0b, #f97316)' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 8 }}>75% consistency this journey</p>
          </div>
        </aside>
      </div>

      {/* Related yoga poses — Movement pillar only */}
      {relatedPoses && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 className="section-h2" style={{ marginBottom: 0 }}>Yoga & Movement Library</h2>
            <a onClick={handleBegin} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D97706', cursor: 'pointer' }}>
              Open in Sessions →
            </a>
          </div>
          <div className="yoga-gallery">
            {relatedPoses.map((p, i) => (
              <div key={p.name} className="yoga-card" style={{ '--accent': p.accent }} onClick={handleBegin}>
                <div className="yoga-card-img">
                  <img src={p.gif} alt={p.name} />
                  <div className="yoga-card-play">
                    <LucideIcon name="play" size={16} color="#fff" />
                  </div>
                </div>
                <div className="yoga-card-body">
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <div className="yoga-card-meta">
                    <span><LucideIcon name="clock" size={11} /> {p.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related pillars (other pillars in same category) */}
      <div>
        <h2 className="section-h2">Related {pillar.category} pillars</h2>
        <div className="pillar-grid">
          {PILLARS.filter(p => p.category === pillar.category && p.slug !== pillar.slug).map(p => (
            <div key={p.id} className="pillar-tile" onClick={() => setRoute('pillars/' + p.slug)}>
              <div className={'pillar-tile-icon-wrap ' + p.bgClass}>
                <LucideIcon name={p.icon} size={22} color={p.color} />
              </div>
              <div>
                <h4>{p.name}</h4>
                <div className="sanskrit">{p.sanskritName}</div>
              </div>
              <div className="desc">{p.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { PillarDetailPage, PRACTICE_GUIDES });
