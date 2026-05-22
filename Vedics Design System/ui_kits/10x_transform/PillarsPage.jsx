// ===== Pillars page — 3-tier prioritization =====
// Mirrors src/app/(main)/pillars/page.tsx exactly.
//
// Tier 1 — Active today      → user's focus pillars (amber ring)
// Tier 2 — Recommended phase → suggested by current journey phase
// Tier 3 — Quietly present   → everything else (lighter border)
// All pillars stay tappable.

const PRACTICE_LABEL = {
  timer:   { icon: 'play',      text: 'Timer',     tone: 'badge-orange' },
  journal: { icon: 'pen-line',  text: 'Journal',   tone: 'badge-green' },
  detail:  { icon: 'book-open', text: 'Mark done', tone: 'badge-gray' },
};

// Mirrors src/lib/practice-routes.ts:practiceTypeForPillar exactly:
// 2 pillars open the Journal (gratitude, thoughts-intention); the remaining
// 9 open a Sessions timer. `detail` is the fallback bucket — no pillar
// currently lands there in production.
const practiceTypeForPillar = (slug) => {
  if (['gratitude', 'thoughts-intention'].includes(slug)) return 'journal';
  return 'timer';
};

const PILLAR_TIERS_BY_PHASE = {
  foundation:   ['morning-initiation', 'sleep-optimization'],
  cleansing:    ['breathing-meditation', 'nutrition-fasting'],
  integration:  ['healing-meditation', 'movement'],
  expansion:    ['sandhya-meditation', 'brahman-connection'],
  manifestation:['divine-manifestation', 'gratitude'],
  completion:   ['thoughts-intention', 'movement'],
};

const PillarCardRich = ({ pillar, tier, isCompleted, onClick }) => {
  const Label = PRACTICE_LABEL[practiceTypeForPillar(pillar.slug)];
  const tierClass =
    isCompleted ? 'done' :
    tier === 'active' ? 'tier-active' :
    tier === 'quiet' ? '' : '';

  return (
    <div className={'pillar-card-rich ' + tierClass} onClick={onClick}>
      {isCompleted && (
        <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: '50%', background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="check" size={14} color="#fff" />
        </div>
      )}
      {pillar.image && (
        <div style={{ height: 100, marginLeft: -20, marginRight: -20, marginTop: -20, marginBottom: 4, overflow: 'hidden', position: 'relative' }}>
          <img src={pillar.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(255,255,255,0.92), rgba(255,255,255,0))' }} />
        </div>
      )}
      <div className={'pillar-tile-icon-wrap ' + pillar.bgClass} style={{ marginTop: -28, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <LucideIcon name={pillar.icon} size={22} color={pillar.color} />
      </div>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{pillar.name}</h3>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 4 }}>{pillar.sanskritName}</p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6, lineHeight: 1.5 }}>{pillar.description}</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={'badge ' + Label.tone} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <LucideIcon name={Label.icon} size={11} /> {Label.text}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 600 }}>+{pillar.karmaPointsBase}</span>
          {pillar.defaultDurationMinutes > 0 && (
            <span style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>{pillar.defaultDurationMinutes}m</span>
          )}
        </div>
      </div>
    </div>
  );
};

const TierSection = ({ eyebrow, title, subtitle, accent, gridClass = 'three', children }) => (
  <section className="tier-section">
    <div style={{ marginBottom: 16 }}>
      <div className={'tier-eyebrow ' + accent}>
        {accent === 'active' && <LucideIcon name="sparkles" size={13} />}
        {eyebrow}
      </div>
      <h2 className="tier-title">{title}</h2>
      <p className="tier-subtitle">{subtitle}</p>
    </div>
    <div className={'tier-grid ' + gridClass}>{children}</div>
  </section>
);

const PillarsPage = ({ user, setRoute }) => {
  const phase = getJourneyPhase(user.currentDay);
  const focusSet = new Set(user.focusPillarSlugs);
  const recommendedSet = new Set(PILLAR_TIERS_BY_PHASE[phase.id] || []);
  // remove pillars already in focusSet from recommended
  user.focusPillarSlugs.forEach(s => recommendedSet.delete(s));

  const activePillars      = user.focusPillarSlugs.map(slug => PILLARS.find(p => p.slug === slug)).filter(Boolean);
  const recommendedPillars = PILLARS.filter(p => recommendedSet.has(p.slug));
  const quietPillars       = PILLARS.filter(p => !focusSet.has(p.slug) && !recommendedSet.has(p.slug));

  const pctDone = Math.round((user.completedPillars.length / PILLARS.length) * 100);

  return (
    <div className="page">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">11 Transformation Pillars</h1>
          <p className="page-subtitle">All practices are always available. Today's emphasis follows your phase.</p>
        </div>
        <span className="badge badge-phase">
          Phase {phase.ordinal} · {phase.name} · Day {user.currentDay} of 48
        </span>
      </div>

      {/* Today's Progress */}
      <div className="today-progress-card">
        <div className="head">
          <div>
            <h3>Today's Progress</h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 4 }}>
              {user.completedPillars.length} of {PILLARS.length} pillars completed
            </p>
          </div>
          <div className="pct">{pctDone}%</div>
        </div>
        <div className="today-progress-bar">
          <div style={{ width: pctDone + '%' }} />
        </div>
      </div>

      {/* Tier 1 — Active today */}
      {activePillars.length > 0 && (
        <TierSection eyebrow="Active today" title="Your focus pillars"
          subtitle="The 1–3 pillars you committed to for this journey." accent="active">
          {activePillars.map(p => (
            <PillarCardRich key={p.id} pillar={p} tier="active"
              isCompleted={user.completedPillars.includes(p.slug)}
              onClick={() => setRoute('pillars/' + p.slug)} />
          ))}
        </TierSection>
      )}

      {/* Tier 2 — Recommended */}
      {recommendedPillars.length > 0 && (
        <TierSection
          eyebrow={'Recommended for ' + phase.name}
          title="Phase suggestions"
          subtitle={phase.description}
          accent="recommended">
          {recommendedPillars.map(p => (
            <PillarCardRich key={p.id} pillar={p} tier="recommended"
              isCompleted={user.completedPillars.includes(p.slug)}
              onClick={() => setRoute('pillars/' + p.slug)} />
          ))}
        </TierSection>
      )}

      {/* Tier 3 — Quietly present */}
      {quietPillars.length > 0 && (
        <TierSection
          eyebrow="Quietly present"
          title="The rest of the mandala"
          subtitle="Always available — explore when ready."
          accent="quiet"
          gridClass="four">
          {quietPillars.map(p => (
            <PillarCardRich key={p.id} pillar={p} tier="quiet"
              isCompleted={user.completedPillars.includes(p.slug)}
              onClick={() => setRoute('pillars/' + p.slug)} />
          ))}
        </TierSection>
      )}
    </div>
  );
};

Object.assign(window, { PillarsPage });
