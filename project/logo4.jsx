// logo4.jsx — "Nexus" emblem for proplytic.ai.
// Fuses the user's futuristic reference (chrome crest, tower cluster, blue
// circuit traces, glowing located node) with the brand's location-pin idea.
// The crest tapers to a pin point at the bottom carrying the data node.
// viewBox 0 0 200 224. Mark: { size }.  Exports to window.

function MarkNexus({ size = 200 }) {
  const px = size, py = size * 224 / 200;
  return (
    <svg width={px} height={py} viewBox="0 0 200 224" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <defs>
        <linearGradient id="nx-sv" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#EEF2F7" /><stop offset="0.45" stopColor="#B7BFCB" />
          <stop offset="0.56" stopColor="#959FAE" /><stop offset="1" stopColor="#626C7C" />
        </linearGradient>
        <linearGradient id="nx-svh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F7FA" /><stop offset="1" stopColor="#8A94A3" />
        </linearGradient>
        <linearGradient id="nx-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#27374F" /><stop offset="1" stopColor="#0B111D" />
        </linearGradient>
        <linearGradient id="nx-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141C2C" /><stop offset="1" stopColor="#080C15" />
        </linearGradient>
        <linearGradient id="nx-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D2DAE4" /><stop offset="1" stopColor="#7A8493" />
        </linearGradient>
        <linearGradient id="nx-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9CC4FF" stopOpacity="0" /><stop offset="1" stopColor="#5B8DFF" />
        </linearGradient>
        <radialGradient id="nx-node" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E8F2FF" /><stop offset="0.35" stopColor="#7FB0FF" />
          <stop offset="1" stopColor="#2E6BFF" stopOpacity="0" />
        </radialGradient>
        <filter id="nx-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.1" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nx-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ambient base glow */}
      <ellipse cx="100" cy="200" rx="46" ry="16" fill="#2E6BFF" opacity="0.18" filter="url(#nx-soft)" />

      {/* ---- circuit traces, lower fan (behind frame) ---- */}
      <g stroke="#2E6BFF" strokeWidth="1.6" fill="none" filter="url(#nx-glow)" strokeLinecap="round">
        {/* left */}
        <path d="M100 198 L70 198 L60 188 L30 188" />
        <path d="M78 204 L52 204 L44 196 L18 196" opacity="0.8" />
        <path d="M64 192 L46 174" opacity="0.7" />
        {/* right (mirror) */}
        <path d="M100 198 L130 198 L140 188 L170 188" />
        <path d="M122 204 L148 204 L156 196 L182 196" opacity="0.8" />
        <path d="M136 192 L154 174" opacity="0.7" />
      </g>
      <g fill="#7FB0FF" filter="url(#nx-glow)">
        {[[30,188],[18,196],[46,174],[170,188],[182,196],[154,174]].map((p,i)=>(
          <circle key={i} cx={p[0]} cy={p[1]} r="2.4" />
        ))}
      </g>
      {/* chips */}
      <g stroke="#9AA4B2" strokeWidth="1" fill="#1A2230">
        <rect x="40" y="166" width="9" height="9" rx="1.2" />
        <rect x="151" y="166" width="9" height="9" rx="1.2" />
        <g stroke="#9AA4B2" strokeWidth="0.8">
          <path d="M40 169 l-2 0 M40 172 l-2 0 M49 169 l2 0 M49 172 l2 0" />
          <path d="M151 169 l-2 0 M151 172 l-2 0 M160 169 l2 0 M160 172 l2 0" />
        </g>
      </g>

      {/* ---- silver crest frame (open at top where tower exits) ---- */}
      <path d="M82 40 L34 74 L52 152 L100 206 L148 152 L166 74 L118 40"
        fill="none" stroke="url(#nx-sv)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M84 48 L42 78 L59 150 L100 198 L141 150 L158 78 L116 48"
        fill="none" stroke="#566070" strokeWidth="1.4" strokeLinejoin="round" opacity="0.5" />

      {/* ===== building cluster ===== */}
      {/* central tall tower (back) */}
      <Prism x={86} y={34} w={30} h={120} off={[11,-7]} front="url(#nx-front)" side="url(#nx-side)" top="url(#nx-top)" mull={4} />
      {/* left tower */}
      <Prism x={56} y={80} w={26} h={76} off={[10,-6]} front="url(#nx-front)" side="url(#nx-side)" top="url(#nx-top)" mull={3} />
      {/* right tower */}
      <Prism x={122} y={72} w={22} h={84} off={[10,-6]} front="url(#nx-side)" side="url(#nx-side)" top="url(#nx-top)" mull={4} />
      {/* front center block */}
      <Prism x={82} y={118} w={22} h={40} off={[9,-5]} front="url(#nx-front)" side="url(#nx-side)" top="url(#nx-top)" mull={3} />
      {/* front left low block */}
      <Prism x={64} y={128} w={14} h={30} off={[8,-5]} front="url(#nx-front)" side="url(#nx-side)" top="url(#nx-top)" mull={2} />

      {/* blue circuit traces on central tower */}
      <g stroke="#3E78FF" strokeWidth="1.5" fill="none" filter="url(#nx-glow)" strokeLinecap="round">
        <path d="M96 42 L96 96 L101 101 L101 150" />
        <path d="M104 46 L104 120" opacity="0.8" />
        <path d="M100 60 L100 92" opacity="0.6" />
        <path d="M108 70 L108 96 L104 100" opacity="0.6" />
      </g>
      {/* lit windows on towers */}
      <g fill="#5B8DFF" filter="url(#nx-glow)">
        {[0,1,2,3,4].map(i=>(<rect key={'r'+i} x={129} y={92+i*11} width="9" height="3" rx="1" opacity="0.92" />))}
        {[0,1,2,3].map(i=>(<rect key={'l'+i} x={61} y={98+i*12} width="8" height="3" rx="1" opacity="0.85" />))}
      </g>

      {/* central light beam down to pin node */}
      <rect x="98.4" y="150" width="3.2" height="50" fill="url(#nx-beam)" filter="url(#nx-glow)" />
      {/* emergence star */}
      <circle cx="100" cy="150" r="3.4" fill="#DCEBFF" filter="url(#nx-glow)" />
      {/* located node at pin tip */}
      <circle cx="100" cy="200" r="14" fill="url(#nx-node)" />
      <circle cx="100" cy="200" r="5" fill="#EAF3FF" filter="url(#nx-glow)" />
      <circle cx="100" cy="200" r="2.4" fill="#2E6BFF" />
    </svg>
  );
}

// front-lower-left isometric prism: front rect + right side + top.
function Prism({ x, y, w, h, off = [11, -7], front, side, top, edge = '#aab3c0', mull = 0 }) {
  const ox = off[0], oy = off[1];
  const topPath = `M${x} ${y} L${x + w} ${y} L${x + w + ox} ${y + oy} L${x + ox} ${y + oy} Z`;
  const sidePath = `M${x + w} ${y} L${x + w + ox} ${y + oy} L${x + w + ox} ${y + h + oy} L${x + w} ${y + h} Z`;
  const frontPath = `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
  const mulls = [];
  for (let i = 1; i < mull; i++) {
    const mx = x + (w * i) / mull;
    mulls.push(<path key={i} d={`M${mx} ${y + 2} L${mx} ${y + h}`} stroke="#0A0E18" strokeWidth="1" opacity="0.55" />);
    mulls.push(<path key={'h' + i} d={`M${mx + 0.6} ${y + 2} L${mx + 0.6} ${y + h}`} stroke="#3D5176" strokeWidth="0.5" opacity="0.5" />);
  }
  return (
    <g>
      <path d={sidePath} fill={side} />
      <path d={frontPath} fill={front} />
      {mulls}
      <path d={topPath} fill={top} />
      {/* silver edge highlights */}
      <path d={`M${x} ${y} L${x} ${y + h}`} stroke="url(#nx-svh)" strokeWidth="1.6" opacity="0.9" />
      <path d={`M${x} ${y} L${x + w} ${y}`} stroke="url(#nx-svh)" strokeWidth="1.4" opacity="0.8" />
      <path d={`M${x + w} ${y} L${x + w + ox} ${y + oy}`} stroke="url(#nx-svh)" strokeWidth="1.2" opacity="0.7" />
      <path d={`M${x + w} ${y} L${x + w} ${y + h}`} stroke="#0A0E18" strokeWidth="1" opacity="0.6" />
    </g>
  );
}

function WordmarkNexus({ size = 200, gap = 18, ink = '#EAEEF3', accent = '#5B8DFF',
  serif = "'Bodoni Moda', Georgia, serif", fontSize }) {
  const fs = fontSize || size * 0.34;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <MarkNexus size={size} />
      <span style={{ fontFamily: serif, fontSize: fs, fontWeight: 600, letterSpacing: '.005em', lineHeight: 1 }}>
        <span style={{ color: ink }}>proplytic</span><span style={{ color: accent }}>.ai</span>
      </span>
    </span>
  );
}

Object.assign(window, { MarkNexus, WordmarkNexus });
