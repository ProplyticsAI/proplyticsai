// kontor-report.jsx — A designed product artifact: the Proplytics valuation
// report card. Replaces the striped placeholder in the hero so the page reads
// as a real product, not a template. Brand palette from landing-shared (PAL).
// Props: { accent, serif, sans, label }  Exports ReportCard to window.

function ReportCard({ accent = '#3050C8', serif = "'Bodoni Moda', Georgia, serif",
  sans = "'Geist', system-ui, sans-serif", label = "'Geist Mono', ui-monospace, monospace" }) {

  const Lbl = ({ children, color = PAL.muted, style = {} }) => (
    <span style={{ fontFamily: label, fontSize: 10.5, fontWeight: 500, letterSpacing: '.16em',
      textTransform: 'uppercase', color, ...style }}>{children}</span>
  );

  const methods = [
    { k: '01', t: 'Ertragswert', v: '612.000', pct: 0.62 },
    { k: '02', t: 'Sachwert', v: '648.500', pct: 0.70 },
    { k: '03', t: 'Vergleichswert', v: '631.000', pct: 0.66, lead: true },
  ];
  const facts = [
    ['Wohnfläche', '124 m²'],
    ['Baujahr', '1998'],
    ['Preis je m²', '5.090 €'],
    ['Lagefaktor', '1,42'],
  ];

  return (
    <div style={{ width: '100%', background: PAL.card, border: `1px solid ${PAL.border}`,
      borderRadius: 14, overflow: 'hidden', fontFamily: sans, color: PAL.ink,
      fontVariantNumeric: 'tabular-nums', boxShadow: '0 44px 100px -55px rgba(26,26,26,.45)' }}>

      {/* window/system bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 44, padding: '0 18px', borderBottom: `1px solid ${PAL.border}`, background: PAL.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', gap: 6 }}>
            {['#D9D6CF', '#D9D6CF', '#D9D6CF'].map((c, i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </span>
          <Lbl style={{ marginLeft: 6 }}>Bewertungsbericht — Musterstraße 14, 60311 Frankfurt</Lbl>
        </div>
        <span style={{ fontFamily: label, fontSize: 10, fontWeight: 500, letterSpacing: '.12em',
          textTransform: 'uppercase', color: accent, border: `1px solid ${accent}`, borderRadius: 5,
          padding: '4px 8px' }}>ImmoWertV 2024</span>
      </div>

      {/* body: two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr' }}>

        {/* LEFT — market value + range + methods */}
        <div style={{ padding: '30px 30px 30px', borderRight: `1px solid ${PAL.border}` }}>
          <Lbl>Ermittelter Marktwert</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '12px 0 4px' }}>
            <span style={{ fontFamily: serif, fontSize: 58, fontWeight: 500, lineHeight: 0.95,
              letterSpacing: '-0.02em' }}>635.000&nbsp;€</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lbl color={PAL.muted}>Spanne</Lbl>
            <span style={{ fontSize: 13.5, color: PAL.ink2 }}>608.000 – 661.000 €</span>
            <span style={{ fontFamily: label, fontSize: 11, color: '#2D5A3D', background: '#EAF1ED',
              borderRadius: 4, padding: '3px 7px', letterSpacing: '.04em' }}>± 2,8 %</span>
          </div>

          {/* range bar */}
          <div style={{ position: 'relative', height: 8, borderRadius: 4, background: PAL.cream2,
            border: `1px solid ${PAL.border}`, margin: '22px 0 30px' }}>
            <div style={{ position: 'absolute', left: '14%', right: '18%', top: 0, bottom: 0,
              borderRadius: 4, background: `color-mix(in srgb, ${accent} 18%, #fff)` }} />
            <div style={{ position: 'absolute', left: '52%', top: -4, width: 3, height: 16,
              borderRadius: 2, background: accent }} />
          </div>

          {/* method rows */}
          <div style={{ display: 'grid', gap: 0 }}>
            {methods.map((m, i) => (
              <div key={m.k} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 96px',
                alignItems: 'center', gap: 14, padding: '13px 0',
                borderTop: `1px solid ${PAL.border}`,
                borderBottom: i === methods.length - 1 ? `1px solid ${PAL.border}` : 'none' }}>
                <Lbl color={m.lead ? accent : PAL.muted}>{m.k}</Lbl>
                <div>
                  <div style={{ fontSize: 14, fontWeight: m.lead ? 600 : 500,
                    color: m.lead ? PAL.ink : PAL.ink2, marginBottom: 7 }}>
                    {m.t}{m.lead && <span style={{ fontFamily: label, fontSize: 9.5, color: accent,
                      letterSpacing: '.12em', marginLeft: 9 }}>MASSGEBLICH</span>}
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: PAL.cream2 }}>
                    <div style={{ width: `${m.pct * 100}%`, height: '100%', borderRadius: 2,
                      background: m.lead ? accent : '#C7C4BD' }} />
                  </div>
                </div>
                <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, textAlign: 'right',
                  color: m.lead ? PAL.ink : PAL.ink2 }}>{m.v}&nbsp;€</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — parcel map + facts */}
        <div style={{ padding: '0' }}>
          {/* stylized parcel map */}
          <div style={{ position: 'relative', height: 168, overflow: 'hidden',
            borderBottom: `1px solid ${PAL.border}`, background: PAL.cream2 }}>
            <svg width="100%" height="100%" viewBox="0 0 360 168" preserveAspectRatio="xMidYMid slice"
              style={{ display: 'block' }}>
              <defs>
                <pattern id="rp-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M30 0 L0 0 0 30" fill="none" stroke={PAL.border} strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="360" height="168" fill="url(#rp-grid)" />
              {/* roads */}
              <path d="M-10 60 L370 96" stroke="#DAD7D0" strokeWidth="10" fill="none" />
              <path d="M150 -10 L120 178" stroke="#DAD7D0" strokeWidth="8" fill="none" />
              {/* neighbouring parcels */}
              {[[40,30],[210,28],[250,110],[60,118]].map(([x,y],i)=>(
                <rect key={i} x={x} y={y} width="46" height="30" rx="2" fill="#E7E4DD" stroke={PAL.border} strokeWidth="1" />
              ))}
              {/* subject parcel */}
              <rect x="150" y="64" width="56" height="40" rx="2"
                fill={`color-mix(in srgb, ${accent} 14%, #fff)`} stroke={accent} strokeWidth="1.6" />
              {/* pin node */}
              <rect x="171" y="76" width="14" height="14" rx="3" fill={accent} />
              <rect x="175" y="80" width="6" height="6" rx="1.5" fill="#fff" />
            </svg>
            <span style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: label, fontSize: 10,
              letterSpacing: '.14em', textTransform: 'uppercase', color: PAL.muted, background: '#fff',
              padding: '4px 8px', borderRadius: 4, border: `1px solid ${PAL.border}` }}>Mikrolage · Bodenrichtwert</span>
          </div>

          {/* facts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {facts.map(([k, v], i) => (
              <div key={k} style={{ padding: '16px 22px',
                borderRight: i % 2 === 0 ? `1px solid ${PAL.border}` : 'none',
                borderBottom: i < 2 ? `1px solid ${PAL.border}` : 'none' }}>
                <Lbl>{k}</Lbl>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, marginTop: 6,
                  letterSpacing: '-0.01em' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ReportCard = ReportCard;
