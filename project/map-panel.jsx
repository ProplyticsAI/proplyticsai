// map-panel.jsx — designed cadastral "Lagekarte" panel for the market section.
// Replaces the striped placeholder so the page reads as a real product.
// Props: { accent, serif, label }  Exports MapPanel to window.

function MapPanel({ accent = '#3050C8', serif = "'Bodoni Moda', Georgia, serif",
  label = "'Geist Mono', ui-monospace, monospace" }) {
  const Lbl = ({ children, color = PAL.muted, style = {} }) => (
    <span style={{ fontFamily: label, fontSize: 10.5, fontWeight: 500, letterSpacing: '.16em',
      textTransform: 'uppercase', color, ...style }}>{children}</span>
  );

  // soil-value heat tiles (Bodenrichtwert) — muted greens → accent
  const tiles = [
    ['#EDEBE4', '#E4ECE6', '#D9E6DD', '#CFE0D4'],
    ['#E4ECE6', '#D9E6DD', '#C3D6C8', '#B3CDBC'],
    ['#D9E6DD', '#C8D9CD', `color-mix(in srgb, ${accent} 16%, #fff)`, `color-mix(in srgb, ${accent} 26%, #fff)`],
    ['#E9ECE6', '#D9E6DD', '#C8D9CD', '#BBD0C2'],
  ];

  return (
    <div style={{ width: '100%', background: PAL.card, border: `1px solid ${PAL.border}`,
      borderRadius: 14, overflow: 'hidden', fontVariantNumeric: 'tabular-nums',
      boxShadow: '0 40px 90px -58px rgba(26,26,26,.4)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: `1px solid ${PAL.border}`, background: PAL.cream }}>
        <Lbl>Lagekarte — Frankfurt 60311</Lbl>
        <Lbl color={accent}>Bodenrichtwert €/m²</Lbl>
      </div>

      {/* map body */}
      <div style={{ position: 'relative', height: 300, background: PAL.cream2 }}>
        {/* heat tiles */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(4,1fr)' }}>
          {tiles.flat().map((c, i) => (
            <div key={i} style={{ background: c, borderRight: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}`, opacity: 0.92 }} />
          ))}
        </div>
        {/* streets */}
        <svg width="100%" height="100%" viewBox="0 0 480 300" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0 }}>
          <path d="M-10 96 L490 70" stroke="#fff" strokeWidth="9" opacity="0.7" />
          <path d="M-10 210 L490 184" stroke="#fff" strokeWidth="7" opacity="0.7" />
          <path d="M150 -10 L120 310" stroke="#fff" strokeWidth="8" opacity="0.7" />
          <path d="M330 -10 L312 310" stroke="#fff" strokeWidth="6" opacity="0.7" />
          {/* subject parcel outline */}
          <rect x="246" y="150" width="64" height="44" fill="none" stroke={accent} strokeWidth="2" />
        </svg>
        {/* located pin */}
        <div style={{ position: 'absolute', left: 'calc(57.5% - 7px)', top: 'calc(57% - 7px)' }}>
          <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', background: accent,
            border: '2.5px solid #fff', boxShadow: '0 3px 10px -2px rgba(0,0,0,.4)' }} />
        </div>
        {/* value chip on parcel */}
        <div style={{ position: 'absolute', left: '62%', top: 'calc(57% - 36px)', background: '#fff',
          border: `1px solid ${PAL.border}`, borderRadius: 6, padding: '4px 9px', boxShadow: '0 6px 18px -8px rgba(0,0,0,.35)' }}>
          <span style={{ fontFamily: serif, fontSize: 14, fontWeight: 600 }}>1.480&nbsp;€</span>
        </div>
        {/* legend */}
        <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: `1px solid ${PAL.border}`, borderRadius: 6, padding: '6px 9px' }}>
          <Lbl style={{ fontSize: 9.5 }}>900</Lbl>
          <span style={{ width: 78, height: 6, borderRadius: 3,
            background: `linear-gradient(90deg, #E4ECE6, ${accent})` }} />
          <Lbl style={{ fontSize: 9.5 }}>1900</Lbl>
        </div>
      </div>

      {/* footer facts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: `1px solid ${PAL.border}` }}>
        {[['Mietspiegel', '14,20 €/m²'], ['Ø Kaufpreis', '5.340 €/m²'], ['Lagefaktor', '1,42']].map(([k, v], i) => (
          <div key={k} style={{ padding: '16px 18px', borderRight: i < 2 ? `1px solid ${PAL.border}` : 'none' }}>
            <Lbl>{k}</Lbl>
            <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, marginTop: 6, letterSpacing: '-0.01em' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.MapPanel = MapPanel;
