// ===== AppScreens3 — Library, Posters, Wisdom, Mood, Achievements,
//                     Insights, Reports, Reminders, Settings =====

// ───────────────────────────────────────────────────────────
//  LIBRARY — audio meditations grid
// ───────────────────────────────────────────────────────────

const LIBRARY = [
  { id: 1, name: 'Om Chanting (108x)',        duration: '12 min', level: 'All levels',   category: 'Mantra',     color: '#FFD700', icon: 'sparkles' },
  { id: 2, name: 'Anulom Vilom Pranayama',    duration: '10 min', level: 'Beginner',     category: 'Breathwork', color: '#00BCD4', icon: 'wind' },
  { id: 3, name: 'Yoga Nidra — Deep Rest',    duration: '22 min', level: 'All levels',   category: 'Meditation', color: '#673AB7', icon: 'moon' },
  { id: 4, name: 'Crown Chakra Healing',      duration: '15 min', level: 'Intermediate', category: 'Chakra',     color: '#A855F7', icon: 'sparkles' },
  { id: 5, name: 'Bhastrika — Bellows Breath',duration: '8 min',  level: 'Intermediate', category: 'Breathwork', color: '#FF5722', icon: 'wind' },
  { id: 6, name: 'Manifestation — Sankalpa',  duration: '14 min', level: 'All levels',   category: 'Meditation', color: '#F59E0B', icon: 'sparkles' },
  { id: 7, name: 'Sandhya Meditation',        duration: '15 min', level: 'All levels',   category: 'Daily',      color: '#FFC107', icon: 'sun' },
  { id: 8, name: 'Brahma Muhurta Awakening',  duration: '10 min', level: 'All levels',   category: 'Morning',    color: '#FFD700', icon: 'sunrise' },
  { id: 9, name: 'Gratitude Practice',        duration: '6 min',  level: 'All levels',   category: 'Daily',      color: '#8BC34A', icon: 'hand-heart' },
];

const LibraryPage = () => {
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('All');
  const [now, setNow] = React.useState(null);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  if (loading && typeof LoadingSkeleton !== 'undefined') return <LoadingSkeleton rows={4} />;
  const categories = ['All', 'Morning', 'Breathwork', 'Meditation', 'Mantra', 'Chakra', 'Daily'];
  const visible = filter === 'All' ? LIBRARY : LIBRARY.filter(l => l.category === filter);

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="headphones" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Audio Library</h1>
          <p className="page-subtitle">9 guided sessions — chanting, breathwork, meditation, chakra healing.</p>
        </div>
      </header>

      {/* Filter pills */}
      <div className="pattern-row" style={{ justifyContent: 'flex-start' }}>
        {categories.map(c => (
          <button key={c} className={'pattern-btn ' + (filter === c ? 'active' : '')} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {visible.map(item => {
          const isNow = now === item.id;
          return (
            <div key={item.id} className="card-plain" style={{
              padding: 0, cursor: 'pointer', overflow: 'hidden',
              boxShadow: isNow ? '0 0 0 2px ' + item.color + ', 0 14px 30px rgba(0,0,0,0.08)' : undefined,
              transition: 'all 0.2s',
            }} onClick={() => setNow(isNow ? null : item.id)}>
              <div style={{
                aspectRatio: '16 / 9',
                background: 'linear-gradient(135deg, ' + item.color + '33, ' + item.color + '88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}>
                <LucideIcon name={item.icon} size={48} color={item.color} />
                <div style={{
                  position: 'absolute', right: 14, bottom: 14,
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <LucideIcon name={isNow ? 'pause' : 'play'} size={20} color={item.color} />
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.78rem', color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><LucideIcon name="clock" size={11} /> {item.duration}</span>
                  <span>·</span>
                  <span>{item.level}</span>
                </div>
                {isNow && (
                  <div style={{ marginTop: 12, height: 4, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '38%', background: item.color }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Persistent mini player (visible when something is playing) */}
      {now && (() => {
        const item = LIBRARY.find(l => l.id === now);
        return (
          <div style={{
            position: 'sticky', bottom: 8, marginTop: 18,
            background: '#fff', border: '2px solid var(--goldenrod)',
            borderRadius: 14, padding: 14,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: item.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LucideIcon name={item.icon} size={20} color={item.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>{item.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.duration} · {item.category}</div>
            </div>
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LucideIcon name="pause" size={16} color="#fff" />
            </button>
            <button onClick={() => setNow(null)} style={{ padding: 6, color: '#94a3b8' }}>
              <LucideIcon name="x" size={16} />
            </button>
          </div>
        );
      })()}
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  POSTERS — downloadable transformation art
// ───────────────────────────────────────────────────────────

const POSTERS = [
  { title: 'The 11 Pillars Mandala',     subtitle: 'Full system reference',  bg: 'linear-gradient(135deg, #FFD700, #FF9933, #F59E0B)',   icon: 'circle-dot' },
  { title: '48-Day Mandala Tracker',     subtitle: 'Print + tick each day',  bg: 'linear-gradient(135deg, #fed7aa, #fdba74, #fb923c)',   icon: 'grid-2x2' },
  { title: 'Brahma Muhurta Ritual',      subtitle: '5 AM morning sequence',  bg: 'linear-gradient(135deg, #fde68a, #fcd34d, #fbbf24)',   icon: 'sunrise' },
  { title: 'Surya Namaskar — 12 Steps',  subtitle: 'Sun salutation guide',   bg: 'linear-gradient(135deg, #fecaca, #f87171, #ef4444)',   icon: 'sun' },
  { title: 'Pranayama Patterns',         subtitle: 'Breath ratios reference',bg: 'linear-gradient(135deg, #bae6fd, #7dd3fc, #38bdf8)',   icon: 'wind' },
  { title: 'Ashtanga Hridaya Verses',    subtitle: 'Classical Ayurvedic quotes', bg: 'linear-gradient(135deg, #ddd6fe, #c4b5fd, #a78bfa)', icon: 'book' },
];

const PostersPage = () => (
  <div className="page" style={{ maxWidth: 1100 }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #f472b6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LucideIcon name="image" size={26} color="#fff" />
      </div>
      <div>
        <h1 className="page-title">Posters & Reference Art</h1>
        <p className="page-subtitle">Download printable mandalas, ritual guides, and Sanskrit reference charts.</p>
      </div>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
      {POSTERS.map((p, i) => (
        <div key={i} className="card-plain" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
          <div style={{ aspectRatio: '3 / 4', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%)' }} />
            <div style={{ position: 'relative', textAlign: 'center', color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,0.25)' }}>
              <LucideIcon name={p.icon} size={64} color="#fff" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginTop: 14, padding: '0 12px' }}>{p.title}</div>
            </div>
          </div>
          <div style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>{p.title}</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.subtitle}</p>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <LucideIcon name="download" size={16} color="#D97706" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────
//  WISDOM — daily Vedic quotes feed
// ───────────────────────────────────────────────────────────

const WISDOM = [
  { day: 12, quote: 'Established in yoga, perform actions without attachment.',                source: 'Bhagavad Gita 2.48', author: 'Krishna',  category: 'Yoga' },
  { day: 11, quote: 'The mind is everything. What you think you become.',                       source: 'Dhammapada',           author: 'Buddha',   category: 'Mind' },
  { day: 10, quote: 'The soul is neither born, and nor does it die.',                           source: 'Bhagavad Gita 2.20',   author: 'Krishna',  category: 'Self' },
  { day: 9,  quote: 'When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.', source: 'Bhagavad Gita 6.19', author: 'Krishna', category: 'Meditation' },
  { day: 8,  quote: 'There is no friend like a sister, in calm or stormy weather.',             source: 'Rig Veda',             author: 'Vedic Sage', category: 'Family' },
  { day: 7,  quote: 'Yoga is the journey of the self, through the self, to the self.',          source: 'Bhagavad Gita 6.20',   author: 'Krishna',  category: 'Yoga' },
];

const WisdomPage = () => {
  const [bookmarked, setBookmarked] = React.useState(new Set([12, 9]));
  const toggle = (d) => setBookmarked(s => {
    const next = new Set(s);
    next.has(d) ? next.delete(d) : next.add(d);
    return next;
  });

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="quote" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Daily Wisdom</h1>
          <p className="page-subtitle">One verse from the Vedas, Upanishads, or Bhagavad Gita — every day of your journey.</p>
        </div>
      </header>

      {/* Today's wisdom — large hero card */}
      <div className="vedic-card" style={{ padding: 36, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 20, right: 24, fontFamily: 'var(--font-display)', fontSize: '6rem', color: '#FEF3C7', lineHeight: 0.8, fontWeight: 800 }}>"</div>
        <Eyebrow>Today · Day {WISDOM[0].day}</Eyebrow>
        <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, lineHeight: 1.4, marginTop: 12, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
          {WISDOM[0].quote}
        </blockquote>
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#D97706' }}>— {WISDOM[0].author}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>{WISDOM[0].source}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toggle(WISDOM[0].day)} className="btn btn-ghost" style={{ padding: '8px 14px' }}>
              <LucideIcon name={bookmarked.has(WISDOM[0].day) ? 'bookmark-check' : 'bookmark'} size={14} color={bookmarked.has(WISDOM[0].day) ? '#D97706' : 'currentColor'} />
              {bookmarked.has(WISDOM[0].day) ? 'Saved' : 'Save'}
            </button>
            <button className="btn btn-ghost" style={{ padding: '8px 14px' }}>
              <LucideIcon name="share-2" size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Earlier wisdom feed */}
      <h2 className="section-h2">Earlier this journey</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WISDOM.slice(1).map(w => (
          <div key={w.day} className="card-plain" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <PillBadge tone="amber">Day {w.day}</PillBadge>
                  <PillBadge tone="purple">{w.category}</PillBadge>
                </div>
                <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: '#374151', lineHeight: 1.5 }}>
                  {w.quote}
                </blockquote>
                <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#94a3b8' }}>— {w.author} · <em>{w.source}</em></p>
              </div>
              <button onClick={() => toggle(w.day)} style={{ padding: 8, color: bookmarked.has(w.day) ? '#D97706' : '#94a3b8' }}>
                <LucideIcon name={bookmarked.has(w.day) ? 'bookmark-check' : 'bookmark'} size={16} color={bookmarked.has(w.day) ? '#D97706' : '#94a3b8'} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  MOOD — emoji logger + 14-day trend bar chart
// ───────────────────────────────────────────────────────────

const MOOD_LEVELS = [
  { v: 5, emoji: '😄', label: 'Joyful',     color: '#10B981' },
  { v: 4, emoji: '🙂', label: 'Good',       color: '#84CC16' },
  { v: 3, emoji: '😐', label: 'Neutral',    color: '#F59E0B' },
  { v: 2, emoji: '😕', label: 'Low',        color: '#FB923C' },
  { v: 1, emoji: '😢', label: 'Heavy',      color: '#EF4444' },
];

const MoodPage = () => {
  const [todayMood, setTodayMood] = React.useState(null);
  const [todayEnergy, setTodayEnergy] = React.useState(7);
  const [todayStress, setTodayStress] = React.useState(3);
  const [todaySleep, setTodaySleep] = React.useState(7.5);

  // 14-day mock history
  const history = [4, 3, 4, 5, 4, 3, 5, 4, 4, 5, 3, 4, 5, todayMood || 4];
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const avg = (history.reduce((s,v)=>s+v, 0) / history.length).toFixed(1);

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #f472b6, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="smile-plus" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Mood Log</h1>
          <p className="page-subtitle">Track your mood, energy, stress, and sleep daily — watch the patterns emerge.</p>
        </div>
      </header>

      {/* Today's check-in */}
      <div className="vedic-card" style={{ padding: 28 }}>
        <Eyebrow>Today's check-in</Eyebrow>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 4, marginBottom: 18 }}>How do you feel right now?</h3>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 24 }}>
          {MOOD_LEVELS.map(m => {
            const selected = todayMood === m.v;
            return (
              <button key={m.v} onClick={() => setTodayMood(m.v)} style={{
                flex: '1 1 0', minWidth: 120,
                padding: '18px 12px', borderRadius: 14,
                background: selected ? m.color + '15' : '#FFFEF5',
                border: '2px solid ' + (selected ? m.color : 'var(--color-border)'),
                transition: 'all 0.2s', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: '2rem' }}>{m.emoji}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: selected ? m.color : '#64748b' }}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          <SliderRow icon="zap"    label="Energy" value={todayEnergy} onChange={setTodayEnergy} max={10} suffix="/10" color="#F59E0B" />
          <SliderRow icon="cloud"  label="Stress" value={todayStress} onChange={setTodayStress} max={10} suffix="/10" color="#EF4444" />
          <SliderRow icon="moon"   label="Sleep"  value={todaySleep}  onChange={setTodaySleep}  min={0} max={12} step={0.5} suffix="h" color="#6366F1" />
        </div>

        <Button style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}>
          <LucideIcon name="check" size={16} color="#fff" /> Save today's check-in
        </Button>
      </div>

      {/* 14-day chart */}
      <div className="card-plain">
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>14-day mood trend</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Avg <strong style={{ color: '#D97706' }}>{avg} / 5</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
            {history.map((v, i) => {
              const mood = MOOD_LEVELS.find(m => m.v === v) || MOOD_LEVELS[2];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', height: (v / 5) * 130 + 'px',
                    background: mood.color, borderRadius: '6px 6px 4px 4px',
                    opacity: i === history.length - 1 ? 1 : 0.85,
                    boxShadow: i === history.length - 1 ? '0 0 0 2px ' + mood.color + '55' : 'none',
                    transition: 'height 0.6s ease',
                  }} />
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>
    </div>
  );
};

const SliderRow = ({ icon, label, value, onChange, min = 1, max = 10, step = 1, suffix = '', color = '#F59E0B' }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
        <LucideIcon name={icon} size={14} color={color} /> {label}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color, fontSize: '1rem' }}>{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: '100%', accentColor: color }} />
  </div>
);

// ───────────────────────────────────────────────────────────
//  ACHIEVEMENTS — badge grid (locked / unlocked)
// ───────────────────────────────────────────────────────────

const BADGES = [
  { id: 1,  name: 'First Step',         desc: 'Completed day 1 of your Mandala',           icon: 'sparkles',     unlocked: true,  date: 'Mar 1',   color: '#FFD700' },
  { id: 2,  name: 'First Week',         desc: 'Completed 7 consecutive days',              icon: 'medal',        unlocked: true,  date: 'Mar 7',   color: '#F59E0B' },
  { id: 3,  name: 'Dawn Walker',        desc: 'Woke at 5 AM five days in a row',           icon: 'sunrise',      unlocked: true,  date: 'Mar 8',   color: '#FFD700' },
  { id: 4,  name: 'Sattvic',            desc: 'Ate plant-forward 7 days',                  icon: 'leaf',         unlocked: true,  date: 'Mar 11',  color: '#10B981' },
  { id: 5,  name: 'Pranayama Pro',      desc: 'Practiced breathwork 10 times',             icon: 'wind',         unlocked: true,  date: 'Mar 12',  color: '#00BCD4' },
  { id: 6,  name: 'Halfway',            desc: 'Reach Day 24',                              icon: 'target',       unlocked: false, color: '#94A3B8' },
  { id: 7,  name: 'Pillar Master',      desc: 'Complete ALL 11 pillars in one day',        icon: 'star',         unlocked: false, color: '#94A3B8' },
  { id: 8,  name: 'Streak King',        desc: 'Maintain a 21-day streak',                  icon: 'flame',        unlocked: false, color: '#94A3B8' },
  { id: 9,  name: 'Mandala Complete',   desc: 'Finish all 48 days',                        icon: 'trophy',       unlocked: false, color: '#94A3B8' },
  { id: 10, name: 'Karma Yogi',         desc: 'Earn 1,000 karma points',                   icon: 'sparkles',     unlocked: false, color: '#94A3B8' },
];

// Mirrors src/components/features/dashboard/karma-points.tsx — the
// Sanskrit-language karma rank ladder. 5 ranks; thresholds picked so an
// active user crosses ~1 rank per 7-day cycle.
const RANKS = [
  { name: 'Sadhaka',    threshold: 0,     desc: 'Seeker' },
  { name: 'Antevasin',  threshold: 1000,  desc: 'Resident student' },
  { name: 'Yogi',       threshold: 3000,  desc: 'Steady practice' },
  { name: 'Acharya',    threshold: 6000,  desc: 'Teacher' },
  { name: 'Jivanmukta', threshold: 10000, desc: 'Liberated while living' },
];

function rankFor(karma) {
  let current = RANKS[0];
  let next = RANKS[1] || null;
  for (let i = 0; i < RANKS.length; i++) {
    if (karma >= RANKS[i].threshold) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

const AchievementsPage = () => {
  const unlocked = BADGES.filter(b => b.unlocked);
  const locked = BADGES.filter(b => !b.unlocked);
  // Match MOCK_USER.totalKarma (Dashboard.jsx). Keep in sync if either changes.
  const KARMA = 248;
  const { current: rank, next: nextRank } = rankFor(KARMA);
  const toNext = nextRank ? nextRank.threshold - KARMA : 0;
  const pctToNext = nextRank
    ? Math.max(0, Math.min(100,
        ((KARMA - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100))
    : 100;

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #fbbf24, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="trophy" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Achievements</h1>
          <p className="page-subtitle">{unlocked.length} of {BADGES.length} badges earned · {rank.name} rank</p>
        </div>
      </header>

      {/* Progress bar to next rank */}
      <div className="vedic-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <Eyebrow>Karma Rank</Eyebrow>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#D97706', marginTop: 4 }}>
              {rank.name} · {KARMA}{nextRank ? ' / ' + nextRank.threshold : ''}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{rank.desc}</p>
          </div>
          {nextRank
            ? <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{toNext} to <strong>{nextRank.name}</strong></span>
            : <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>Ladder complete</span>}
        </div>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pctToNext + '%', background: 'linear-gradient(to right, #fbbf24, #f59e0b)', boxShadow: '0 0 12px rgba(251,191,36,0.5)', transition: 'width 600ms ease' }} />
        </div>

        {/* Full 5-rank ladder — current rank highlighted, future ranks dimmed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 18 }}>
          {RANKS.map(r => {
            const isCurrent = r.name === rank.name;
            const isPast    = KARMA >= r.threshold && !isCurrent;
            return (
              <div key={r.name} style={{
                padding: '10px 8px', borderRadius: 10, textAlign: 'center',
                background: isCurrent ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : isPast ? '#FFF7E0' : '#F9FAFB',
                border: '1px solid ' + (isCurrent ? '#D97706' : isPast ? '#FCD34D' : '#E5E7EB'),
                opacity: isPast || isCurrent ? 1 : 0.55,
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isCurrent ? '#92400E' : '#374151' }}>{r.name}</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: 2 }}>{r.threshold === 0 ? 'Start' : r.threshold.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="section-h2">Earned ({unlocked.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {unlocked.map(b => (
            <div key={b.id} className="card-plain" style={{ padding: 18, textAlign: 'center', borderColor: b.color }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, ' + b.color + '22, ' + b.color + '88)',
                margin: '0 auto 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 18px ' + b.color + '33',
              }}>
                <LucideIcon name={b.icon} size={28} color="#fff" />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>{b.name}</h4>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>{b.desc}</p>
              <div style={{ marginTop: 8, fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Earned {b.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-h2">Locked ({locked.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {locked.map(b => (
            <div key={b.id} className="card-plain" style={{ padding: 18, textAlign: 'center', opacity: 0.7 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F3F4F6', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <LucideIcon name={b.icon} size={26} color="#94A3B8" />
                <div style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '2px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LucideIcon name="lock" size={11} color="#94A3B8" />
                </div>
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#64748b' }}>{b.name}</h4>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4, lineHeight: 1.4 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  INSIGHTS — AI-generated insight cards
// ───────────────────────────────────────────────────────────

const INSIGHTS = [
  { id: 1, title: 'Your mornings have improved 38% this week', body: 'You completed Brahma Muhurta 5 of 7 days this week, up from 2 of 7 last week. Keep the alarm consistent — the gain compounds.', icon: 'sunrise', tone: 'win', when: '2 hours ago' },
  { id: 2, title: 'Pranayama is your most-skipped focus pillar', body: 'You set Breathing as a focus pillar but logged it only 4 of 12 days. Try a 5-minute Nadi Shodhana right after waking — same trigger, easier to build.', icon: 'wind', tone: 'tip', when: 'Yesterday' },
  { id: 3, title: 'Mood correlates with Sandhya practice', body: 'On days you completed Sandhya meditation, your reported mood was 22% higher on average. Worth doubling down on this pillar.', icon: 'heart', tone: 'pattern', when: '2 days ago' },
  { id: 4, title: 'Phase 2 (Cleansing) tip', body: 'Phase 2 emphasizes lightening the diet. Try a 16:8 fasting window for the next 5 days — your dosha (Pitta) benefits from cooling timing.', icon: 'leaf', tone: 'tip', when: '3 days ago' },
];

const InsightsPage = () => (
  <div className="page" style={{ maxWidth: 820 }}>
    <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LucideIcon name="sparkles" size={26} color="#fff" />
      </div>
      <div>
        <h1 className="page-title">AI Insights</h1>
        <p className="page-subtitle">Patterns in your practice, surfaced by your Vedic Guide.</p>
      </div>
    </header>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {INSIGHTS.map(ins => {
        const toneColor = ins.tone === 'win' ? '#10B981' : ins.tone === 'tip' ? '#F59E0B' : '#A855F7';
        const toneLabel = ins.tone === 'win' ? 'Win' : ins.tone === 'tip' ? 'Suggestion' : 'Pattern';
        return (
          <div key={ins.id} className="card-plain" style={{ padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: toneColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LucideIcon name={ins.icon} size={22} color={toneColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>{ins.title}</h4>
                <PillBadge tone={ins.tone === 'win' ? 'green' : ins.tone === 'tip' ? 'amber' : 'purple'}>{toneLabel}</PillBadge>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>{ins.body}</p>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ins.when}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <LucideIcon name="thumbs-up" size={12} /> Helpful
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <LucideIcon name="x" size={12} /> Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────
//  REPORTS — weekly summary
// ───────────────────────────────────────────────────────────

const ReportsPage = () => {
  const weeklyData = [
    { week: 1, label: 'Week 1 · Mar 1–7',  pillarsDone: 58, mood: 3.8, karma: 412, journal: 5 },
    { week: 2, label: 'Week 2 · Mar 8–14 (current)', pillarsDone: 74, mood: 4.2, karma: 487, journal: 6 },
  ];
  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #64748b, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="file-text" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Weekly Reports</h1>
          <p className="page-subtitle">Pillar consistency, mood trend, karma earned, journal entries — week by week.</p>
        </div>
      </header>

      {weeklyData.slice().reverse().map(w => (
        <div key={w.week} className="vedic-card" style={{ padding: 28 }}>
          <Eyebrow>{w.label}</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginTop: 6, marginBottom: 18 }}>Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {[
              { label: 'Pillar consistency', value: w.pillarsDone + '%', icon: 'check-circle', color: '#10B981' },
              { label: 'Avg mood',           value: w.mood + ' / 5',     icon: 'smile-plus',   color: '#F59E0B' },
              { label: 'Karma earned',       value: '+' + w.karma,       icon: 'star',         color: '#D97706' },
              { label: 'Journal entries',    value: w.journal,           icon: 'book-open',    color: '#6366F1' },
            ].map(s => (
              <div key={s.label} style={{ padding: 16, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12 }}>
                <LucideIcon name={s.icon} size={20} color={s.color} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, padding: 16, background: '#FFFEF5', border: '1px dashed var(--color-border)', borderRadius: 12 }}>
            <Eyebrow style={{ marginBottom: 6 }}>Reflection</Eyebrow>
            <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic' }}>
              "This week I felt steadier — the morning routine landed and I noticed clearer afternoons. Pranayama still needs more consistency."
            </p>
          </div>

          <Button variant="ghost" style={{ marginTop: 16 }}>
            <LucideIcon name="download" size={14} /> Download PDF
          </Button>
        </div>
      ))}
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  REMINDERS — daily notification schedule
// ───────────────────────────────────────────────────────────

const ReminderRow = ({ time, label, enabled, onToggle, icon, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
    background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12,
    opacity: enabled ? 1 : 0.6, transition: 'opacity 0.2s',
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LucideIcon name={icon} size={20} color={color} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{label}</div>
      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{time}</div>
    </div>
    <button onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 999, position: 'relative',
      background: enabled ? 'linear-gradient(to right, #f97316, #f59e0b)' : '#E5E7EB',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: enabled ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  </div>
);

const RemindersPage = () => {
  const [reminders, setReminders] = React.useState([
    { id: 1, time: '5:00 AM', label: 'Brahma Muhurta wake', icon: 'sunrise', color: '#FFD700', enabled: true },
    { id: 2, time: '5:15 AM', label: 'Morning pranayama',   icon: 'wind',    color: '#00BCD4', enabled: true },
    { id: 3, time: '12:00 PM',label: 'Noon Sandhya',        icon: 'sun',     color: '#FFC107', enabled: true },
    { id: 4, time: '6:00 PM', label: 'Evening movement',    icon: 'person-standing', color: '#FF5722', enabled: false },
    { id: 5, time: '7:00 PM', label: 'Sunset Sandhya',      icon: 'sun',     color: '#FF9933', enabled: true },
    { id: 6, time: '9:30 PM', label: 'Gratitude journal',   icon: 'book-open', color: '#8BC34A', enabled: true },
    { id: 7, time: '10:00 PM',label: 'Wind down for sleep', icon: 'moon',    color: '#3F51B5', enabled: true },
  ]);
  const toggle = (id) => setReminders(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const enabled = reminders.filter(r => r.enabled).length;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #fb923c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name="bell" size={26} color="#fff" />
        </div>
        <div>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">{enabled} of {reminders.length} daily nudges enabled · Configure when 10X reaches out.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reminders.map(r => (
          <ReminderRow key={r.id} {...r} onToggle={() => toggle(r.id)} />
        ))}
      </div>

      <div className="card-plain" style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'center', background: '#FEF3C7', borderColor: '#FCD34D' }}>
        <LucideIcon name="info" size={20} color="#92400E" />
        <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
          Notifications respect your phone's Do Not Disturb. They're served via push if you've enabled them, or as in-app banners if not.
        </p>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
//  SETTINGS — profile + theme + sign out
// ───────────────────────────────────────────────────────────

const SettingsPage = ({ setRoute, user }) => {
  const [name, setName] = React.useState(user.name);
  const [phone, setPhone] = React.useState('+1 (415) 555-0123');
  const [theme, setThemeState] = React.useState(() => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('vedic-theme') || 'light';
    return 'light';
  });
  const [saved, setSaved] = React.useState(false);

  // Apply theme on mount and on change — this hits the real CSS tokens
  // defined in globals.css ([data-theme="dark"] / [data-theme="sattva"]).
  React.useEffect(() => {
    if (theme === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('vedic-theme', theme); } catch {}
  }, [theme]);

  const setTheme = (t) => setThemeState(t);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, theme, notifications, and subscription.</p>
      </header>

      {saved && (
        <div style={{ padding: '10px 16px', background: '#D1FAE5', border: '1px solid #86EFAC', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <LucideIcon name="check-circle" size={18} color="#065F46" />
          <span style={{ fontSize: '0.875rem', color: '#065F46', fontWeight: 600 }}>Profile saved successfully</span>
        </div>
      )}

      {/* Profile */}
      <div className="card-plain">
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <LucideIcon name="user" size={18} color="#F59E0B" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Profile</h3>
          </div>
          {/* Avatar uploader */}
          <AvatarUploader name={name} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.92rem', outline: 'none', background: '#FFFEF5' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Email</label>
              <input value={user.email || 'arjuna@vedics.net'} disabled style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.92rem', background: '#F9FAFB', color: '#94a3b8' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.92rem', outline: 'none', background: '#FFFEF5' }} />
            </div>
            <Button onClick={save} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>Save Profile</Button>
          </div>
        </CardContent>
      </div>

      {/* Theme */}
      <div className="card-plain">
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <LucideIcon name="sun" size={18} color="#F59E0B" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>Theme</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { id: 'light',  label: 'Light',  desc: 'Default · daytime',     bg: '#FFFEF5', border: '#DAA520' },
              { id: 'sattva', label: 'Sattva', desc: 'Warm · evening',         bg: '#1a1510', border: '#FFB366' },
              { id: 'dark',   label: 'Dark',   desc: 'High contrast · night',  bg: '#0f0d08', border: '#FFB366' },
            ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)} style={{
                padding: 14, borderRadius: 12,
                background: t.bg,
                border: '2px solid ' + (theme === t.id ? '#F97316' : t.border + '40'),
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: t.id === 'light' ? '#1a1a1a' : '#FEF3C7', marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: '0.72rem', color: t.id === 'light' ? '#64748b' : '#FCD34D' }}>{t.desc}</div>
                {theme === t.id && <LucideIcon name="check" size={14} color="#F97316" style={{ marginTop: 6 }} />}
              </button>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Quick links */}
      <div className="card-plain">
        <CardContent>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 12 }}>Quick links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['reminders',         'Reminder settings', 'Configure your daily nudges',                'bell',         '#F97316'],
              ['dosha-assessment',  'Retake dosha quiz', 'Update your Ayurvedic constitution',         'leaf',         '#10B981'],
              ['library',           'Audio library',     'Manage downloaded sessions',                 'book-marked',  '#6366F1'],
            ].map(([route, name, desc, icon, color]) => (
              <a key={route} onClick={() => setRoute(route)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                transition: 'background 0.2s',
              }} onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <LucideIcon name={icon} size={18} color={color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>{name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{desc}</div>
                </div>
                <LucideIcon name="chevron-right" size={14} color="#94a3b8" />
              </a>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Subscription + sign out */}
      <div className="card-plain">
        <CardContent>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 12 }}>Subscription</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: '#FEF3C7', borderRadius: 10 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#92400E' }}>Free trial</div>
              <div style={{ fontSize: '0.82rem', color: '#9A3412', marginTop: 2 }}>12 days remaining</div>
            </div>
            <Button>Upgrade</Button>
          </div>

          <button onClick={() => setRoute('home')} style={{
            width: '100%', marginTop: 16, padding: 12,
            background: 'transparent', border: '1px solid #FCA5A5',
            color: '#DC2626', borderRadius: 10, fontWeight: 600, fontSize: '0.92rem',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <LucideIcon name="log-out" size={16} color="#DC2626" /> Sign Out
          </button>
        </CardContent>
      </div>
    </div>
  );
};

Object.assign(window, {
  LibraryPage, PostersPage, WisdomPage, MoodPage,
  AchievementsPage, InsightsPage, ReportsPage, RemindersPage, SettingsPage,
  LIBRARY, BADGES, WISDOM, INSIGHTS, MOOD_LEVELS, POSTERS,
});
