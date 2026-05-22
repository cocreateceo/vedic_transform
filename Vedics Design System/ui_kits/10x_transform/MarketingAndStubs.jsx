// ===== Marketing landing + stub screens for the long-tail routes =====

const PublicNav = ({ setRoute }) => (
  <nav className="public-nav">
    <div className="public-nav-inner">
      <a className="public-nav-brand" onClick={() => setRoute('home')}>
        <img src="assets/logo.jpg" alt="10X Vedic" />
        <span>10X Vedic</span>
      </a>
      <div className="public-nav-links">
        <a onClick={() => setRoute('home')}>Home</a>
        <a>About</a>
        <a>Pillars</a>
        <a>How It Works</a>
        <a>Blog</a>
        <a>FAQ</a>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a onClick={() => setRoute('login')} style={{ fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>Login</a>
        <Button onClick={() => setRoute('dashboard')}>Start Free</Button>
      </div>
    </div>
  </nav>
);

const PublicLanding = ({ setRoute }) => (
  <div>
    <PublicNav setRoute={setRoute} />
    <section className="public-hero">
      <PillBadge tone="amber">48-Day Vedic Transformation Program</PillBadge>
      <h1>
        <span>Transform Yourself </span>
        <span className="text-orange-amber-gradient">in 48 Days</span>
      </h1>
      <p className="lede">
        A scientific + spiritual journey to realign your body, mind &amp; energy
        through <strong style={{ color: '#D97706' }}>11 Vedic transformation pillars</strong>.
      </p>
      <div className="public-hero-cta-row">
        <Button size="lg" onClick={() => setRoute('dashboard')}>
          <LucideIcon name="sparkles" size={16} color="#fff" /> Begin Your Journey
        </Button>
        <button className="btn btn-ghost btn-lg">
          <LucideIcon name="play" size={16} /> Watch Intro
        </button>
      </div>
      <div className="public-stats">
        <div className="public-stat"><div className="n">48</div><div className="l">Days</div></div>
        <div className="public-stat"><div className="n">11</div><div className="l">Pillars</div></div>
        <div className="public-stat"><div className="n">60</div><div className="l">Min/Day</div></div>
        <div className="public-stat"><div className="n">1000+</div><div className="l">Transformations</div></div>
      </div>
    </section>

    {/* All 11 pillars preview */}
    <section className="public-section">
      <h2>The 11 Pillars of Transformation</h2>
      <p className="lede">A comprehensive system addressing body, mind, and spirit.</p>
      <div className="pillar-grid">
        {PILLARS.map(p => (
          <div key={p.id} className="pillar-tile">
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
              <PillBadge tone={p.category === 'body' ? 'orange' : p.category === 'mind' ? 'blue' : 'purple'}>
                {p.category}
              </PillBadge>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Final CTA */}
    <section style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', padding: '64px 24px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#92400E', marginBottom: 14 }}>
        Ready to Transform?
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#78350F', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
        Start your 48-day Mandala journey today. Show up daily, stay consistent.
      </p>
      <Button size="lg" onClick={() => setRoute('dashboard')}>Begin Your Journey</Button>
    </section>
  </div>
);

// ── Login / sign up ──
const LoginPage = ({ setRoute }) => {
  const [tab, setTab] = React.useState('login');
  return (
    <div>
      <PublicNav setRoute={setRoute} />
      <section className="public-auth">
        <div className="public-auth-card">
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <img src="assets/logo.jpg" alt="10X Vedic" style={{ width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
              <span className="text-orange-amber-gradient">10X Vedic</span>
            </div>
            <Eyebrow style={{ marginTop: 8 }}>{tab === 'login' ? 'Welcome Back, Seeker' : 'Begin Your Journey'}</Eyebrow>
          </div>
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
            <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign Up</button>
          </div>
          {tab === 'signup' && (
            <div className="field"><label>Name</label><input defaultValue="Arjuna" /></div>
          )}
          <div className="field"><label>Email</label><input defaultValue="seeker@vedics.net" /></div>
          <div className="field"><label>Password</label><input type="password" defaultValue="••••••••••" /></div>
          <Button style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={() => setRoute(tab === 'signup' ? 'onboarding' : 'dashboard')}>
            {tab === 'login' ? 'Enter the Mandala' : 'Begin Free Trial'}
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
            or continue with
            <span style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn btn-ghost">Google</button>
            <button className="btn btn-ghost">Apple</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.875rem', color: '#6B7280' }}>
            {tab === 'login'
              ? <span>New seeker? <a onClick={() => setTab('signup')} style={{ color: '#D97706', fontWeight: 600 }}>Begin your journey →</a></span>
              : <span>Already a member? <a onClick={() => setTab('login')} style={{ color: '#D97706', fontWeight: 600 }}>Sign in →</a></span>}
          </div>
        </div>
      </section>
    </div>
  );
};

// ── Stub pages for the secondary sidebar routes ──
const ICON_FOR_ROUTE = {
  sessions: 'timer', goals: 'target', journal: 'book-open',
  library: 'book-marked', posters: 'image', 'dosha-assessment': 'leaf',
  wisdom: 'quote', mood: 'smile-plus', achievements: 'trophy',
  insights: 'sparkles', reports: 'file-text', reminders: 'bell', settings: 'settings',
};

const StubScreen = ({ route, setRoute }) => {
  const title = route.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const icon = ICON_FOR_ROUTE[route] || 'circle';
  const description = {
    sessions:           'Guided meditation, pranayama, and movement sessions.',
    goals:              'Weekly goal-setting and focus pillar selection.',
    journal:            'Daily gratitude, intentions, manifestations, and reflections.',
    library:            '9 audio meditations — Om chanting, Yoga Nidra, chakra healing.',
    posters:            'Downloadable transformation poster art.',
    'dosha-assessment': 'Discover your Ayurvedic constitution — Vata, Pitta, or Kapha.',
    wisdom:             "Daily Vedic wisdom from sacred texts.",
    mood:               'Log your mood, energy, stress, and sleep daily.',
    achievements:       'Streak badges, karma rank, milestone trophies.',
    insights:           'AI-generated patterns and personalized recommendations.',
    reports:            'Weekly and monthly reflection summaries.',
    reminders:          'Customize when 10X nudges you each day.',
    settings:           'Profile, theme, notifications, language, subscription.',
  }[route] || 'This screen is part of the live product — see the sidebar for navigation.';

  return (
    <div className="page">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      <div className="card-plain" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--color-card-bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <LucideIcon name={icon} size={28} color="#D97706" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{title} screen</h3>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>
          This is a stub in the UI kit. The real page lives in the production app — refer to
          {' '}<code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: 4, fontSize: '0.85em' }}>src/app/(main)/{route}/page.tsx</code>{' '}
          for the canonical implementation.
        </p>
        <Button variant="ghost" onClick={() => setRoute('dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

Object.assign(window, { PublicLanding, LoginPage, StubScreen });
