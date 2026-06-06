// logo3.jsx — Refined "Standort" family for proplytic.ai.
// One concept — a localization pin housing a 3D building — executed four ways
// with real craft: isometric geometry, lit windows, a blue data floor, gloss
// highlights, and location signal-rings. viewBox 64×64. Each mark: { size }.

const P = {
  gL: '#46835E', // green light
  gM: '#2D5A3D', // green mid
  gD: '#1C3D29', // green dark
  gX: '#122A1C', // green deepest
  bL: '#5A7BEE', // blue light
  bM: '#3050C8', // blue
  bD: '#243F9E', // blue dark
  bG: '#A8BCFF', // blue glow
  cream: '#F4F1EA',
  paper: '#FCFBF7',
  shade: '#E4DFD4',
  ink:  '#1A1A1A',
};

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pt = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

// A lit window: small iso quad placed at fraction (s,t) on a face quad
// [P0 topNear, P1 topFar, P2 botFar, P3 botNear].
function winQuad(P0, P1, P2, P3, s, t, sw = 0.16, sh = 0.12, fill = '#fff', op = 0.9, key) {
  const top = lerp(P0, P1, s), bot = lerp(P3, P2, s);
  const c = lerp(top, bot, t);
  const ux = lerp(P0, P1, sw).map((v, i) => v - P0[i]); // half horizontal step
  const vy = lerp(P0, P3, sh).map((v, i) => v - P0[i]); // half vertical step
  const p1 = [c[0] - ux[0], c[1] - ux[1] - vy[1]];
  const p2 = [c[0] + ux[0], c[1] + ux[1] - vy[1]];
  const p3 = [c[0] + ux[0], c[1] + ux[1] + vy[1]];
  const p4 = [c[0] - ux[0], c[1] - ux[1] + vy[1]];
  return <path key={key} d={`M ${pt(p1)} L ${pt(p2)} L ${pt(p3)} L ${pt(p4)} Z`} fill={fill} opacity={op} />;
}

// Detailed isometric building. Returns array of SVG elements.
function isoBuilding({ cx, baseY, w, floors, fh, idPrefix, faceL, faceR, roof,
  line, accentFloors = [], accentL, accentR, windows = true, winColor = '#FFFFFF', winOp = 0.85 }) {
  const els = [];
  const cyTop = baseY - floors * fh;
  const D = (cy) => ({ up: [cx, cy - w / 2], rt: [cx + w, cy], dn: [cx, cy + w / 2], lf: [cx - w, cy] });
  const topD = D(cyTop);
  const botD = D(baseY);
  // left face
  els.push(<path key="lf" d={`M ${pt(topD.lf)} L ${pt(topD.dn)} L ${pt(botD.dn)} L ${pt(botD.lf)} Z`} fill={faceL} />);
  // right face
  els.push(<path key="rf" d={`M ${pt(topD.dn)} L ${pt(topD.rt)} L ${pt(botD.rt)} L ${pt(botD.dn)} Z`} fill={faceR} />);
  // accent floors (data) — fill a band on both faces
  accentFloors.forEach((k) => {
    const cy0 = cyTop + k * fh, cy1 = cy0 + fh;
    const a0 = D(cy0), a1 = D(cy1);
    els.push(<path key={`al${k}`} d={`M ${pt(a0.lf)} L ${pt(a0.dn)} L ${pt(a1.dn)} L ${pt(a1.lf)} Z`} fill={accentL} />);
    els.push(<path key={`ar${k}`} d={`M ${pt(a0.dn)} L ${pt(a0.rt)} L ${pt(a1.rt)} L ${pt(a1.dn)} Z`} fill={accentR} />);
  });
  // windows on non-accent floors
  if (windows) {
    for (let k = 0; k < floors; k++) {
      if (accentFloors.includes(k)) continue;
      const cy0 = cyTop + k * fh;
      const f0 = D(cy0), f1 = D(cy0 + fh);
      // right face quad: P0 dn_top, P1 rt_top, P2 rt_bot, P3 dn_bot
      const R0 = f0.dn, R1 = f0.rt, R2 = f1.rt, R3 = f1.dn;
      els.push(winQuad(R0, R1, R2, R3, 0.34, 0.5, 0.2, 0.34, winColor, winOp, `wr${k}a`));
      els.push(winQuad(R0, R1, R2, R3, 0.68, 0.5, 0.2, 0.34, winColor, winOp, `wr${k}b`));
      // left face quad: P0 lf_top, P1 dn_top, P2 dn_bot, P3 lf_bot
      const L0 = f0.lf, L1 = f0.dn, L2 = f1.dn, L3 = f1.lf;
      els.push(winQuad(L0, L1, L2, L3, 0.5, 0.5, 0.2, 0.34, winColor, winOp * 0.7, `wl${k}a`));
    }
  }
  // floor separator lines
  els.push(
    <g key="lines" stroke={line} strokeWidth="0.6" opacity="0.5">
      {Array.from({ length: floors - 1 }, (_, i) => {
        const cy = cyTop + (i + 1) * fh, d = D(cy);
        return <g key={i}><path d={`M ${pt(d.lf)} L ${pt(d.dn)}`} /><path d={`M ${pt(d.dn)} L ${pt(d.rt)}`} /></g>;
      })}
    </g>
  );
  // roof
  els.push(<path key="roof" d={`M ${pt(topD.up)} L ${pt(topD.rt)} L ${pt(topD.dn)} L ${pt(topD.lf)} Z`} fill={roof} />);
  // vertical front edge highlight
  els.push(<path key="edge" d={`M ${pt(topD.dn)} L ${pt(botD.dn)}`} stroke={line} strokeWidth="0.6" opacity="0.4" />);
  return els;
}

// ---------------------------------------------------------------------------
// MARK A — "Beacon" (RECOMMENDED)
// A glossy teardrop pin framing a circular map-viewport; a detailed iso tower
// with a blue data floor stands on it; concentric signal-rings mark the spot.
// ---------------------------------------------------------------------------
function MarkBeacon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="bc-pin" x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={P.gL} /><stop offset="0.55" stopColor={P.gM} /><stop offset="1" stopColor={P.gX} />
        </linearGradient>
        <radialGradient id="bc-disc" cx="0.4" cy="0.34" r="0.8">
          <stop offset="0" stopColor={P.paper} /><stop offset="1" stopColor={P.cream} />
        </radialGradient>
        <clipPath id="bc-clip"><circle cx="32" cy="24" r="12.6" /></clipPath>
      </defs>

      {/* signal rings at the located point */}
      <g stroke={P.gM} fill="none" strokeLinecap="round">
        <ellipse cx="32" cy="57.5" rx="9" ry="2.6" opacity="0.34" strokeWidth="1.4" />
        <ellipse cx="32" cy="58" rx="16.5" ry="4.6" opacity="0.16" strokeWidth="1.2" />
      </g>
      <ellipse cx="32" cy="57.8" rx="4.2" ry="1.3" fill={P.gM} opacity="0.5" />

      {/* teardrop pin */}
      <path d="M32 56.5 C25 45 16.2 37.4 16.2 24.6 A15.8 15.8 0 1 1 47.8 24.6 C47.8 37.4 39 45 32 56.5 Z"
        fill="url(#bc-pin)" />
      {/* outer rim */}
      <path d="M32 56.5 C25 45 16.2 37.4 16.2 24.6 A15.8 15.8 0 1 1 47.8 24.6 C47.8 37.4 39 45 32 56.5 Z"
        fill="none" stroke={P.gD} strokeWidth="0.8" opacity="0.6" />
      {/* gloss highlight */}
      <path d="M22 13.5 A14 14 0 0 1 41 11.4" stroke="#fff" strokeOpacity="0.34" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* map viewport */}
      <circle cx="32" cy="24" r="12.6" fill="url(#bc-disc)" />
      <g clipPath="url(#bc-clip)">
        {/* faint street grid */}
        <g stroke={P.shade} strokeWidth="0.8">
          <path d="M14 27 L50 19" /><path d="M14 33 L50 25" />
          <path d="M27 10 L23 40" /><path d="M37 10 L33 40" />
        </g>
        {/* ground shadow under building */}
        <ellipse cx="32" cy="33" rx="9" ry="3" fill={P.gD} opacity="0.12" />
        {/* the building */}
        {isoBuilding({ cx: 32, baseY: 31.5, w: 7.4, floors: 4, fh: 3.4, faceL: P.gD, faceR: P.gM,
          roof: P.gL, line: P.gX, accentFloors: [0], accentL: P.bD, accentR: P.bM, winColor: P.bG, winOp: 0.9 })}
        {/* roof node */}
        <circle cx="32" cy="13.6" r="1.7" fill={P.bM} stroke="#fff" strokeWidth="0.6" />
      </g>
      {/* viewport ring */}
      <circle cx="32" cy="24" r="12.6" fill="none" stroke={P.gX} strokeWidth="1.1" opacity="0.85" />
      <circle cx="32" cy="24" r="12.6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK B — "Relief"  solid pin, building as crisp negative space
// A solid green teardrop with a cream iso building carved into it; blue data
// node. The most logo-like / scalable execution.
// ---------------------------------------------------------------------------
function MarkRelief({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="rl-pin" x1="0.25" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor={P.gL} /><stop offset="0.5" stopColor={P.gM} /><stop offset="1" stopColor={P.gD} />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="59" rx="8" ry="2.2" fill={P.gM} opacity="0.2" />
      {/* pin */}
      <path d="M32 57 C24.5 45 15 37 15 24 A17 17 0 1 1 49 24 C49 37 39.5 45 32 57 Z" fill="url(#rl-pin)" />
      <path d="M21 13.5 A15 15 0 0 1 41 11" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* building carved in cream */}
      {isoBuilding({ cx: 32, baseY: 31, w: 9, floors: 4, fh: 3.8, faceL: P.shade, faceR: P.cream,
        roof: P.paper, line: '#CFC9BC', accentFloors: [0], accentL: P.bD, accentR: P.bM, winColor: P.gM, winOp: 0.5 })}
      {/* node */}
      <circle cx="32" cy="11.4" r="2" fill={P.bM} stroke={P.paper} strokeWidth="0.7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK C — "Rise"  the tower breaks out of the pin ring
// An open pin ring with a tall iso tower rising above it; upper floors are the
// blue data band, capped by a node. Dynamic, growth-forward.
// ---------------------------------------------------------------------------
function MarkRise({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="rs-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.gL} /><stop offset="1" stopColor={P.gD} />
        </linearGradient>
      </defs>
      {/* signal rings */}
      <ellipse cx="32" cy="58" rx="10" ry="2.8" fill="none" stroke={P.gM} strokeWidth="1.3" opacity="0.3" />
      <ellipse cx="32" cy="58.3" rx="4.4" ry="1.3" fill={P.gM} opacity="0.5" />
      {/* pin teardrop ring (thick, open) */}
      <path d="M32 56 C26 46 19 39.5 19 30 A13 13 0 1 1 45 30 C45 39.5 38 46 32 56 Z"
        fill="none" stroke="url(#rs-ring)" strokeWidth="5.4" strokeLinejoin="round" />
      {/* tower rising from center, breaking above the ring */}
      <g>
        {isoBuilding({ cx: 32, baseY: 38, w: 8, floors: 6, fh: 3.6, faceL: P.gD, faceR: P.gM,
          roof: P.bL, line: P.gX, accentFloors: [0, 1], accentL: P.bD, accentR: P.bM, winColor: P.bG, winOp: 0.9 })}
      </g>
      {/* node */}
      <circle cx="32" cy="14" r="2" fill={P.bM} stroke="#fff" strokeWidth="0.7" />
      <line x1="32" y1="16" x2="32" y2="18.4" stroke={P.bM} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK D — "Tile"  app-icon lockup
// A rounded gradient tile holding a compact pin+building emblem — the favicon
// / app-store execution of the same idea.
// ---------------------------------------------------------------------------
function MarkTile({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="tl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={P.gM} /><stop offset="1" stopColor={P.gX} />
        </linearGradient>
        <clipPath id="tl-clip"><rect x="4" y="4" width="56" height="56" rx="14" /></clipPath>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#tl-bg)" />
      <g clipPath="url(#tl-clip)">
        {/* faint grid */}
        <g stroke="#fff" strokeOpacity="0.06" strokeWidth="1">
          <path d="M4 24 L60 24" /><path d="M4 40 L60 40" /><path d="M22 4 L22 60" /><path d="M42 4 L42 60" />
        </g>
        {/* building emblem in white/blue */}
        <ellipse cx="32" cy="48" rx="13" ry="3.4" fill="#000" opacity="0.18" />
        {isoBuilding({ cx: 32, baseY: 46, w: 11, floors: 4, fh: 4.6, faceL: '#D8E2DC', faceR: '#F1F4F1',
          roof: '#FFFFFF', line: '#AEBDB3', accentFloors: [0], accentL: P.bD, accentR: P.bM, winColor: P.gM, winOp: 0.4 })}
        <circle cx="32" cy="20.5" r="2.4" fill={P.bL} stroke="#fff" strokeWidth="0.8" />
      </g>
      <rect x="4.5" y="4.5" width="55" height="55" rx="13.5" fill="none" stroke="#fff" strokeOpacity="0.12" />
    </svg>
  );
}

const MARKS3 = { Beacon: MarkBeacon, Relief: MarkRelief, Rise: MarkRise, Tile: MarkTile };

function Wordmark3({ Mark, size = 30, gap = 12, fontSize, ink = P.ink, accent = P.bM,
  serif = "'Bodoni Moda', Georgia, serif" }) {
  const M = Mark || MarkBeacon;
  const fs = fontSize || size * 0.78;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <M size={size} />
      <span style={{ fontFamily: serif, fontSize: fs, fontWeight: 600, letterSpacing: '.005em', lineHeight: 1 }}>
        <span style={{ color: ink }}>proplytic</span><span style={{ color: accent }}>.ai</span>
      </span>
    </span>
  );
}

Object.assign(window, { MarkBeacon, MarkRelief, MarkRise, MarkTile, MARKS3, Wordmark3, PALP: P });
