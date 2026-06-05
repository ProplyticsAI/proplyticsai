// logo5.jsx — "proplytic.ai" refined isometric data-center mark.
// Muted, matte, premium — palette sampled from the user's reference.
// True isometric (both ground axes at 30°). Reads as building + data layers
// (stacked slabs) + server racks (louvered columns) + glass server floors.
// No glow, no badge. Exports MarkDatahaus + lockups to window.

const DH = {
  paper:    '#FBF9F6',
  creamT:   '#EAE2D6', creamL: '#D7CBB6', creamR: '#BBAE97', creamEdge: '#C9BCA4',
  sageT:    '#9AA681', sageL: '#7E8A6F', sageR: '#5E6A4E', sageLine: '#4F5B3D',
  navyInk:  '#213A5A',
  accent:   '#6F7F59',
};
// glass tones
const GL = { top: '#4E6675', left: '#3C5563', right: '#26404C', line: '#5E7886', cell: '#324F5C' };

// ---- isometric projection ----
function makeIso(s, ox, oy) {
  const K = 0.866; // cos30
  return (gx, gy, gz) => [ox + (gx - gy) * K * s, oy + (gx + gy) * 0.5 * s - gz * s];
}

const poly = (pts, fill, extra = {}) =>
  <path d={'M' + pts.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L ') + ' Z'} fill={fill} {...extra} />;

// One iso box → top/left/right faces (+ optional thin edge stroke).
function Box({ iso, g, d, mat, stroke = true }) {
  const [x, y, z] = g, [dx, dy, dz] = d;
  const P = (a, b, c) => iso(x + a, y + b, z + c);
  const top = [P(0,0,dz), P(dx,0,dz), P(dx,dy,dz), P(0,dy,dz)];
  const right = [P(dx,0,0), P(dx,0,dz), P(dx,dy,dz), P(dx,dy,0)];
  const left = [P(0,dy,0), P(0,dy,dz), P(dx,dy,dz), P(dx,dy,0)];
  const st = stroke ? { stroke: 'rgba(20,28,38,0.16)', strokeWidth: 0.8, strokeLinejoin: 'round' } : {};
  return (
    <g>
      {poly(left, mat.left, st)}
      {poly(right, mat.right, st)}
      {poly(top, mat.top, st)}
    </g>
  );
}

const seg = (iso, a, b, stroke, w = 1, op = 1, key) => {
  const p = iso(...a), q = iso(...b);
  return <path key={key} d={`M${p[0].toFixed(2)} ${p[1].toFixed(2)} L${q[0].toFixed(2)} ${q[1].toFixed(2)}`}
    stroke={stroke} strokeWidth={w} opacity={op} strokeLinecap="round" />;
};

function MarkDatahaus({ size = 240 }) {
  const w = size, h = size * 220 / 240;
  return (
    <svg width={w} height={h} viewBox={`0 0 240 220`} fill="none"
      style={{ display: 'block', flex: '0 0 auto', width: w, height: h }} preserveAspectRatio="xMidYMid meet">
      <DatahausScene />
    </svg>
  );
}

// The building volumes only (no base / shadow), sitting at z = Z0.
function BuildingVolumes({ iso, Z0 = 0.5, glow = false }) {
  const white  = { top: '#F6F1E7', left: '#EAE0D0', right: '#D6C8B1' };
  const sage   = { top: DH.sageT,  left: DH.sageL,  right: DH.sageR };
  const gMat   = { top: '#5A7280', left: '#3F5867', right: '#284450' };
  const gElev  = { top: '#3F5867', left: '#2C4753', right: '#203A45' };
  const FY = 3.4;
  return (
    <g>
      {/* right elevator / server block */}
      <Box iso={iso} g={[3.0,0.7,Z0]} d={[1.0,2.7,3.4]} mat={gElev} />
      <g>
        {[1,2,3,4,5,6].map(i=> seg(iso,[3.0,0.7,Z0+i*0.46],[3.0,FY,Z0+i*0.46], GL.line,0.5,0.35,'eh'+i))}
        {[1,2].map(i=> seg(iso,[3.0+i*0.33,0.7,Z0],[3.0+i*0.33,0.7,Z0+3.4], GL.line,0.5,0.4,'evr'+i))}
        {[1,2,3,4,5,6].map(i=> seg(iso,[3.0,0.7,Z0+i*0.46],[4.0,0.7,Z0+i*0.46], GL.line,0.5,0.4,'evh'+i))}
      </g>
      {glow ? seg(iso,[4.0,0.7,Z0+0.2],[4.0,0.7,Z0+3.2], '#5FD9C0', 1.4, 0.85, 'gE') : null}

      {/* main glass facade core */}
      <Box iso={iso} g={[0.62,0.6,Z0]} d={[2.38,2.8,2.9]} mat={gMat} />
      {(() => {
        const a=iso(0.62,FY,Z0+0.3), b=iso(0.62+1.3,FY,Z0+2.9), c=iso(0.62+1.3,FY,Z0+1.6), d=iso(0.62,FY,Z0+0.05);
        return <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]} L${d[0]} ${d[1]} Z`} fill="#fff" opacity="0.06" />;
      })()}
      <g>
        {[1,2,3,4,5].map(i=> seg(iso,[0.62,FY,Z0+i*0.48],[3.0,FY,Z0+i*0.48], GL.line,0.55,0.35,'fh'+i))}
        {[1,2,3,4].map(i=> seg(iso,[0.62+i*0.48,FY,Z0],[0.62+i*0.48,FY,Z0+2.9], GL.line,0.55,0.28,'fv'+i))}
      </g>

      {/* white data-slab trays */}
      {[0.95, 1.62, 2.29].map((z,i)=>(
        <Box key={'tray'+i} iso={iso} g={[0.86, FY-0.02, z]} d={[1.9, 0.4, 0.2]} mat={white} />
      ))}

      {/* sage louvered pilasters */}
      <Box iso={iso} g={[0.6, FY-0.05, Z0]} d={[0.28, 0.33, 2.62]} mat={sage} />
      <g>{[0.3,0.6].map((u,i)=>
        seg(iso,[0.6+0.28*u, FY-0.05+0.33, Z0],[0.6+0.28*u, FY-0.05+0.33, Z0+2.62], DH.sageLine,0.7,0.7,'plL'+i))}</g>
      {glow ? seg(iso,[0.6+0.14, FY+0.28, Z0+0.1],[0.6+0.14, FY+0.28, Z0+2.5], '#5FD9C0', 1.3, 0.8, 'gL') : null}
      <Box iso={iso} g={[2.74, FY-0.05, Z0]} d={[0.24, 0.3, 2.5]} mat={sage} />
      <g>{[0.35,0.7].map((u,i)=>
        seg(iso,[2.74+0.24*u, FY-0.05+0.3, Z0],[2.74+0.24*u, FY-0.05+0.3, Z0+2.5], DH.sageLine,0.7,0.7,'plR'+i))}</g>

      {/* entrance + LEDs */}
      <Box iso={iso} g={[2.28,FY+0.02,Z0]} d={[0.5,0.4,0.92]} mat={sage} />
      <g>{[0,1,2].map(r=>[0,1,2].map(cc=>{
        const p=iso(1.05+cc*0.32, FY+0.42, Z0+0.18+r*0.24);
        return <rect key={'led'+r+cc} x={p[0]-1.3} y={p[1]-1.1} width="2.6" height="1.9" rx="0.4"
          fill={(r*3+cc)%4===0?DH.accent:GL.line} opacity="0.75" />;
      }))}</g>

      {/* rooftop */}
      <Box iso={iso} g={[0.72,0.7,Z0+2.9]} d={[2.18,2.4,0.3]} mat={white} />
      <Box iso={iso} g={[1.05,1.0,Z0+2.9+0.3]} d={[0.95,1.1,0.5]} mat={gMat} />
    </g>
  );
}

// Plain "Datahaus" — building on a cream plinth.
function DatahausScene() {
  const iso = makeIso(18, 112, 62);
  const cream = { top: DH.creamT, left: DH.creamL, right: DH.creamR };
  return (
    <g>
      <ellipse cx="116" cy={iso(2.2, 2.2, 0)[1] + 2} rx="98" ry="27" fill="#3A4150" opacity="0.10" />
      <Box iso={iso} g={[-0.1,-0.1,0]} d={[4.6,3.9,0.5]} mat={cream} />
      <BuildingVolumes iso={iso} Z0={0.5} />
    </g>
  );
}

// ---- flat helpers for the PCB surface ----
const flatQuad = (iso, gx, gy, w, d, z, fill, op = 1, key) => {
  const p = [iso(gx,gy,z), iso(gx+w,gy,z), iso(gx+w,gy+d,z), iso(gx,gy+d,z)];
  return <path key={key} d={'M'+p.map(q=>q[0].toFixed(2)+' '+q[1].toFixed(2)).join(' L ')+' Z'} fill={fill} opacity={op} />;
};
// gold trace polyline through grid pts at height z
const trace = (iso, pts, z, stroke, w, op = 1, key) =>
  <path key={key} d={'M'+pts.map(p=>{const q=iso(p[0],p[1],z);return q[0].toFixed(2)+' '+q[1].toFixed(2);}).join(' L ')}
    stroke={stroke} strokeWidth={w} opacity={op} fill="none" strokeLinecap="round" strokeLinejoin="round" />;

// "Datacore" — building on a circuit-board (PCB) base.
function MarkDatacore({ size = 260 }) {
  const w = size, h = size * 248 / 260;
  return (
    <svg width={w} height={h} viewBox="0 0 260 248" fill="none"
      style={{ display: 'block', flex: '0 0 auto', width: w, height: h }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="dc-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="dc-proc" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#C9FBEC" /><stop offset="0.4" stopColor="#5FE0C8" />
          <stop offset="1" stopColor="#2C7E6E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <DatacoreScene />
    </svg>
  );
}

function DatacoreScene() {
  const iso = makeIso(18, 130, 70);
  const cream  = { top: DH.creamT, left: DH.creamL, right: DH.creamR };
  const pcb    = { top: '#445C46', left: '#33462F', right: '#283A28' };   // board
  const gold   = '#C2A053', goldL = '#E0C684', blue = '#3E86F2', cyan = '#5FE0C8';
  const chip   = { top: '#222B33', left: '#161D24', right: '#0E141A' };
  const pad    = '#C9AB63';
  const zT = 0.32;   // PCB top height (building sits here)

  // building front plane y = 3.4; PCB extends beyond on all sides
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx="130" cy={iso(2.3,2.3,0)[1] + 4} rx="118" ry="32" fill="#2E3A2E" opacity="0.12" />

      {/* cream rim plinth (slightly larger, lower) */}
      <Box iso={iso} g={[-0.9,-0.9,0]} d={[5.9,5.1,0.18]} mat={cream} />
      {/* green PCB board on top */}
      <Box iso={iso} g={[-0.75,-0.75,0.18]} d={[5.6,4.85,0.14]} mat={pcb} />

      {/* ===== PCB surface art (behind building) ===== */}
      <g>
        {/* faint grid pads near back corners */}
        {[[-0.5,-0.5],[4.4,-0.5],[-0.5,3.9]].map((p,i)=>flatQuad(iso,p[0],p[1],0.12,0.12,zT,pad,0.5,'bp'+i))}
        {/* a couple of back traces */}
        {trace(iso,[[-0.3,-0.3],[1.5,-0.3],[1.5,0.4]],zT,gold,0.9,0.55,'bt1')}
      </g>

      {/* ===== building ===== */}
      <BuildingVolumes iso={iso} Z0={zT} glow={true} />

      {/* ===== PCB surface art (front / right, in front of building) ===== */}
      <g>
        {/* gold traces fanning across the front + toward the right processor */}
        {trace(iso,[[1.1,3.45],[1.1,3.95],[2.7,3.95]],zT,gold,1.0,0.65,'t1')}
        {trace(iso,[[0.5,3.45],[0.5,4.45],[2.6,4.45]],zT,goldL,0.9,0.5,'t3')}
        {trace(iso,[[3.0,3.45],[3.0,3.7],[4.0,3.7]],zT,gold,1.0,0.6,'t2')}
        {trace(iso,[[4.05,1.4],[4.7,1.4],[4.7,2.9]],zT,gold,1.0,0.55,'t4')}
        {trace(iso,[[4.05,3.0],[4.45,3.0],[4.45,2.7]],zT,goldL,0.9,0.5,'t5')}
        {/* glowing data trace from building to the processor */}
        {trace(iso,[[3.0,3.45],[3.0,4.1],[4.55,4.1],[4.55,2.75]],zT,cyan,1.3,0.92,'tc')}

        {/* SMD chips on the front band */}
        {[[1.35,4.15],[2.35,4.3]].map((c,i)=>(
          <g key={'chip'+i}>
            <Box iso={iso} g={[c[0],c[1],zT]} d={[0.42,0.3,0.12]} mat={chip} />
            {[0,1,2].map(k=> seg(iso,[c[0]-0.06,c[1]+0.06+k*0.09,zT+0.06],[c[0],c[1]+0.06+k*0.09,zT+0.06], gold,0.8,0.8,'pin'+i+k))}
          </g>
        ))}
        {/* DIP-style chip with leg rows (front-left long) */}
        <Box iso={iso} g={[0.1,4.5,zT]} d={[1.5,0.22,0.1]} mat={chip} />
        {[...Array(7)].map((_,k)=> seg(iso,[0.2+k*0.2,4.5,zT+0.05],[0.2+k*0.2,4.45,zT+0.05], gold,0.8,0.7,'leg'+k))}
        {/* small chip on the right band */}
        <Box iso={iso} g={[4.3,1.25,zT]} d={[0.4,0.34,0.12]} mat={chip} />

        {/* via holes along edges */}
        {[...Array(6)].map((_,k)=> flatQuad(iso, -0.55, 0.0+k*0.55, 0.1,0.1, zT, '#1A2418', 0.85, 'via'+k))}
        {[...Array(4)].map((_,k)=> flatQuad(iso, 0.3+k*0.7, 4.78, 0.1,0.1, zT, '#1A2418', 0.8, 'viaf'+k))}

        {/* ===== glowing processor (front-right, open board) ===== */}
        <Box iso={iso} g={[4.18,2.3,zT]} d={[0.64,0.58,0.16]} mat={{top:'#2B3640',left:'#1A232B',right:'#10171D'}} />
        {/* gold pad ring */}
        {flatQuad(iso,4.23,2.35,0.54,0.48,zT+0.16,gold,0.5,'procpad')}
        {/* glow halo */}
        {(()=>{const c=iso(4.5,2.59,zT+0.16);return <circle cx={c[0]} cy={c[1]} r="15" fill="url(#dc-proc)" />;})()}
        {/* glowing die */}
        {flatQuad(iso,4.34,2.44,0.3,0.26,zT+0.17,cyan,0.95,'die')}
        {(()=>{const c=iso(4.5,2.58,zT+0.17);return <circle cx={c[0]} cy={c[1]} r="2.8" fill="#EAFFF8" filter="url(#dc-glow)" />;})()}
      </g>
    </g>
  );
}

// ---- lockups ----
function Wordmark5({ fs = 56, ink = DH.navyInk, accent = DH.accent }) {
  return (
    <span style={{ fontFamily: "'Geist', system-ui, sans-serif", fontWeight: 600, fontSize: fs,
      letterSpacing: '-0.018em', lineHeight: 1 }}>
      <span style={{ color: ink }}>proplytic</span><span style={{ color: accent }}>.ai</span>
    </span>
  );
}

function StackedLockup5({ size = 240, fs = 60, tagline = 'IMMOBILIEN BEWERTEN. BESSER ENTSCHEIDEN.' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <MarkDatahaus size={size} />
      <Wordmark5 fs={fs} />
      {/* divider with mini bar-chart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: size * 1.7, marginTop: 6 }}>
        <span style={{ flex: 1, height: 1.5, background: DH.accent, opacity: 0.6 }} />
        <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
          <span style={{ width: 4, height: 6, background: DH.sageL }} />
          <span style={{ width: 4, height: 10, background: DH.navyInk }} />
          <span style={{ width: 4, height: 14, background: DH.navyInk }} />
        </span>
        <span style={{ flex: 1, height: 1.5, background: DH.navyInk, opacity: 0.6 }} />
      </div>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: fs * 0.155, fontWeight: 500,
        letterSpacing: '.2em', color: DH.navyInk, marginTop: 6, whiteSpace: 'nowrap' }}>{tagline}</div>
    </div>
  );
}

Object.assign(window, { MarkDatahaus, MarkDatacore, DatahausScene, DatacoreScene, BuildingVolumes, Wordmark5, StackedLockup5, DHPAL: DH, GLPAL: GL, makeIso });
