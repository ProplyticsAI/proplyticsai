// direction-kontor.jsx — Direction 1: luxe editorial.
// Bodoni Moda (didone) headlines + Hanken Grotesk body. Royal blue as
// restrained ink accent. Exports DirectionKontor to window.

function DirectionKontor() {
  const serif = "'Bodoni Moda', Georgia, serif";
  const sans = "'Hanken Grotesk', system-ui, sans-serif";
  const W = 1180; // inner content width

  const wrap = { maxWidth: W, margin: '0 auto', padding: '0 80px', boxSizing: 'border-box' };

  return (
    <div style={{ width: '100%', background: PAL.cream, color: PAL.ink, fontFamily: sans,
      fontSize: 16, lineHeight: 1.6, WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        .k-a{color:${PAL.blue};text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}
        .k-a:hover{border-color:${PAL.blue}}
        .k-navlink{color:${PAL.ink2};text-decoration:none;font-size:14.5px;font-weight:500;letter-spacing:.01em;transition:color .2s}
        .k-navlink:hover{color:${PAL.blue}}
        .k-btn-p{background:${PAL.green};color:#fff;border:none;border-radius:9px;font-family:${sans};
          font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:transform .15s,box-shadow .2s;letter-spacing:.01em}
        .k-btn-p:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px ${PAL.green}}
        .k-btn-g{background:transparent;color:${PAL.ink};border:1px solid ${PAL.border};border-radius:9px;
          font-family:${sans};font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:border-color .2s,color .2s}
        .k-btn-g:hover{border-color:${PAL.blue};color:${PAL.blue}}
        .k-method{padding-top:26px;border-top:1px solid ${PAL.ink};transition:border-color .25s}
        .k-method:hover{border-color:${PAL.blue}}
        .k-method:hover .k-mnum{color:${PAL.blue}}
        .k-eyebrow{font-family:${sans};font-size:12.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:${PAL.blue}}
      `}</style>

      {/* NAV */}
      <div style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <PinMark size={26} />
            <span style={{ fontFamily: serif, fontSize: 23, fontWeight: 600, letterSpacing: '.01em' }}>{C.brand}</span>
          </div>
          <div style={{ display: 'flex', gap: 34 }}>
            {C.nav.map((n) => <a key={n} href="#" className="k-navlink">{n}</a>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <a href="#" className="k-navlink">Anmelden</a>
            <button className="k-btn-p" style={{ padding: '10px 20px' }}>{C.ctaPrimary}</button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ ...wrap, paddingTop: 96, paddingBottom: 80, textAlign: 'center' }}>
        <div className="k-eyebrow" style={{ marginBottom: 28 }}>{C.badge}</div>
        <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: 86, lineHeight: 1.02, letterSpacing: '-0.018em',
          margin: '0 auto', maxWidth: 900, textWrap: 'balance' }}>
          {C.h1a}<br />
          <span style={{ fontStyle: 'italic', position: 'relative', whiteSpace: 'nowrap' }}>
            {C.h1b}
            <span style={{ position: 'absolute', left: '5%', right: '5%', bottom: 12, height: 3, borderRadius: 2, background: PAL.blue, opacity: .9 }} />
          </span>
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.65, color: PAL.ink2, maxWidth: 620, margin: '30px auto 0', textWrap: 'pretty' }}>{C.sub}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 38 }}>
          <button className="k-btn-p">{C.ctaPrimary}</button>
          <button className="k-btn-g">{C.ctaSecondary}</button>
        </div>
        <div style={{ fontFamily: sans, fontSize: 13.5, color: PAL.muted, marginTop: 22, letterSpacing: '.01em' }}>{C.micro}</div>
      </div>

      {/* HERO VISUAL */}
      <div style={{ ...wrap, paddingBottom: 96 }}>
        <Placeholder label="Bewertungsbericht — Screenshot" label2="1180 × 560 · Produkt-UI" height={560} radius={14}
          style={{ boxShadow: '0 40px 90px -50px rgba(26,32,90,.45)' }} />
      </div>

      {/* TRUST */}
      <div style={{ ...wrap, paddingBottom: 90 }}>
        <div style={{ textAlign: 'center', fontFamily: sans, fontSize: 12.5, fontWeight: 600, letterSpacing: '.2em',
          textTransform: 'uppercase', color: PAL.muted, marginBottom: 30 }}>{C.trustLabel}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 26 }}>
          {['Sparkasse', 'VR Bank', 'Engel & V.', 'JLL', 'Sprengnetter'].map((l) => (
            <div key={l} style={{ flex: 1, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: serif, fontSize: 20, fontWeight: 500, color: '#B6B2AA', letterSpacing: '.02em' }}>{l}</div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}`, background: PAL.card }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '54px 80px' }}>
          {C.stats.map((s, i) => (
            <div key={s.l} style={{ padding: '0 30px', borderLeft: i ? `1px solid ${PAL.border}` : 'none', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em',
                color: i === 1 ? PAL.blue : PAL.ink }}>{s.n}</div>
              <div style={{ fontFamily: sans, fontSize: 14.5, color: PAL.muted, marginTop: 12 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* METHODS */}
      <div style={{ ...wrap, paddingTop: 110, paddingBottom: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 60 }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>{C.methodsTitle}</h2>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: PAL.ink2, margin: 0, textWrap: 'pretty' }}>{C.methodsLede}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
          {C.methods.map((m) => (
            <div key={m.k} className="k-method">
              <div className="k-mnum" style={{ fontFamily: serif, fontSize: 26, fontStyle: 'italic', color: PAL.muted, transition: 'color .25s' }}>{m.k}</div>
              <h3 style={{ fontFamily: serif, fontSize: 27, fontWeight: 500, letterSpacing: '-0.01em', margin: '18px 0 12px' }}>{m.t}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.62, color: PAL.ink2, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MARKET DATA SPLIT */}
      <div style={{ ...wrap, paddingTop: 110, paddingBottom: 110 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="k-eyebrow" style={{ marginBottom: 22 }}>Marktdaten</div>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 50, lineHeight: 1.06, letterSpacing: '-0.02em', margin: '0 0 22px' }}>{C.mapTitle}</h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.62, color: PAL.ink2, margin: '0 0 30px', textWrap: 'pretty' }}>{C.mapLede}</p>
            <div style={{ display: 'grid', gap: 16 }}>
              {C.mapBullets.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 16, color: PAL.ink }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: PAL.blue, flex: '0 0 auto' }} />
                  {b}
                </div>
              ))}
            </div>
          </div>
          <Placeholder label="Lagekarte" label2="Bodenrichtwerte · Mietspiegel" height={420} radius={14} tint="#CFD3E6" />
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: PAL.card, borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 100, paddingBottom: 100 }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 50, letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 64px' }}>{C.stepsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 50 }}>
            {C.steps.map((s) => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${PAL.blue}`, color: PAL.blue,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  fontFamily: serif, fontSize: 24, fontStyle: 'italic' }}>{s.n}</div>
                <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, margin: '0 0 12px' }}>{s.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: PAL.ink2, margin: '0 auto', maxWidth: 270 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div style={{ ...wrap, paddingTop: 110, paddingBottom: 110, textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 60, lineHeight: 1.06, letterSpacing: '-0.02em', margin: '0 auto', maxWidth: 760, textWrap: 'balance' }}>{C.ctaBandTitle}</h2>
        <p style={{ fontSize: 18, color: PAL.ink2, margin: '24px auto 0', maxWidth: 520 }}>{C.ctaBandSub}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36 }}>
          <button className="k-btn-p">{C.ctaPrimary}</button>
          <button className="k-btn-g">{C.ctaSecondary}</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${PAL.border}`, background: PAL.cream }}>
        <div style={{ ...wrap, paddingTop: 64, paddingBottom: 40, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <PinMark size={24} />
              <span style={{ fontFamily: serif, fontSize: 21, fontWeight: 600 }}>{C.brand}</span>
            </div>
            <p style={{ fontSize: 14.5, color: PAL.muted, margin: 0, maxWidth: 240, lineHeight: 1.6 }}>KI-gestützte Immobilienbewertung nach ImmoWertV 2024.</p>
          </div>
          {C.footerCols.map((col) => (
            <div key={col.h}>
              <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PAL.ink, marginBottom: 18 }}>{col.h}</div>
              <div style={{ display: 'grid', gap: 11 }}>
                {col.items.map((it) => <a key={it} href="#" className="k-navlink" style={{ fontSize: 14.5 }}>{it}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...wrap, paddingTop: 22, paddingBottom: 40 }}>
          <div style={{ borderTop: `1px solid ${PAL.border}`, paddingTop: 22, fontSize: 13.5, color: PAL.muted }}>{C.footerNote}</div>
        </div>
      </div>
    </div>
  );
}

window.DirectionKontor = DirectionKontor;
