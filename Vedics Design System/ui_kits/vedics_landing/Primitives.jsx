// ===== Shared UI primitives — Vedics design system =====
// Loaded as JSX. Exposes via window so other Babel scripts can use them.

const Ornament = ({ glyph = "◇ ◇ ◇", style = {} }) => (
  <span style={{
    display: 'block', textAlign: 'center', color: 'var(--gold)',
    fontSize: '1.4rem', letterSpacing: '0.6em', opacity: 0.5,
    marginBottom: 16, ...style,
  }}>{glyph}</span>
);

const Eyebrow = ({ children, color = 'var(--gold)', style = {} }) => (
  <span style={{
    fontFamily: 'var(--font-heading)', fontSize: '0.78rem',
    color, letterSpacing: '0.18em', textTransform: 'uppercase',
    fontWeight: 500, ...style,
  }}>{children}</span>
);

const GoldText = ({ as: Tag = 'span', children, style = {} }) => (
  <Tag style={{
    background: 'var(--grad-text)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', color: 'transparent',
    ...style,
  }}>{children}</Tag>
);

const ShimmerText = ({ as: Tag = 'span', children, style = {} }) => (
  <Tag className="shimmer-text" style={{
    background: 'var(--grad-shimmer)', backgroundSize: '300% auto',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', color: 'transparent',
    ...style,
  }}>{children}</Tag>
);

const PrimaryCTA = ({ children, onClick, size = 'lg', style = {} }) => {
  const pad = size === 'lg' ? '16px 40px' : size === 'md' ? '13px 28px' : '10px 22px';
  const fs = size === 'lg' ? '0.85rem' : size === 'md' ? '0.78rem' : '0.7rem';
  return (
    <button onClick={onClick} className="cta-primary" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: pad, fontFamily: 'var(--font-heading)',
      fontSize: fs, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: 'var(--on-saffron)', background: 'var(--grad-gold)',
      border: 'none', borderRadius: 60, cursor: 'pointer',
      boxShadow: '0 4px 30px rgba(198,153,62,0.3)',
      transition: 'all 0.4s var(--ease-out-soft)', fontWeight: 600,
      ...style,
    }}>{children}</button>
  );
};

const GhostCTA = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} className="cta-ghost" style={{
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 32px', fontFamily: 'var(--font-heading)',
    fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'var(--gold-light)', background: 'transparent',
    border: '1px solid rgba(198,153,62,0.3)', borderRadius: 60, cursor: 'pointer',
    transition: 'all 0.3s var(--ease-out-soft)',
    ...style,
  }}>{children}</button>
);

const Tag = ({ children, accent = 'transform' }) => {
  const styles = {
    transform: { bg: 'rgba(232,135,43,0.12)', color: 'var(--saffron-light)' },
    astro:     { bg: 'rgba(91,143,191,0.12)', color: 'var(--c-astro-2)' },
    wellness:  { bg: 'rgba(107,155,111,0.12)', color: 'var(--c-wellness-2)' },
    body:      { bg: 'rgba(232,135,43,0.12)', color: 'var(--saffron-light)' },
    mind:      { bg: 'rgba(91,143,191,0.12)', color: 'var(--c-astro-2)' },
    spirit:    { bg: 'rgba(226,185,85,0.14)', color: 'var(--gold-light)' },
    karma:     { bg: 'rgba(226,185,85,0.12)', color: 'var(--karma)' },
  }[accent] || styles?.transform || { bg: 'rgba(198,153,62,0.12)', color: 'var(--gold-light)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 14px', borderRadius: 20,
      fontFamily: 'var(--font-heading)', fontSize: '0.68rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      background: styles.bg, color: styles.color,
      width: 'fit-content', fontWeight: 500,
    }}>{children}</span>
  );
};

// Ambient background: noise overlay + radial glows + drifting particles.
const BrandTexture = ({ particles = 14 }) => (
  <React.Fragment>
    <div className="brand-noise" />
    <div className="brand-particles">
      {Array.from({length: particles}, (_, i) => {
        const sz = Math.random() * 3 + 1.5;
        const dur = Math.random() * 18 + 12;
        const dly = Math.random() * 12;
        const cols = ['rgba(232,135,43,0.35)', 'rgba(198,153,62,0.25)', 'rgba(255,200,120,0.2)'];
        return (
          <span key={i} className="particle" style={{
            width: sz, height: sz, left: Math.random() * 100 + '%',
            background: cols[i % cols.length],
            animationDuration: dur + 's', animationDelay: dly + 's',
          }} />
        );
      })}
    </div>
  </React.Fragment>
);

Object.assign(window, {
  Ornament, Eyebrow, GoldText, ShimmerText,
  PrimaryCTA, GhostCTA, Tag, BrandTexture,
});
