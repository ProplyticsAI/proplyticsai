// brand.jsx — Proplytics redesign: two new directions, new logo, shared UI primitives.
// Exports to window: THEMES, Mark, Logo, Icon, Cap, Btn, Card, Field, Stat,
// Sparkline, Donut, MiniRadar, ContourBg, MapMini, Avatar, fmt.
// All components take a `t` (theme) prop. Two themes: ledger (light editorial)
// & atlas (dark cartographic). No global `styles` object (per-component only).

// ─────────────────────────────────────────── THEMES
const ledger = {
  key: 'ledger', mode: 'light',
  page: '#EEE8DD', surface: '#FBFAF5', surface2: '#F4EFE6', sunken: '#E7E0D2',
  ink: '#191B1C', muted: '#6E665A', faint: '#A39B8A',
  line: '#E0D8C9', lineStrong: '#CDC3B0',
  accent: '#A07A38', accentSoft: '#EBDFC8', onAccent: '#FBFAF5',
  pos: '#3D6B4D', neg: '#B0503E', data: '#5B7C99',
  display: "'Spectral', Georgia, serif",
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
  radius: 6, radiusLg: 11, hair: 1,
  shadow: '0 1px 2px rgba(50,38,18,.05), 0 16px 36px -26px rgba(50,38,18,.32)',
  primaryBg: '#191B1C', primaryFg: '#F4EFE6',
};
const atlas = {
  key: 'atlas', mode: 'dark',
  page: '#0D1316', surface: '#141D21', surface2: '#1B262B', sunken: '#0A0F12',
  ink: '#EBF1F0', muted: '#8B9EA3', faint: '#5C6F76',
  line: 'rgba(255,255,255,.085)', lineStrong: 'rgba(255,255,255,.17)',
  accent: '#C8F24E', accentSoft: 'rgba(200,242,78,.13)', onAccent: '#0D1316',
  pos: '#5BE39B', neg: '#FF7C6B', data: '#79ABFF',
  display: "'Space Grotesk', system-ui, sans-serif",
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
  radius: 13, radiusLg: 20, hair: 1,
  shadow: '0 1px 2px rgba(0,0,0,.45), 0 22px 60px -34px rgba(0,0,0,.9)',
  primaryBg: '#C8F24E', primaryFg: '#0D1316',
};
const THEMES = { ledger, atlas };

// ─────────────────────────────────────────── LOGO MARK
// Concept: an ascending bar trio where the tallest bar wears a gable roof —
// data resolving into a building. "Analytics → Property".
function Mark({ t, size = 32 }) {
  const s = size, u = s / 32;
  const accent = t.accent;
  const ink = t.mode === 'dark' ? t.ink : t.ink;
  const soft = t.mode === 'dark' ? 'rgba(235,241,240,.34)' : 'rgba(25,27,28,.30)';
  const r = 1.6 * u;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      {/* bar 1 (short) */}
      <rect x="3" y="20" width="6" height="9" rx={r / u} fill={soft} />
      {/* bar 2 (mid) */}
      <rect x="11.5" y="14" width="6" height="15" rx={r / u} fill={soft} />
      {/* bar 3 = house (tall, gabled, accent) */}
      <path d="M23 11.5 L26 8.2 L29 11.5 V27.4 a1.6 1.6 0 0 1 -1.6 1.6 H24.6 a1.6 1.6 0 0 1 -1.6 -1.6 Z"
        fill={accent} />
      {/* window notch in the house */}
      <rect x="25" y="15" width="2" height="3.4" rx="0.7" fill={t.mode === 'dark' ? t.page : t.surface} opacity="0.9" />
    </svg>
  );
}

function Logo({ t, size = 30, showText = true, color }) {
  const c = color || t.ink;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.34 }}>
      <Mark t={t} size={size} />
      {showText && (
        <span style={{
          fontFamily: t.display, fontWeight: 600, fontSize: size * 0.74,
          letterSpacing: t.key === 'atlas' ? '-0.02em' : '-0.015em', color: c, lineHeight: 1,
        }}>
          Proplytics
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────── ICONS (lucide-ish, 24 grid)
const ICONS = {
  arrowRight: 'M5 12h13 M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7 M8 7h9v9',
  zap: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  shield: 'M12 3l8 3v5.5c0 4.8-3.4 7.8-8 9-4.6-1.2-8-4.2-8-9V6l8-3z',
  clock: 'M12 7v5l3 2',
  mapPin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z',
  fileText: 'M14 3v5h5 M14 3H6v18h12V8z M9 13h6 M9 17h6',
  trendingUp: 'M3 16l6-6 4 4 8-8 M17 6h4v4',
  pie: 'M12 3a9 9 0 1 0 9 9h-9z M12 3v9',
  wrench: 'M15 6a4 4 0 0 1-5 5L5 16l3 3 5-5a4 4 0 0 0 5-5l-2 2-2-2 2-2z',
  compare: 'M8 4v16 M16 4v16 M4 8h6m-2-3l3 3-3 3 M20 16h-6m2-3l-3 3 3 3',
  download: 'M12 4v11 M8 11l4 4 4-4 M5 20h14',
  building: 'M5 21V5l8-2v18 M13 21V9l6 2v10 M3 21h18 M8 8v0 M8 12v0 M8 16v0',
  home: 'M4 11l8-7 8 7 M6 10v10h12V10',
  euro: 'M16 7a5 6 0 1 0 0 10 M5 10h7 M5 14h6',
  percent: 'M6 6.5h.01 M18 17.5h.01 M18 6L6 18 M5.5 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z M16.5 17.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z',
  bars: 'M5 20V11 M12 20V5 M19 20v-6 M3 20h18',
  plus: 'M12 5v14 M5 12h14',
  check: 'M5 13l4 4L19 6',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3 M5 11h14v9H5z',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  sparkles: 'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5',
  sliders: 'M4 8h10 M18 8h2 M4 16h2 M10 16h10 M14 5v6 M6 13v6',
  link: 'M9 15l6-6 M10 6l1-1a4 4 0 0 1 6 6l-1 1 M14 18l-1 1a4 4 0 0 1-6-6l1-1',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  layers: 'M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5 M3 17l9 5 9-5',
  x: 'M6 6l12 12 M18 6L6 18',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  message: 'M4 5h16v11H9l-4 3v-3H4z',
  star: 'M12 4l2.3 5 5.4.5-4.1 3.6 1.2 5.3L12 20.7 7.2 23.4l1.2-5.3L4.3 14.5l5.4-.5z',
  building2: 'M4 21V7l7-3v17 M11 21V11l8 3v7 M3 21h18',
  download2: 'M12 4v11 M8 11l4 4 4-4 M5 20h14',
  grid: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  ruler: 'M4 8l12 12 4-4L8 4 4 8z M8 8l2 2 M11 11l2 2 M14 14l2 2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 20a7 7 0 0 1 14 0',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6 M10 20a2 2 0 0 0 4 0',
  filter: 'M4 5h16l-6 7v6l-4 2v-8z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
};
function Icon({ name, size = 18, stroke = 1.7, color = 'currentColor', fill = 'none', style }) {
  const d = ICONS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flex: '0 0 auto', ...style }}>
      {(d || '').split(' M').map((seg, i) => <path key={i} d={(i ? 'M' : '') + seg} />)}
    </svg>
  );
}

// ─────────────────────────────────────────── CAPTION (mono register label)
function Cap({ t, children, color, style }) {
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.17em',
      textTransform: 'uppercase', color: color || t.faint, ...style,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────── BUTTON
function Btn({ t, children, variant = 'primary', size = 'md', icon, iconRight, full, style }) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 13px' : '11px 18px';
  const fs = size === 'lg' ? 16 : size === 'sm' ? 13 : 14.5;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: t.sans, fontWeight: 600, fontSize: fs, lineHeight: 1, padding: pad,
    borderRadius: t.radius, cursor: 'pointer', border: '1px solid transparent',
    letterSpacing: t.key === 'atlas' ? '-0.005em' : 0, width: full ? '100%' : 'auto',
    whiteSpace: 'nowrap', ...style,
  };
  const skins = {
    primary: { background: t.primaryBg, color: t.primaryFg },
    accent: { background: t.accent, color: t.onAccent },
    outline: { background: 'transparent', color: t.ink, borderColor: t.lineStrong },
    ghost: { background: 'transparent', color: t.muted },
  };
  return (
    <button style={{ ...base, ...skins[variant] }}>
      {icon && <Icon name={icon} size={fs + 2} stroke={2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} stroke={2} />}
    </button>
  );
}

// ─────────────────────────────────────────── CARD
function Card({ t, children, pad = 22, style, accent, soft }) {
  return (
    <div style={{
      background: soft ? t.surface2 : t.surface,
      border: `${t.hair}px solid ${accent ? t.accent : t.line}`,
      borderRadius: t.radiusLg, padding: pad, boxShadow: soft ? 'none' : t.shadow,
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────── INPUT FIELD
function Field({ t, label, value, placeholder, icon, type, style }) {
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <div style={{ marginBottom: 7 }}><Cap t={t} color={t.muted}>{label}</Cap></div>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 13px',
        height: 46, background: t.mode === 'dark' ? t.sunken : t.surface,
        border: `1px solid ${t.line}`, borderRadius: t.radius,
      }}>
        {icon && <Icon name={icon} size={17} color={t.faint} />}
        <span style={{
          fontFamily: t.sans, fontSize: 14.5, color: value ? t.ink : t.faint, flex: 1,
        }}>{value || placeholder}</span>
        {type === 'password' && <span style={{ letterSpacing: 3, color: t.faint }}>••••</span>}
      </div>
    </label>
  );
}

// ─────────────────────────────────────────── STAT
function fmt(n, opts = {}) {
  if (opts.eur) {
    if (opts.compact && Math.abs(n) >= 1000) {
      const m = n / 1e6;
      return m >= 1 ? '€' + m.toFixed(m >= 10 ? 1 : 2) + 'M' : '€' + Math.round(n / 1000) + 'K';
    }
    return '€' + Math.round(n).toLocaleString('en-US');
  }
  return n.toLocaleString('en-US');
}

function Stat({ t, label, value, sub, icon, highlight }) {
  return (
    <Card t={t} pad={20} accent={highlight} style={highlight ? { background: t.mode === 'dark' ? t.accentSoft : t.accentSoft } : {}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Cap t={t} color={t.muted}>{label}</Cap>
          <div style={{
            fontFamily: t.mono, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em',
            color: highlight ? (t.mode === 'dark' ? t.accent : t.accentText || t.accent) : t.ink,
            marginTop: 9, fontVariantNumeric: 'tabular-nums',
          }}>{value}</div>
          {sub && <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint, marginTop: 5 }}>{sub}</div>}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: t.radius, display: 'grid', placeItems: 'center',
          background: highlight ? t.accent : (t.mode === 'dark' ? t.surface2 : t.accentSoft),
          color: highlight ? t.onAccent : t.accent,
        }}><Icon name={icon} size={19} /></div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────── SPARKLINE
function Sparkline({ t, data, w = 200, h = 56, color, fill = true }) {
  const c = color || t.accent;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - ((v - min) / (max - min || 1)) * (h - 8) - 4]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {fill && <path d={area} fill={c} opacity={t.mode === 'dark' ? 0.14 : 0.1} />}
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={c} />
    </svg>
  );
}

// ─────────────────────────────────────────── DONUT
function Donut({ t, segments, size = 132, thickness = 16 }) {
  const r = (size - thickness) / 2, c = 2 * Math.PI * r;
  let off = 0;
  const total = segments.reduce((a, s) => a + s.v, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.line} strokeWidth={thickness} />
      {segments.map((s, i) => {
        const len = (s.v / total) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c}
            strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="butt" />
        );
        off += len; return el;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────── MINI RADAR
function MiniRadar({ t, series, w = 280, h = 240 }) {
  const cx = w / 2, cy = h / 2 + 6, R = Math.min(w, h) / 2 - 34;
  const axes = series[0].vals.length;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / axes;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];
  const labels = ['Yield', 'Factor', '€/m²', 'Cashflow', 'Equity'];
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {[0.33, 0.66, 1].map((g, i) => (
        <polygon key={i} points={Array.from({ length: axes }, (_, k) => pt(k, g).join(',')).join(' ')}
          fill="none" stroke={t.line} strokeWidth="1" />
      ))}
      {Array.from({ length: axes }, (_, k) => {
        const [x, y] = pt(k, 1);
        return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke={t.line} strokeWidth="1" />;
      })}
      {series.map((s, si) => (
        <polygon key={si}
          points={s.vals.map((v, k) => pt(k, v).join(',')).join(' ')}
          fill={s.c} fillOpacity={t.mode === 'dark' ? 0.18 : 0.13} stroke={s.c} strokeWidth="2" strokeLinejoin="round" />
      ))}
      {labels.slice(0, axes).map((l, k) => {
        const [x, y] = pt(k, 1.16);
        return <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
          fontFamily={t.mono} fontSize="9.5" letterSpacing="0.05em" fill={t.faint}>{l.toUpperCase()}</text>;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────── CONTOUR / GRID BACKGROUND
function ContourBg({ t, style }) {
  if (t.key === 'atlas') {
    const stroke = 'rgba(200,242,78,0.07)';
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 600">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i}
            d={`M-20 ${120 + i * 70} C 150 ${60 + i * 70}, 320 ${190 + i * 70}, 470 ${110 + i * 70} S 760 ${60 + i * 70}, 860 ${150 + i * 70}`}
            fill="none" stroke={stroke} strokeWidth="1.3" />
        ))}
      </svg>
    );
  }
  // ledger: faint blueprint grid
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}>
      <defs>
        <pattern id="lg-grid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="rgba(25,27,28,0.045)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lg-grid)" />
    </svg>
  );
}

// ─────────────────────────────────────────── MINI MAP
function MapMini({ t, w = '100%', h = 200, pin = true, style }) {
  const land = t.mode === 'dark' ? '#10191D' : '#ECE6D9';
  const road = t.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(25,27,28,0.07)';
  const block = t.mode === 'dark' ? 'rgba(255,255,255,0.035)' : 'rgba(25,27,28,0.04)';
  return (
    <div style={{ position: 'relative', width: w, height: h, background: land, overflow: 'hidden', ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice">
        {[30, 90, 150, 210, 270].map((x) => <rect key={x} x={x} y="0" width="22" height="220" fill={block} />)}
        {[40, 110, 180].map((y) => <rect key={y} x="0" y={y} width="320" height="16" fill={block} />)}
        <path d="M0 70 L320 90" stroke={road} strokeWidth="6" />
        <path d="M70 0 L90 220" stroke={road} strokeWidth="6" />
        <path d="M0 150 Q160 130 320 165" stroke={road} strokeWidth="4" fill="none" />
        <path d="M210 0 L240 220" stroke={road} strokeWidth="5" />
      </svg>
      {pin && (
        <div style={{ position: 'absolute', top: '46%', left: '52%', transform: 'translate(-50%,-100%)' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)', background: t.accent, boxShadow: t.mode === 'dark' ? '0 0 0 4px rgba(200,242,78,.18)' : '0 0 0 4px rgba(160,122,56,.16)' }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────── AVATAR
function Avatar({ t, initials = 'AK', size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: t.key === 'atlas' ? '50%' : t.radius,
      background: t.mode === 'dark' ? t.surface2 : t.accentSoft, color: t.accent,
      display: 'grid', placeItems: 'center', fontFamily: t.mono, fontWeight: 600,
      fontSize: size * 0.36, border: `1px solid ${t.line}`,
    }}>{initials}</div>
  );
}

Object.assign(window, {
  THEMES, Mark, Logo, Icon, Cap, Btn, Card, Field, Stat,
  Sparkline, Donut, MiniRadar, ContourBg, MapMini, Avatar, fmt,
});
