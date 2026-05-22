// ===== Shared primitives for 10X Vedic Transform — LIGHT theme =====
// Mirrors src/components/ui/* + Lucide icons via the standalone CDN.

// Lucide is loaded as a UMD bundle (window.lucide). Each icon exposes an
// SVG factory; we render it through a span ref and refresh it on prop
// change. This sidesteps the Tailwind/JSX named-import approach the real
// codebase uses while producing identical SVG output.
const LucideIcon = ({ name, size = 18, color = 'currentColor', strokeWidth = 2, style = {}, className }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide || !window.lucide.icons) return;
    const data = window.lucide.icons[name] || window.lucide.icons[toPascal(name)];
    if (!data) {
      ref.current.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="${color}"/></svg>`;
      return;
    }
    const svg = window.lucide.createElement(data);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', String(strokeWidth));
    ref.current.innerHTML = '';
    ref.current.appendChild(svg);
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} className={className} style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: size, height: size, lineHeight: 0, ...style,
  }} />;
};

function toPascal(s) {
  return s.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase());
}

// ── Button — primary / ghost / soft ──
const Button = ({ children, variant = 'primary', size = 'md', onClick, style = {}, ...rest }) => (
  <button onClick={onClick}
    className={`btn ${variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-soft'} ${size === 'lg' ? 'btn-lg' : ''}`}
    style={style} {...rest}>
    {children}
  </button>
);

// ── Card — three variants used by the real codebase ──
const Card = ({ children, variant = 'plain', className = '', style = {}, onClick, ...rest }) => {
  const cls = variant === 'golden' ? 'vedic-card'
            : variant === 'elevated' ? 'vedic-card'
            : 'card-plain';
  return (
    <div className={`${cls} ${className}`} style={style} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};

const CardContent = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{ padding: 20, ...style }}>{children}</div>
);

// ── Badge ──
const PillBadge = ({ children, tone = 'amber' }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
);

// ── Eyebrow ──
const Eyebrow = ({ children, style = {} }) => (
  <div className="eyebrow" style={style}>{children}</div>
);

Object.assign(window, { LucideIcon, Button, Card, CardContent, PillBadge, Eyebrow });
