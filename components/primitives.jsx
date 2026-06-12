import Icon from './icons';

// ─── MARK (vector logo glyph)
export function Mark({ t, size = 32 }) {
  const u = size / 32;
  const r = 1.6 * u;
  const soft = 'rgba(46,65,80,.26)';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="3" y="20" width="6" height="9" rx={r / u} fill={soft} />
      <rect x="11.5" y="14" width="6" height="15" rx={r / u} fill={soft} />
      <path d="M23 11.5 L26 8.2 L29 11.5 V27.4 a1.6 1.6 0 0 1 -1.6 1.6 H24.6 a1.6 1.6 0 0 1 -1.6 -1.6 Z"
        fill={t.accent} />
      <rect x="26.1" y="13.4" width="1.5" height="13.2" rx="0.7" fill={t.highlight} />
    </svg>
  );
}

// ─── BUILDING TILE (app-icon sized brand mark)
export function BuildingTile({ t, size = 30 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.27, overflow: 'hidden', flexShrink: 0,
      border: `1px solid ${t.line}`, background: '#EDF0F3', boxShadow: '0 1px 2px rgba(27,39,51,.10)',
    }}>
      <img src="/proplytic_building_sq.png" alt="" style={{
        width: '116%', height: '116%', objectFit: 'cover', objectPosition: 'center 40%',
        display: 'block', marginLeft: '-8%', marginTop: '-6%', mixBlendMode: 'multiply',
      }} />
    </div>
  );
}

// ─── BUILDING ART (large hero artwork)
export function BuildingArt({ t, width = '100%', maxWidth = 560, style }) {
  return (
    <img src="/proplytic_building.png" alt="proplytic.ai" style={{
      width, maxWidth, height: 'auto', display: 'block',
      mixBlendMode: 'multiply', ...style,
    }} />
  );
}

// ─── LOGO (reine Text-Wortmarke, keine Logo-Grafik)
export function Logo({ t, size = 30, color }) {
  return (
    <span style={{
      fontFamily: t.display, fontWeight: 600, fontSize: size * 0.82,
      letterSpacing: '-0.02em', lineHeight: 1, display: 'inline-flex', alignItems: 'baseline',
    }}>
      <span style={{ color: color || t.ink }}>proplytic</span>
      <span style={{ color: t.highlight }}>.ai</span>
    </span>
  );
}

// ─── CAPTION
export function Cap({ t, children, color, style }) {
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.17em',
      textTransform: 'uppercase', color: color || t.faint, ...style,
    }}>{children}</span>
  );
}

// ─── BUTTON
export function Btn({ t, children, variant = 'primary', size = 'md', icon, iconRight, full, style, onClick }) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 13px' : '11px 18px';
  const fs = size === 'lg' ? 16 : size === 'sm' ? 13 : 14.5;
  const skins = {
    primary: { background: t.primaryBg, color: t.primaryFg, borderColor: 'transparent' },
    accent:  { background: t.accent, color: t.onAccent, borderColor: 'transparent' },
    outline: { background: 'transparent', color: t.ink, borderColor: t.lineStrong },
    ghost:   { background: 'transparent', color: t.muted, borderColor: 'transparent' },
  };
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: t.sans, fontWeight: 600, fontSize: fs, lineHeight: 1, padding: pad,
        borderRadius: t.radius, cursor: 'pointer', border: '1px solid',
        whiteSpace: 'nowrap', width: full ? '100%' : 'auto',
        ...skins[variant], ...style,
      }}
    >
      {icon && <Icon name={icon} size={fs + 2} stroke={2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fs + 2} stroke={2} />}
    </button>
  );
}

// ─── CARD
export function Card({ t, children, pad = 22, style, accent, soft }) {
  return (
    <div style={{
      background: soft ? t.surface2 : t.surface,
      border: `${t.hair}px solid ${accent ? t.accent : t.line}`,
      borderRadius: t.radiusLg, padding: pad, boxShadow: soft ? 'none' : t.shadow,
      ...style,
    }}>{children}</div>
  );
}

// ─── INPUT FIELD
export function Field({ t, label, value, placeholder, icon, type, style }) {
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <div style={{ marginBottom: 7 }}><Cap t={t} color={t.muted}>{label}</Cap></div>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 13px',
        height: 46, background: t.surface,
        border: `1px solid ${t.line}`, borderRadius: t.radius,
      }}>
        {icon && <Icon name={icon} size={17} color={t.faint} />}
        <span style={{ fontFamily: t.sans, fontSize: 14.5, color: value ? t.ink : t.faint, flex: 1 }}>
          {value || placeholder}
        </span>
        {type === 'password' && <span style={{ letterSpacing: 3, color: t.faint }}>••••</span>}
      </div>
    </label>
  );
}

// ─── NUMBER FORMATTER
export function fmt(n, opts = {}) {
  if (opts.eur) {
    if (opts.compact && Math.abs(n) >= 1000) {
      const m = n / 1e6;
      return m >= 1 ? '€' + m.toFixed(m >= 10 ? 1 : 2) + 'M' : '€' + Math.round(n / 1000) + 'K';
    }
    return '€' + Math.round(n).toLocaleString('de-DE');
  }
  return n.toLocaleString('de-DE');
}

// ─── STAT CARD
export function Stat({ t, label, value, sub, icon, highlight }) {
  return (
    <Card t={t} pad={20} style={highlight ? { background: t.highlightSoft, border: `1px solid ${t.highlight}` } : {}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Cap t={t} color={highlight ? t.highlight : t.muted}>{label}</Cap>
          <div style={{
            fontFamily: t.mono, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em',
            color: highlight ? t.highlight : t.ink,
            marginTop: 9, fontVariantNumeric: 'tabular-nums',
          }}>{value}</div>
          {sub && <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint, marginTop: 5 }}>{sub}</div>}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: t.radius, display: 'grid', placeItems: 'center',
          background: highlight ? t.highlight : t.accentSoft,
          color: highlight ? t.onHighlight : t.accent,
        }}>
          <Icon name={icon} size={19} />
        </div>
      </div>
    </Card>
  );
}

// ─── SPARKLINE
export function Sparkline({ t, data, w = 200, h = 56, color, fill = true }) {
  const c = color || t.accent;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [
    i / (data.length - 1) * w,
    h - ((v - min) / (max - min || 1)) * (h - 8) - 4,
  ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {fill && <path d={area} fill={c} opacity={0.1} />}
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={c} />
    </svg>
  );
}

// ─── DONUT CHART
export function Donut({ t, segments, size = 132, thickness = 16 }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  const total = segments.reduce((a, s) => a + s.v, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.line} strokeWidth={thickness} />
      {segments.map((s, i) => {
        const len = (s.v / total) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c}
            strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="butt" />
        );
        off += len;
        return el;
      })}
    </svg>
  );
}

// ─── MINI RADAR CHART
export function MiniRadar({ t, series, w = 280, h = 240, labels: labelsProp }) {
  const cx = w / 2, cy = h / 2 + 6, R = Math.min(w, h) / 2 - 34;
  const axes = series[0].vals.length;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / axes;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];
  const labels = labelsProp || ['Rendite', 'Faktor', '€/m²', 'Cashflow', 'Eigenkap.'];
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {[0.33, 0.66, 1].map((g, i) => (
        <polygon key={i}
          points={Array.from({ length: axes }, (_, k) => pt(k, g).join(',')).join(' ')}
          fill="none" stroke={t.line} strokeWidth="1" />
      ))}
      {Array.from({ length: axes }, (_, k) => {
        const [x, y] = pt(k, 1);
        return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke={t.line} strokeWidth="1" />;
      })}
      {series.map((s, si) => (
        <polygon key={si}
          points={s.vals.map((v, k) => pt(k, v).join(',')).join(' ')}
          fill={s.c} fillOpacity={0.13} stroke={s.c} strokeWidth="2" strokeLinejoin="round" />
      ))}
      {labels.slice(0, axes).map((l, k) => {
        const [x, y] = pt(k, 1.16);
        return (
          <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontFamily={t.mono} fontSize="9.5" letterSpacing="0.05em" fill={t.faint}>
            {l.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// ─── CONTOUR / GRID BACKGROUND
export function ContourBg({ t, style }) {
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

// ─── MINI MAP
export function MapMini({ t, h = 200, pin = true, style }) {
  const land = t.mapLand || '#E6EAEF';
  const road = 'rgba(46,65,80,0.08)';
  const block = 'rgba(46,65,80,0.045)';
  const pinColor = t.highlight;
  return (
    <div style={{ position: 'relative', width: '100%', height: h, background: land, overflow: 'hidden', ...style }}>
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
          <div style={{
            width: 18, height: 18, borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)',
            background: pinColor, boxShadow: `0 0 0 4px rgba(58,167,181,.18)`,
          }} />
        </div>
      )}
    </div>
  );
}

// ─── AVATAR
export function Avatar({ t, initials = 'AK', size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: t.radius,
      background: t.accentSoft, color: t.accent,
      display: 'grid', placeItems: 'center', fontFamily: t.mono, fontWeight: 600,
      fontSize: size * 0.36, border: `1px solid ${t.line}`,
    }}>{initials}</div>
  );
}

export { Icon };
