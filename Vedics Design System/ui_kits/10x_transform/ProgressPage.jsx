// ===== Progress page — mirrors src/app/(main)/progress/page.tsx =====
// Consistency score · Weekly trend chart · Pillar radar · Heatmap · Pillar
// consistency bars · Badges & Achievements.

// ── Simple SVG weekly trend chart (no recharts in this prototype) ──
const WeeklyTrendChart = ({ data, currentWeek }) => {
  const w = 360, h = 200, pad = 30;
  const max = 100;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (d.percentage / max) * (h - pad * 2);
    return { x, y, d };
  });
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const area = path + ` L ${points[points.length-1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;
  return (
    <div className="chart-card">
      <h3>Weekly Trend</h3>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1={pad} x2={w - pad}
            y1={h - pad - (y/max) * (h - pad * 2)}
            y2={h - pad - (y/max) * (h - pad * 2)}
            stroke="#F3F4F6" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#trendFill)" />
        <path d={path} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#f97316" strokeWidth="2" />
        ))}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={h - 10} textAnchor="middle" fontSize="10" fill="#9CA3AF">
            {p.d.label}
          </text>
        ))}
      </svg>
      <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 8 }}>
        Week {currentWeek} · Average: {Math.round(data.reduce((s,d) => s + d.percentage, 0) / data.length)}%
      </p>
    </div>
  );
};

// ── Pillar radar chart (top 6 pillars) ──
const PillarRadarChart = ({ data }) => {
  const w = 280, h = 240;
  const cx = w / 2, cy = h / 2;
  const r = 90;
  const pillars = data.slice(0, 8);
  const angles = pillars.map((_, i) => (i / pillars.length) * Math.PI * 2 - Math.PI / 2);

  const point = (i, scale) => ({
    x: cx + Math.cos(angles[i]) * r * scale,
    y: cy + Math.sin(angles[i]) * r * scale,
  });

  const polygon = pillars.map((p, i) => point(i, p.completion / 100)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="chart-card">
      <h3>Pillar Strengths</h3>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {[0.25, 0.5, 0.75, 1].map(s => (
          <polygon key={s}
            points={pillars.map((_, i) => point(i, s)).map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke="#F3F4F6" strokeWidth="1" />
        ))}
        <polygon points={polygon}
          fill="rgba(249,115,22,0.20)" stroke="#f97316" strokeWidth="2" />
        {pillars.map((p, i) => {
          const labelPos = point(i, 1.18);
          return (
            <text key={i} x={labelPos.x} y={labelPos.y}
              textAnchor="middle" fontSize="9" fill="#6B7280" dominantBaseline="middle">
              {p.shortName}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// ── Calendar heatmap — 48 cells (1 per journey day) ──
const CalendarHeatmap = ({ data, totalDays = 48, currentDay = 12 }) => {
  // data is array of {day, value 0-5}
  return (
    <div className="chart-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h3 style={{ marginBottom: 0 }}>48-Day Heatmap</h3>
        <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{currentDay} / {totalDays} days walked</span>
      </div>
      <div className="heatmap-grid">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const v = data[i]?.value ?? 0;
          const isToday = day === currentDay;
          const cls = v >= 5 ? 'l5' : v >= 4 ? 'l4' : v >= 3 ? 'l3' : v >= 2 ? 'l2' : v >= 1 ? 'l1' : '';
          return (
            <div key={i}
              className={'heatmap-cell ' + cls + (isToday ? ' today' : '')}
              title={'Day ' + day + ': ' + v + '/11 pillars'} />
          );
        })}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-legend-cells">
          <span style={{ background: '#F3F4F6' }} />
          <span style={{ background: '#FEF3C7' }} />
          <span style={{ background: '#FDE68A' }} />
          <span style={{ background: '#FBBF24' }} />
          <span style={{ background: '#F59E0B' }} />
          <span style={{ background: '#D97706' }} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// ── Consistency Score card ──
const ConsistencyScore = ({ currentScore, previousScore, streakDays, totalKarma, todayCompleted, todayTotal }) => {
  const delta = currentScore - previousScore;
  return (
    <div className="consistency-card">
      <div className="head">
        <div>
          <Eyebrow>Consistency Score</Eyebrow>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginTop: 4 }}>This week</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="pct">{currentScore}%</div>
          <div className={'delta ' + (delta >= 0 ? 'up' : 'down')}>
            <LucideIcon name={delta >= 0 ? 'trending-up' : 'trending-down'} size={14} color={delta >= 0 ? '#059669' : '#DC2626'} />
            {delta >= 0 ? '+' : ''}{delta}% vs last week
          </div>
        </div>
      </div>
      <div className="consistency-meta">
        <div className="consistency-meta-item">
          <div className="l">Streak</div>
          <div className="v">🔥 {streakDays} days</div>
        </div>
        <div className="consistency-meta-item">
          <div className="l">Karma</div>
          <div className="v">⭐ {totalKarma}</div>
        </div>
        <div className="consistency-meta-item">
          <div className="l">Today</div>
          <div className="v">{todayCompleted} / {todayTotal}</div>
        </div>
      </div>
    </div>
  );
};

// ── Pillar consistency bars ──
const PillarConsistency = ({ stats }) => (
  <div className="card-plain">
    <CardContent>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Pillar Consistency</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {stats.map(s => {
          const p = PILLARS.find(pp => pp.name === s.name);
          return (
            <div key={s.name} className="pillar-bar-row">
              <div className={'icon-wrap ' + (p?.bgClass || '')}>
                {p && <LucideIcon name={p.icon} size={18} color={p.color} />}
              </div>
              <div className="body">
                <div className="name"><span>{s.name}</span><span className="pct">{s.completion}%</span></div>
                <div className="track">
                  <div className="fill" style={{ width: s.completion + '%', background: s.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </div>
);

// ── Badges & achievements ──
const Badges = ({ badges }) => (
  <div className="card-plain">
    <CardContent>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Badges & Achievements</h3>
      <div className="badges-grid">
        {badges.map(b => (
          <div key={b.id} className="badge-tile">
            <div className="icon-circle">
              <LucideIcon name={b.icon} size={26} color="#D97706" />
            </div>
            <h4>{b.name}</h4>
            <p>{b.description}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </div>
);

// ── Main Progress page ──
const ProgressPage = ({ user }) => {
  // Mock data
  const weeklyTrendData = [
    { label: 'Mon', percentage: 55, pillarsCompleted: 6 },
    { label: 'Tue', percentage: 72, pillarsCompleted: 8 },
    { label: 'Wed', percentage: 64, pillarsCompleted: 7 },
    { label: 'Thu', percentage: 81, pillarsCompleted: 9 },
    { label: 'Fri', percentage: 68, pillarsCompleted: 7 },
    { label: 'Sat', percentage: 90, pillarsCompleted: 10 },
    { label: 'Sun', percentage: 76, pillarsCompleted: 8 },
  ];
  const currentScore = Math.round(weeklyTrendData.reduce((s,d) => s + d.percentage, 0) / weeklyTrendData.length);
  const previousScore = 64;
  const consistencyHeatmap = Array.from({ length: 48 }, (_, i) => ({
    day: i + 1,
    value: i < user.currentDay ? Math.floor(Math.random() * 6) : 0,
  }));

  const pillarStats = PILLARS.map((p, i) => ({
    name: p.name,
    shortName: p.name.split(/[\s&+]+/)[0],
    category: p.category,
    color: p.color,
    completion: Math.max(20, Math.min(95, 90 - i * 6 + Math.floor(Math.random() * 15))),
  })).sort((a, b) => b.completion - a.completion);

  const badges = [
    { id: 1, name: 'First Week',   description: 'Completed 7 consecutive days', icon: 'medal' },
    { id: 2, name: 'Pranayama Pro', description: 'Practiced breathwork 10×',    icon: 'wind' },
    { id: 3, name: 'Dawn Walker',  description: 'Woke at 5 AM five days',       icon: 'sunrise' },
    { id: 4, name: 'Sattvic',      description: 'Ate plant-forward 7 days',     icon: 'leaf' },
  ];

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Your Progress</h1>
        <p className="page-subtitle">Track your transformation journey</p>
      </div>

      <ConsistencyScore
        currentScore={currentScore}
        previousScore={previousScore}
        streakDays={user.currentStreak}
        totalKarma={user.totalKarma}
        todayCompleted={user.completedPillars.length}
        todayTotal={PILLARS.length}
      />

      <div className="charts-row">
        <WeeklyTrendChart data={weeklyTrendData} currentWeek={Math.ceil(user.currentDay / 7)} />
        <PillarRadarChart data={pillarStats} />
      </div>

      <CalendarHeatmap data={consistencyHeatmap} totalDays={48} currentDay={user.currentDay} />

      <PillarConsistency stats={pillarStats} />
      <Badges badges={badges} />
    </div>
  );
};

Object.assign(window, { ProgressPage });
