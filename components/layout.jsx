import Link from 'next/link';
import { useRouter } from 'next/router';
import { Logo, Cap, Btn, Avatar, ContourBg, BuildingArt } from './primitives';
import Icon from './icons';
import { useAuth } from '../lib/useAuth';

function initialsFor(user) {
  const name = user?.user_metadata?.full_name || user?.email || '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '–';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ─── SECTION TAG
export function SectionTag({ t, num, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ fontFamily: t.mono, fontSize: 12, fontWeight: 600, color: t.highlight, letterSpacing: '.08em' }}>{num}</span>
      <span style={{ width: 26, height: 1, background: t.lineStrong }} />
      <Cap t={t} color={t.muted}>{children}</Cap>
    </div>
  );
}

// ─── MARKETING NAV
export function MarketingNav({ t }) {
  const links = ['Funktionen', 'So funktioniert\'s', 'Sicherheit', 'Preise'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', borderBottom: `1px solid ${t.line}`,
      position: 'sticky', top: 0, zIndex: 50,
      background: t.glass || 'rgba(240,245,249,0.80)',
      backdropFilter: 'blur(14px)',
    }}>
      <Link href="/"><Logo t={t} size={30} /></Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        {links.map((l) => (
          <span key={l} style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.muted, cursor: 'pointer' }}>{l}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/login" style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.ink }}>Anmelden</Link>
        <Link href="/analyse">
          <Btn t={t} variant="primary" size="sm" iconRight="arrowRight">Immobilie bewerten</Btn>
        </Link>
      </div>
    </div>
  );
}

// ─── SITE FOOTER
export function SiteFooter({ t }) {
  const cols = [
    ['Produkt', ['Bewertung', 'Vergleich', 'Grundrisse', 'Energieausweis', 'Preise']],
    ['Unternehmen', ['Über uns', 'Academy', 'Marktplatz', 'Karriere']],
    ['Rechtliches', ['Impressum', 'Datenschutz', 'AGB', 'Kontakt']],
  ];
  return (
    <div style={{ padding: '56px 56px 40px', borderTop: `1px solid ${t.line}`, background: t.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
        <div style={{ maxWidth: 300 }}>
          <Logo t={t} size={28} />
          <p style={{ fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.6, color: t.muted, marginTop: 16 }}>
            KI-gestützte Immobilienbewertung nach ImmoWertV 2024. Prüfsicher, in Sekunden.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 64 }}>
          {cols.map(([h, items]) => (
            <div key={h}>
              <Cap t={t} color={t.faint}>{h}</Cap>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {items.map((i) => (
                  <span key={i} style={{ fontFamily: t.sans, fontSize: 14, color: t.muted, cursor: 'pointer' }}>{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${t.line}`, display: 'flex', justifyContent: 'space-between' }}>
        <Cap t={t} color={t.faint}>© 2026 proplytic.ai</Cap>
        <Cap t={t} color={t.faint}>Entwickelt in Berlin</Cap>
      </div>
    </div>
  );
}

// ─── AUTH FRAME
export function AuthFrame({ t, children }) {
  return (
    <div style={{
      minHeight: '100vh', background: t.page, color: t.ink, fontFamily: t.sans,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* left brand panel */}
      <div style={{
        position: 'relative', background: t.surface2, padding: '48px 52px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden', borderRight: `1px solid ${t.line}`,
      }}>
        <ContourBg t={t} />
        <BuildingArt t={t} maxWidth={520} style={{
          position: 'absolute', right: -90, top: '42%', transform: 'translateY(-50%)',
          opacity: 0.96, pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <Link href="/"><Logo t={t} size={30} /></Link>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: t.mono, fontSize: 12, letterSpacing: '.16em', color: t.highlight, marginBottom: 20 }}>PORTFOLIO</div>
          <h2 style={{ fontFamily: t.display, fontWeight: 600, fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0, color: t.ink, maxWidth: 360 }}>
            Jede Bewertung, sauber geführt an einem Ort.
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 15.5, lineHeight: 1.6, color: t.muted, marginTop: 20, maxWidth: 360 }}>
            Portfoliowert verfolgen, Renditen vergleichen und Berichte exportieren — alles in Ihrem privaten Arbeitsbereich.
          </p>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 30 }}>
          {[['4,2 Mio. €', 'Portfolio'], ['12', 'Objekte'], ['5,8 %', 'Ø Rendite']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: t.ink }}>{v}</div>
              <Cap t={t} color={t.faint}>{l}</Cap>
            </div>
          ))}
        </div>
      </div>
      {/* right form */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ width: 400 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── APP SHELL (sidebar + topbar)
export function AppShell({ t, active, title, action, children }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  const nav = [
    ['Portfolio', [['grid', 'Dashboard', '/dashboard'], ['fileText', 'Bewertungen', '/valuations'], ['compare', 'Vergleich', '/comparison']]],
    ['Werkzeuge', [['building2', 'Neue Bewertung', '/analyse'], ['ruler', 'Grundrisse', '#'], ['zap', 'Energieausweis', '#'], ['user', 'Mietlisten', '#'], ['wrench', 'Sanierung', '#']]],
    ['Mehr', [['star', 'Academy', '#'], ['layers', 'Marktplatz', '#']]],
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.page, color: t.ink, fontFamily: t.sans }}>
      {/* sidebar */}
      <div style={{ width: 252, background: t.surface, borderRight: `1px solid ${t.line}`, padding: '22px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '4px 8px 24px' }}><Link href="/"><Logo t={t} size={27} /></Link></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {nav.map(([grp, items]) => (
            <div key={grp}>
              <div style={{ padding: '0 8px 9px' }}><Cap t={t} color={t.faint}>{grp}</Cap></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(([ic, l, href]) => {
                  const on = l === active;
                  return (
                    <Link key={l} href={href} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: t.radius,
                        background: on ? t.highlightSoft : 'transparent',
                        color: on ? t.highlight : t.muted,
                        fontWeight: on ? 600 : 500,
                      }}>
                        <Icon name={ic} size={18} color={on ? t.highlight : t.faint} />
                        <span style={{ fontFamily: t.sans, fontSize: 14 }}>{l}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px', borderTop: `1px solid ${t.line}` }}>
          <Avatar t={t} initials={initialsFor(user)} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.sans, fontSize: 13, fontWeight: 600, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.user_metadata?.full_name || user?.email || 'Nicht angemeldet'}
            </div>
            <div style={{ fontFamily: t.sans, fontSize: 11.5, color: t.faint }}>{user ? 'Angemeldet' : 'Gast'}</div>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              aria-label="Abmelden"
              style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: t.radius, border: `1px solid ${t.line}`, background: 'transparent', color: t.faint, cursor: 'pointer', flexShrink: 0 }}
            >
              <Icon name="logOut" size={14} stroke={2} />
            </button>
          )}
        </div>
      </div>
      {/* main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 32px', borderBottom: `1px solid ${t.line}`,
          background: t.glass || 'rgba(240,245,249,0.60)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: t.radius, border: `1px solid ${t.line}`, display: 'grid', placeItems: 'center', color: t.muted }}>
              <Icon name="bell" size={18} />
            </div>
            {action}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
