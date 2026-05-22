// ===== Sidebar — 256px fixed left rail =====
// Pixel-faithful to src/components/layout/sidebar.tsx (6 primary + 10 tools + admin)

const PRIMARY_NAV = [
  { name: 'Dashboard', href: '/dashboard',   icon: 'layout-dashboard' },
  { name: 'Pillars',   href: '/pillars',     icon: 'layers' },
  { name: 'Sessions',  href: '/sessions',    icon: 'timer' },
  { name: 'Goals',     href: '/goals',       icon: 'target' },
  { name: 'Progress',  href: '/progress',    icon: 'trending-up' },
  { name: 'Journal',   href: '/journal',     icon: 'book-open' },
];

const SECONDARY_NAV = [
  { name: 'Library',      href: '/library',           icon: 'book-marked' },
  { name: 'Posters',      href: '/posters',           icon: 'image' },
  { name: 'Dosha Quiz',   href: '/dosha-assessment',  icon: 'leaf' },
  { name: 'Wisdom',       href: '/wisdom',            icon: 'quote' },
  { name: 'Mood',         href: '/mood',              icon: 'smile-plus' },
  { name: 'Achievements', href: '/achievements',      icon: 'trophy' },
  { name: 'Insights',     href: '/insights',          icon: 'sparkles' },
  { name: 'Reports',      href: '/reports',           icon: 'file-text' },
  { name: 'Reminders',    href: '/reminders',         icon: 'bell' },
  { name: 'Settings',     href: '/settings',          icon: 'settings' },
];

const MOBILE_PRIMARY = [
  { name: 'Home',     href: '/dashboard', icon: 'layout-dashboard' },
  { name: 'Pillars',  href: '/pillars',   icon: 'layers' },
  { name: 'Sessions', href: '/sessions',  icon: 'timer' },
  { name: 'Progress', href: '/progress',  icon: 'trending-up' },
];

const Sidebar = ({ route, setRoute, user }) => {
  const isAdmin = user?.role === 'admin';
  const adminActive = route === 'admin' || route.startsWith('admin/');
  return (
  <aside className="sidebar">
    <a className="sidebar-brand" onClick={() => setRoute('home')}>
      <img src="assets/logo.jpg" alt="10X Vedic" />
      <div>
        <h1>10X Vedic</h1>
        <p>48-Day Transformation</p>
      </div>
    </a>

    <nav className="sidebar-nav">
      {PRIMARY_NAV.map(item => {
        const isActive = '/' + route === item.href;
        return (
          <a key={item.name}
             className={'sidebar-link ' + (isActive ? 'active' : '')}
             onClick={() => setRoute(item.href.slice(1))}>
            <LucideIcon name={item.icon} size={20} color={isActive ? '#fff' : '#6B7280'} />
            {item.name}
          </a>
        );
      })}

      <div className="sidebar-divider" />

      <div className="sidebar-section-label">Tools</div>
      {SECONDARY_NAV.map(item => {
        const isActive = '/' + route === item.href;
        return (
          <a key={item.name}
             className={'sidebar-link compact ' + (isActive ? 'active' : '')}
             onClick={() => setRoute(item.href.slice(1))}>
            <LucideIcon name={item.icon} size={16} color={isActive ? 'var(--color-primary)' : '#9CA3AF'} />
            {item.name}
          </a>
        );
      })}

      {/* Admin link — renders only when user.role === 'admin'. The product
          Lambda enforces the same gate; this mirror keeps the kit honest. */}
      {isAdmin && (
        <a
          className={'sidebar-link compact sidebar-link-admin ' + (adminActive ? 'active' : '')}
          onClick={() => setRoute('admin')}
          style={adminActive
            ? { background: '#0f172a', color: '#fff', marginTop: 8 }
            : { marginTop: 8 }}>
          <LucideIcon name="shield" size={16} color={adminActive ? '#fff' : '#9CA3AF'} />
          Admin
        </a>
      )}
    </nav>

    <div className="sidebar-wisdom">
      <div className="sidebar-wisdom-eyebrow">Daily Wisdom</div>
      <div className="sidebar-wisdom-quote">
        "The mind is everything. What you think you become."
      </div>
      <div className="sidebar-wisdom-attr">— Buddha</div>
    </div>
  </aside>
  );
};

// ── Header (top bar in content area) ──
const NOTIFICATIONS = [
  { id: 1, icon: 'flame',   color: '#FF5722', title: 'Streak alert',           body: 'You\'re at 12 days — don\'t break it! Mark today\'s Pranayama.',   time: '5m ago',   unread: true },
  { id: 2, icon: 'trophy',  color: '#F59E0B', title: 'New badge: Pranayama Pro',body: 'You\'ve practiced breathwork 10 times.',                            time: '2h ago',   unread: true },
  { id: 3, icon: 'sparkles',color: '#A855F7', title: 'AI Insight ready',       body: 'Your mornings have improved 38% this week.',                       time: 'Yesterday',unread: true },
  { id: 4, icon: 'bell',    color: '#6366F1', title: '6 PM Sandhya',           body: 'Time for your evening practice.',                                  time: 'Yesterday',unread: false },
  { id: 5, icon: 'medal',   color: '#10B981', title: 'Week 2 report',          body: 'Your weekly summary is ready to review.',                          time: '2 days ago',unread: false },
];

const AppHeader = ({ user, route, setRoute }) => {
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openNotif, setOpenNotif] = React.useState(false);
  const [notifs, setNotifs] = React.useState(NOTIFICATIONS);
  const unreadCount = notifs.filter(n => n.unread).length;
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));
  const cycleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'sattva' : cur === 'sattva' ? 'dark' : 'light';
    if (next === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('vedic-theme', next); } catch {}
  };

  const links = [
    { name: 'Dashboard', href: 'dashboard' },
    { name: 'Pillars',   href: 'pillars' },
    { name: 'Progress',  href: 'progress' },
    { name: 'Journal',   href: 'journal' },
  ];
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a className="app-header-brand" onClick={() => setRoute('dashboard')}>
          <img src="assets/logo.jpg" alt="10X Vedic" />
          <span>10X Vedic</span>
        </a>
        <nav className="app-header-nav">
          {links.map(l => (
            <a key={l.href}
               className={route === l.href ? 'active' : ''}
               onClick={() => setRoute(l.href)}>{l.name}</a>
          ))}
        </nav>
        <div className="app-header-right">
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setOpenNotif(o => !o)}>
              <LucideIcon name="bell" size={18} color="#6B7280" />
              {unreadCount > 0 && <span className="dot" />}
            </button>
            {openNotif && (
              <div className="notif-panel">
                <div className="notif-head">
                  <div>
                    <h4>Notifications</h4>
                    <div className="notif-count">{unreadCount} new</div>
                  </div>
                  <button onClick={markAllRead} className="notif-mark">Mark all read</button>
                </div>
                <div className="notif-list">
                  {notifs.map(n => (
                    <div key={n.id} className={'notif-item ' + (n.unread ? 'unread' : '')}>
                      <div className="notif-icon" style={{ background: n.color + '22', color: n.color }}>
                        <LucideIcon name={n.icon} size={16} color={n.color} />
                      </div>
                      <div className="notif-body">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-text">{n.body}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                      {n.unread && <span className="notif-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Theme toggle */}
          <button className="icon-btn" aria-label="Theme" onClick={cycleTheme}>
            <LucideIcon name="sun" size={18} color="#6B7280" />
          </button>
          <div style={{ position: 'relative' }}>
            <button className="profile-btn" onClick={() => setOpenProfile(o => !o)}>
              <div className="profile-avatar"><LucideIcon name="user" size={16} color="#fff" /></div>
              <span>{user.name || 'User'}</span>
            </button>
            {openProfile && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', width: 180,
                background: '#fff', border: '2px solid rgba(218,165,32,0.3)',
                borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                padding: 6, zIndex: 100,
              }}>
                <a onClick={() => { setRoute('settings'); setOpenProfile(false); }}
                   style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.875rem', color: '#374151', borderRadius: 8, cursor: 'pointer' }}>
                  <LucideIcon name="settings" size={14} /> Settings
                </a>
                <a onClick={() => { setRoute('home'); setOpenProfile(false); }}
                   style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: '0.875rem', color: '#DC2626', borderRadius: 8, cursor: 'pointer' }}>
                  <LucideIcon name="log-out" size={14} color="#DC2626" /> Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ── Mobile bottom nav with More sheet ──
const MobileNav = ({ route, setRoute }) => {
  const [moreOpen, setMoreOpen] = React.useState(false);
  return (
    <React.Fragment>
      <nav className="mobile-nav">
        {MOBILE_PRIMARY.map(item => {
          const isActive = '/' + route === item.href;
          return (
            <a key={item.name} className={'mobile-nav-item ' + (isActive ? 'active' : '')}
               onClick={() => setRoute(item.href.slice(1))}>
              <LucideIcon name={item.icon} size={20} color={isActive ? 'var(--color-primary)' : '#6B7280'} />
              {item.name}
            </a>
          );
        })}
        <a className={'mobile-nav-item ' + (moreOpen ? 'active' : '')} onClick={() => setMoreOpen(o => !o)}>
          <LucideIcon name="more-horizontal" size={20} color={moreOpen ? 'var(--color-primary)' : '#6B7280'} />
          More
        </a>
      </nav>
      {moreOpen && (
        <React.Fragment>
          <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="more-sheet">
            <div className="more-sheet-head">
              <div className="sidebar-section-label" style={{ padding: 0 }}>Tools</div>
              <button onClick={() => setMoreOpen(false)} style={{ padding: 6, color: '#94a3b8' }}>
                <LucideIcon name="x" size={18} />
              </button>
            </div>
            <div className="more-sheet-grid">
              {[...PRIMARY_NAV.filter(p => !MOBILE_PRIMARY.find(m => m.href === p.href)), ...SECONDARY_NAV].map(item => {
                const isActive = '/' + route === item.href;
                return (
                  <button key={item.name} className={'more-sheet-item ' + (isActive ? 'active' : '')}
                    onClick={() => { setRoute(item.href.slice(1)); setMoreOpen(false); }}>
                    <LucideIcon name={item.icon} size={20} color={isActive ? 'var(--color-primary)' : '#6B7280'} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

Object.assign(window, { Sidebar, AppHeader, MobileNav, PRIMARY_NAV, SECONDARY_NAV });
