// logo2.jsx — Dimensional brand marks for proplytic.ai.
// Direction: futuristic 3D real-estate building × data layers × a
// localization pin (Maps-style). Built in isometric projection with
// green→blue gradients. viewBox 64×64. Each mark: { size }.
// Exports marks + Wordmark2 to window.

const G = {
  dark:  '#234A31',
  mid:   '#2D5A3D',
  light: '#3C7656',
  glow:  '#5BA77B',
  blue:  '#3050C8',
  blueL: '#5A7BEE',
  blueG: '#8AA6FF',
  ink:   '#1A1A1A',
};

// Reusable teardrop location pin (Maps-style): circle head + tapered tip.
function Pin({ cx, cy, r, tip, fill, dot = '#fff', stroke }) {
  return (
    <g>
      <path
        d={`M ${cx - r * 0.72} ${cy + r * 0.62}
            L ${cx} ${tip}
            L ${cx + r * 0.72} ${cy + r * 0.62} Z`}
        fill={fill} stroke={stroke || 'none'} strokeWidth={stroke ? 1 : 0} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke || 'none'} strokeWidth={stroke ? 1 : 0} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill={dot} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// MARK 1 — "Datatower"  (RECOMMENDED)
// A solid isometric tower with glowing data floors; one floor and the roof
// pin rendered in the blue accent. Real estate + data + location at a glance.
// ---------------------------------------------------------------------------
function MarkDatatower({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="dt-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.mid} /><stop offset="1" stopColor={G.dark} />
        </linearGradient>
        <linearGradient id="dt-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.light} /><stop offset="1" stopColor={G.mid} />
        </linearGradient>
        <linearGradient id="dt-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.blueL} /><stop offset="1" stopColor={G.blue} />
        </linearGradient>
      </defs>
      {/* soft ground shadow */}
      <ellipse cx="32" cy="57" rx="20" ry="5" fill={G.mid} opacity="0.12" />
      {/* roof */}
      <path d="M32 11 L49 19.5 L32 28 L15 19.5 Z" fill={G.glow} />
      {/* left face */}
      <path d="M15 19.5 L32 28 L32 53 L15 44.5 Z" fill="url(#dt-l)" />
      {/* right face */}
      <path d="M32 28 L49 19.5 L49 44.5 L32 53 Z" fill="url(#dt-r)" />
      {/* blue data floor (band on both faces) */}
      <path d="M15 27 L32 35.5 L32 41 L15 32.5 Z" fill={G.blue} opacity="0.92" />
      <path d="M32 35.5 L49 27 L49 32.5 L32 41 Z" fill="url(#dt-b)" />
      {/* floor lines */}
      <g stroke={G.dark} strokeWidth="1" opacity="0.45" strokeLinecap="round">
        <path d="M15 36.5 L32 45" /><path d="M32 45 L49 36.5" />
      </g>
      <g stroke={G.glow} strokeWidth="1" opacity="0.5" strokeLinecap="round">
        <path d="M32 28 L32 53" />
      </g>
      {/* roof location pin */}
      <Pin cx={32} cy={6.5} r={4.4} tip={15} fill="url(#dt-b)" dot="#fff" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK 2 — "Standort"  Maps teardrop pin housing an isometric building
// The localization-first read: a glossy green pin whose head contains a
// white 3D building; a blue data node sits at its core.
// ---------------------------------------------------------------------------
function MarkStandort({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="st-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.light} /><stop offset="1" stopColor={G.dark} />
        </linearGradient>
        <linearGradient id="st-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.blueL} /><stop offset="1" stopColor={G.blue} />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="59" rx="10" ry="2.6" fill={G.mid} opacity="0.18" />
      {/* big teardrop pin */}
      <path d="M32 58 C 20 40 14 33 14 24 A 18 18 0 1 1 50 24 C 50 33 44 40 32 58 Z" fill="url(#st-p)" />
      {/* gloss */}
      <path d="M22 14 A 14 14 0 0 1 40 11" stroke="#fff" strokeWidth="2.4" strokeOpacity="0.28" strokeLinecap="round" fill="none" />
      {/* iso building inside head */}
      <g>
        <path d="M32 13 L43 18.5 L32 24 L21 18.5 Z" fill="#fff" />
        <path d="M21 18.5 L32 24 L32 35 L21 29.5 Z" fill="#EAE7E0" />
        <path d="M32 24 L43 18.5 L43 29.5 L32 35 Z" fill="#F6F4EF" />
        {/* blue data node / window */}
        <path d="M32 26 L43 20.5 L43 24 L32 29.5 Z" fill="url(#st-b)" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK 3 — "Quartier"  isometric skyline on a data grid plane
// Three towers rising from a cadastral grid; the tallest is blue and carries
// a location pin. The most "city / portfolio" read.
// ---------------------------------------------------------------------------
function MarkQuartier({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="q-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.light} /><stop offset="1" stopColor={G.mid} />
        </linearGradient>
        <linearGradient id="q-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={G.blueL} /><stop offset="1" stopColor={G.blue} />
        </linearGradient>
      </defs>
      {/* grid base plane */}
      <path d="M32 38 L58 51 L32 64 L6 51 Z" fill={G.mid} opacity="0.10" />
      <g stroke={G.mid} strokeWidth="0.9" opacity="0.4">
        <path d="M19 44.5 L45 57.5" /><path d="M45 44.5 L19 57.5" />
        <path d="M32 38 L32 64" />
      </g>
      {/* left short tower (green) */}
      <path d="M14 42 L22 46 L22 54 L14 50 Z" fill={G.dark} />
      <path d="M22 46 L30 42 L30 50 L22 54 Z" fill="url(#q-g)" />
      <path d="M14 42 L22 46 L30 42 L22 38 Z" fill={G.glow} />
      {/* right mid tower (green) */}
      <path d="M38 44 L46 48 L46 55 L38 51 Z" fill={G.dark} />
      <path d="M46 48 L52 45 L52 52 L46 55 Z" fill="url(#q-g)" />
      <path d="M38 44 L46 48 L52 45 L44 41 Z" fill={G.glow} />
      {/* tall center tower (blue) with pin */}
      <path d="M28 30 L36 34 L36 52 L28 48 Z" fill={G.blue} />
      <path d="M36 34 L44 30 L44 48 L36 52 Z" fill="url(#q-b)" />
      <path d="M28 30 L36 34 L44 30 L36 26 Z" fill={G.blueG} />
      <g stroke="#fff" strokeOpacity="0.35" strokeWidth="0.9">
        <path d="M28 37 L36 41" /><path d="M36 41 L44 37" />
        <path d="M28 43 L36 47" /><path d="M36 47 L44 43" />
      </g>
      <Pin cx={36} cy={12} r={4} tip={21} fill={G.blue} dot="#fff" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK 4 — "Hologramm"  floating isometric data-slabs (holographic tower)
// Four translucent layers stack into a building; blue edge-light reads as a
// scanned / digital twin. A pin node hovers above. Most KI-forward.
// ---------------------------------------------------------------------------
function MarkHologramm({ size = 64 }) {
  const slabs = [
    { cy: 47, w: 18, fill: G.mid,  edge: G.glow },
    { cy: 40, w: 16, fill: G.mid,  edge: G.glow },
    { cy: 33, w: 14, fill: G.blue, edge: G.blueG },
    { cy: 26, w: 12, fill: G.blue, edge: G.blueG },
  ];
  const t = 4.5;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <ellipse cx="32" cy="58" rx="19" ry="4.5" fill={G.mid} opacity="0.12" />
      {slabs.map((s, i) => {
        const cx = 32, w = s.w, h = w / 2;
        const up = [cx, s.cy - h], rt = [cx + w, s.cy], dn = [cx, s.cy + h], lf = [cx - w, s.cy];
        return (
          <g key={i} opacity={0.96}>
            {/* left face */}
            <path d={`M${lf[0]} ${lf[1]} L${dn[0]} ${dn[1]} L${dn[0]} ${dn[1] + t} L${lf[0]} ${lf[1] + t} Z`} fill={s.fill} opacity="0.78" />
            {/* right face */}
            <path d={`M${dn[0]} ${dn[1]} L${rt[0]} ${rt[1]} L${rt[0]} ${rt[1] + t} L${dn[0]} ${dn[1] + t} Z`} fill={s.fill} opacity="0.55" />
            {/* top face */}
            <path d={`M${up[0]} ${up[1]} L${rt[0]} ${rt[1]} L${dn[0]} ${dn[1]} L${lf[0]} ${lf[1]} Z`} fill={s.fill} opacity="0.92" />
            {/* edge light */}
            <path d={`M${up[0]} ${up[1]} L${rt[0]} ${rt[1]} L${dn[0]} ${dn[1]} L${lf[0]} ${lf[1]} Z`} fill="none" stroke={s.edge} strokeWidth="1.1" strokeOpacity="0.85" strokeLinejoin="round" />
          </g>
        );
      })}
      {/* hovering location pin */}
      <Pin cx={32} cy={9} r={4.2} tip={18} fill={G.blueL} dot="#fff" />
    </svg>
  );
}

const MARKS2 = {
  Datatower: MarkDatatower,
  Standort: MarkStandort,
  Quartier: MarkQuartier,
  Hologramm: MarkHologramm,
};

function Wordmark2({ Mark, size = 30, gap = 12, fontSize, ink = G.ink, accent = G.blue,
  serif = "'Bodoni Moda', Georgia, serif" }) {
  const M = Mark || MarkDatatower;
  const fs = fontSize || size * 0.8;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <M size={size} />
      <span style={{ fontFamily: serif, fontSize: fs, fontWeight: 600, letterSpacing: '.005em', lineHeight: 1 }}>
        <span style={{ color: ink }}>proplytic</span><span style={{ color: accent }}>.ai</span>
      </span>
    </span>
  );
}

Object.assign(window, {
  MarkDatatower, MarkStandort, MarkQuartier, MarkHologramm, MARKS2, Wordmark2, BRANDG: G,
});
