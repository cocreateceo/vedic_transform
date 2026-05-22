// ===== Dashboard — mirrors src/app/(main)/dashboard/page.tsx =====
// Phase-tinted welcome banner with Mandala ring · Daily Brief · Today's
// Practice · Streak + Karma stat cards · 11-pillar grid · Quick actions ·
// Discover row.

// 12 mock "completed days" of the user's journey for the mandala.
const MOCK_USER = {
  name: 'Arjuna', email: 'arjuna@vedics.net',
  // Mirrors the product's user.role gating. Set to 'admin' so the kit's
  // Sidebar renders the Shield-icon admin link by default — flip to
  // 'member' to preview the non-admin view.
  role: 'admin',
  currentDay: 8,
  completedDays: [1,2,3,4,5,6,7,8],
  totalKarma: 248,
  todayEarned: 40,
  currentStreak: 12,
  longestStreak: 18,
  shields: 2,
  isAtRisk: false,
  focusPillarSlugs: ['morning-initiation', 'breathing-meditation', 'sandhya-meditation'],
  completedPillars: ['morning-initiation', 'nutrition-fasting', 'breathing-meditation'],
};

// ── Mandala progress ring — 48 segments, gold strokes for completed days ──
const MandalaRing = ({ currentDay, completedDays, size = 120 }) => {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 8;
  const completed = new Set(completedDays);
  const segments = [];
  const total = 48;
  for (let i = 0; i < total; i++) {
    const a1 = (i / total) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2;
    const gap = 0.04;
    const x1 = cx + r * Math.cos(a1 + gap);
    const y1 = cy + r * Math.sin(a1 + gap);
    const x2 = cx + r * Math.cos(a2 - gap);
    const y2 = cy + r * Math.sin(a2 - gap);
    const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    const isDone = completed.has(i + 1);
    const isToday = i + 1 === currentDay;
    segments.push(
      <path key={i} d={d} fill="none"
        stroke={isDone ? 'rgba(255,255,255,0.95)' : isToday ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.18)'}
        strokeWidth={isToday ? 5 : 3}
        strokeLinecap="round" />
    );
  }
  return (
    <svg width={size} height={size} className="mandala-ring">
      {segments}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>
        {currentDay}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)"
        style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        of 48
      </text>
    </svg>
  );
};

const StreakCounter = ({ currentStreak, longestStreak, shields }) => (
  <div className="stat-card">
    <div className="stat-card-head">
      <div className="stat-card-title">
        <span className="icon-wrap"><LucideIcon name="flame" size={18} color="#fff" /></span>
        Streak
      </div>
      <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <LucideIcon name="shield" size={11} /> {shields} shields
      </span>
    </div>
    <div className="stat-card-main">
      <span className="n">{currentStreak}</span>
      <span className="unit">days in a row</span>
    </div>
    {shields > 0 && (
      <div style={{ padding: 10, background: 'rgba(99,102,241,0.05)', borderRadius: 10, border: '1px dashed rgba(99,102,241,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LucideIcon name="shield" size={12} color="#6366F1" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4338CA' }}>{shields} streak shield{shields !== 1 ? 's' : ''} active</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>Each shield auto-protects your streak if you miss one day.</div>
      </div>
    )}
    <div className="stat-card-meta">
      <span><span className="label">Longest streak:</span> <span className="val">{longestStreak} days</span></span>
      <span className="val" style={{ color: '#10B981' }}>● Active</span>
    </div>
  </div>
);

const KarmaPoints = ({ totalKarma, todayEarned }) => (
  <div className="stat-card">
    <div className="stat-card-head">
      <div className="stat-card-title">
        <span className="icon-wrap" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
          <LucideIcon name="star" size={18} color="#fff" />
        </span>
        Karma Points
      </div>
      <span className="badge badge-amber">Sadhaka rank</span>
    </div>
    <div className="stat-card-main">
      <span className="n">{totalKarma}</span>
      <span className="unit">lifetime points</span>
    </div>
    <div className="stat-card-meta">
      <span><span className="label">Today earned:</span> <span className="val" style={{ color: '#D97706' }}>+{todayEarned}</span></span>
      <span><span className="label">Next rank:</span> <span className="val">{1000 - totalKarma} away</span></span>
    </div>
  </div>
);

const PillarGrid = ({ completedPillars, setRoute }) => (
  <div>
    <h2 className="section-h2">All 11 Pillars</h2>
    <div className="pillar-grid">
      {PILLARS.map(p => {
        const done = completedPillars.includes(p.slug);
        return (
          <div key={p.id} className={'pillar-tile ' + (done ? 'done' : '')}
               onClick={() => setRoute && setRoute('pillars/' + p.slug)}>
            {done && (
              <div className="pillar-tile-check">
                <LucideIcon name="check" size={14} color="#fff" />
              </div>
            )}
            <div className={'pillar-tile-icon-wrap ' + p.bgClass}>
              <LucideIcon name={p.icon} size={22} color={p.color} />
            </div>
            <div>
              <h4>{p.name}</h4>
              <div className="sanskrit">{p.sanskritName}</div>
            </div>
            <div className="desc">{p.description}</div>
            <div className="pillar-tile-foot">
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>+{p.karmaPointsBase}</span>
              {p.defaultDurationMinutes > 0 && (
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{p.defaultDurationMinutes}m</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const DiscoverRow = ({ setRoute }) => (
  <div>
    <h2 className="section-h2">Discover</h2>
    <div className="discover-grid">
      <div className="discover-card" onClick={() => setRoute('dosha-assessment')}>
        <div className="icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <LucideIcon name="leaf" size={22} color="#fff" />
        </div>
        <div>
          <h4>Dosha Assessment</h4>
          <p>Discover your Ayurvedic type</p>
        </div>
      </div>
      <div className="discover-card" onClick={() => setRoute('library')}>
        <div className="icon-wrap" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          <LucideIcon name="headphones" size={22} color="#fff" />
        </div>
        <div>
          <h4>Audio Meditations</h4>
          <p>Play guided sessions in-app</p>
        </div>
      </div>
      <div className="discover-card" onClick={() => setRoute('insights')}>
        <div className="icon-wrap" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
          <LucideIcon name="sparkles" size={22} color="#fff" />
        </div>
        <div>
          <h4>AI Insights</h4>
          <p>Personalized recommendations</p>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Dashboard page ──
const DashboardPage = ({ user, setRoute }) => {
  const phase = getJourneyPhase(user.currentDay);
  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greet = hour < 5 ? 'Pre-dawn blessings' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night';

  return (
    <div className="page">
      <div className={'welcome-banner ' + phase.bannerClass}>
        <div className="welcome-banner-inner">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="welcome-greeting">{greet}, {firstName}!</p>
            <h1>Phase {phase.ordinal}: {phase.name}</h1>
            <p className="phase-desc">Day {user.currentDay} of 48 · {phase.description}</p>
            <button className="welcome-cta">
              <LucideIcon name="play" size={14} color="#fff" /> Play morning greeting
            </button>
          </div>
          <MandalaRing currentDay={user.currentDay} completedDays={user.completedDays} size={120} />
        </div>
      </div>

      {/* Phase-transition reflection card — only shows on day 8/15/22/31/41 */}
      {typeof PhaseReflectionCard !== 'undefined' && (
        <PhaseReflectionCard day={user.currentDay} currentPhase={phase} />
      )}

      {/* Daily Brief */}
      <div className="daily-brief">
        <div className="daily-brief-icon">
          <LucideIcon name="sparkles" size={18} color="#fff" />
        </div>
        <div className="daily-brief-text">
          <Eyebrow>Daily Brief</Eyebrow>
          <p>You're on a 12-day streak — Phase 2 (Cleansing) is asking you to lean into Pranayama and lighten today's diet.</p>
        </div>
      </div>

      {/* Today's canonical practice */}
      <div className="todays-practice">
        <div className="todays-practice-head">
          <h3>Today's Practice</h3>
          <PillBadge tone="orange">Mind · 15 min</PillBadge>
        </div>
        <div className="todays-practice-card">
          <div className="todays-practice-icon pillar-bg-cyan">
            <LucideIcon name="wind" size={26} color="#00BCD4" />
          </div>
          <div className="todays-practice-body">
            <h4>Breathing + Meditation</h4>
            <p>Pranayama · Nadi Shodhana — 4 / 4 / 4 alternate-nostril rounds</p>
          </div>
          <Button onClick={() => setRoute('pillars')}>
            <LucideIcon name="play" size={14} color="#fff" /> Begin
          </Button>
        </div>
      </div>

      {/* Streak + Karma 2-up */}
      <div className="stats-grid">
        <StreakCounter currentStreak={user.currentStreak} longestStreak={user.longestStreak} shields={user.shields} />
        <KarmaPoints totalKarma={user.totalKarma} todayEarned={user.todayEarned} />
      </div>

      {/* All 11 pillars */}
      <PillarGrid completedPillars={user.completedPillars} setRoute={setRoute} />

      {/* Focus pillars quick actions */}
      <div>
        <h2 className="section-h2">Your focus pillars</h2>
        <div className="discover-grid">
          {user.focusPillarSlugs.slice(0, 2).map(slug => {
            const p = PILLARS.find(pp => pp.slug === slug);
            if (!p) return null;
            const done = user.completedPillars.includes(slug);
            return (
              <div key={slug} className="card-plain" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer' }}
                   onClick={() => setRoute('pillars')}>
                <div className={'pillar-tile-icon-wrap ' + p.bgClass}>
                  <LucideIcon name={p.icon} size={22} color={p.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 600, color: '#111827' }}>{p.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 2 }}>{done ? '✓ Done today' : p.description}</p>
                </div>
              </div>
            );
          })}
          <div className="card-plain" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer' }}
               onClick={() => setRoute('journal')}>
            <div className="pillar-tile-icon-wrap pillar-bg-green">
              <LucideIcon name="book-open" size={22} color="#10B981" />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, color: '#111827' }}>Journal</h4>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 2 }}>Record your gratitude</p>
            </div>
          </div>
        </div>
      </div>

      <DiscoverRow setRoute={setRoute} />
    </div>
  );
};

Object.assign(window, { DashboardPage, MandalaRing, MOCK_USER });
