// direction-atlas.jsx — Direction 2: confident fintech.
// Space Grotesk headlines + Hanken Grotesk body. Royal blue as a bold
// co-accent: blue primary CTA, blue stat tile, blue badges, deep-blue band.
// Exports DirectionAtlas to window.

function DirectionAtlas() {
  const head = "'Space Grotesk', system-ui, sans-serif";
  const sans = "'Hanken Grotesk', system-ui, sans-serif";
  const W = 1200;
  const wrap = { maxWidth: W, margin: '0 auto', padding: '0 80px', boxSizing: 'border-box' };
  const chip = { display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: sans, fontSize: 12,
    fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: PAL.blue,
    background: PAL.blueLt, padding: '7px 13px', borderRadius: 6 };

  return (
    <div style={{ width: '100%', background: PAL.cream, color: PAL.ink, fontFamily: sans,
      fontSize: 16, lineHeight: 1.6, WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        .a-navlink{color:${PAL.ink2};text-decoration:none;font-size:14.5px;font-weight:600;transition:color .2s}
        .a-navlink:hover{color:${PAL.blue}}
        .a-btn-p{background:${PAL.blue};color:#fff;border:none;border-radius:10px;font-family:${sans};
          font-weight:700;font-size:15px;padding:13px 24px;cursor:pointer;transition:transform .15s,box-shadow .2s}
        .a-btn-p:hover{transform:translateY(-1px);box-shadow:0 12px 26px -10px ${PAL.blue}}
        .a-btn-g{background:#fff;color:${PAL.ink};border:1px solid ${PAL.border};border-radius:10px;
          font-family:${sans};font-weight:700;font-size:15px;padding:13px 24px;cursor:pointer;transition:border-color .2s,color .2s}
        .a-btn-g:hover{border-color:${PAL.blue};color:${PAL.blue}}
        .a-card{background:#fff;border:1px solid ${PAL.border};border-radius:16px;transition:transform .18s,box-shadow .22s,border-color .22s}
        .a-card:hover{transform:translateY(-3px);box-shadow:0 22px 48px -28px rgba(26,32,90,.4);border-color:#D6D9EC}
        .a-step:hover .a-badge{background:${PAL.blue};color:#fff}
      `}</style>

      {/* NAV */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(245,243,239,.82)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${PAL.border}`, zIndex: 5 }}>
        <div style={{ ...wrap, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PinMark size={26} color={PAL.blue} />
              <span style={{ fontFamily: head, fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em' }}>{C.brand}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>{C.nav.map((n) => <a key={n} href="#" className="a-navlink">{n}</a>)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="#" className="a-navlink">Anmelden</a>
            <button className="a-btn-p" style={{ padding: '10px 20px' }}>{C.ctaPrimary}</button>
          </div>
        </div>
      </div>

      {/* HERO — split */}
      <div style={{ ...wrap, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.04fr 0.96fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={chip}><span style={{ width: 7, height: 7, borderRadius: '50%', background: PAL.blue }} />{C.badge}</span>
            <h1 style={{ fontFamily: head, fontWeight: 600, fontSize: 70, lineHeight: 1.02, letterSpacing: '-0.035em', margin: '26px 0 0' }}>
              {C.h1a}<br /><span style={{ color: PAL.blue }}>{C.h1b}</span>
            </h1>
            <p style={{ fontSize: 18.5, lineHeight: 1.62, color: PAL.ink2, margin: '24px 0 0', maxWidth: 480, textWrap: 'pretty' }}>{C.sub}</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
              <button className="a-btn-p">{C.ctaPrimary}</button>
              <button className="a-btn-g">{C.ctaSecondary}</button>
            </div>
            <div style={{ fontSize: 13.5, color: PAL.muted, marginTop: 20 }}>{C.micro}</div>
          </div>
          <Placeholder label="Bewertungsbericht" label2="Produkt-UI · 560 × 520" height={520} radius={18}
            tint="#CFD3E6" style={{ boxShadow: '0 40px 90px -50px rgba(26,32,90,.5)' }} />
        </div>
      </div>

      {/* STATS — tiles */}
      <div style={{ ...wrap, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {C.stats.map((s, i) => {
            const filled = i === 1;
            return (
              <div key={s.l} className="a-card" style={{ padding: '30px 26px',
                background: filled ? PAL.blue : '#fff', border: filled ? 'none' : `1px solid ${PAL.border}` }}>
                <div style={{ fontFamily: head, fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1,
                  color: filled ? '#fff' : PAL.ink }}>{s.n}</div>
                <div style={{ fontSize: 14, marginTop: 12, color: filled ? 'rgba(255,255,255,.85)' : PAL.muted }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRUST */}
      <div style={{ ...wrap, paddingBottom: 100 }}>
        <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: PAL.muted, marginBottom: 28 }}>{C.trustLabel}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 26 }}>
          {['Sparkasse', 'VR Bank', 'Engel & V.', 'JLL', 'Sprengnetter'].map((l) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', fontFamily: head, fontSize: 18, fontWeight: 600, color: '#B6B2AA', letterSpacing: '-0.01em' }}>{l}</div>
          ))}
        </div>
      </div>

      {/* METHODS */}
      <div style={{ background: '#fff', borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 100, paddingBottom: 100 }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 60px' }}>
            <span style={chip}>Verfahren</span>
            <h2 style={{ fontFamily: head, fontWeight: 600, fontSize: 52, letterSpacing: '-0.035em', margin: '20px 0 18px' }}>{C.methodsTitle}</h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: PAL.ink2, margin: 0, textWrap: 'pretty' }}>{C.methodsLede}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {C.methods.map((m) => (
              <div key={m.k} className="a-card" style={{ padding: '32px 30px' }}>
                <div style={{ height: 4, width: 40, borderRadius: 2, background: PAL.blue, marginBottom: 24 }} />
                <div style={{ fontFamily: head, fontSize: 14, fontWeight: 700, color: PAL.blue, letterSpacing: '.06em' }}>{m.k}</div>
                <h3 style={{ fontFamily: head, fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', margin: '12px 0 14px' }}>{m.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.62, color: PAL.ink2, margin: 0 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MARKET DATA SPLIT */}
      <div style={{ ...wrap, paddingTop: 100, paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 64, alignItems: 'center' }}>
          <Placeholder label="Lagekarte" label2="Bodenrichtwerte · Mietspiegel" height={440} radius={18} tint="#CFD3E6" />
          <div>
            <span style={chip}>Marktdaten</span>
            <h2 style={{ fontFamily: head, fontWeight: 600, fontSize: 48, letterSpacing: '-0.035em', margin: '20px 0 20px', lineHeight: 1.04 }}>{C.mapTitle}</h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.62, color: PAL.ink2, margin: '0 0 30px', textWrap: 'pretty' }}>{C.mapLede}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {C.mapBullets.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15.5, color: PAL.ink,
                  background: PAL.blueLt2, border: `1px solid ${PAL.blueLt}`, borderRadius: 10, padding: '14px 16px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: PAL.blue, flex: '0 0 auto' }} />{b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ ...wrap, paddingBottom: 110 }}>
        <h2 style={{ fontFamily: head, fontWeight: 600, fontSize: 48, letterSpacing: '-0.035em', textAlign: 'center', margin: '0 0 60px' }}>{C.stepsTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26 }}>
          {C.steps.map((s) => (
            <div key={s.n} className="a-step" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div className="a-badge" style={{ width: 46, height: 46, borderRadius: 12, background: PAL.blueLt, color: PAL.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontSize: 20, fontWeight: 700,
                flex: '0 0 auto', transition: 'background .2s,color .2s' }}>{s.n}</div>
              <div>
                <h3 style={{ fontFamily: head, fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em', margin: '8px 0 10px' }}>{s.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: PAL.ink2, margin: 0 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BAND — deep blue */}
      <div style={{ ...wrap, paddingBottom: 100 }}>
        <div style={{ background: PAL.blueInk, borderRadius: 24, padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(700px 300px at 50% -10%, rgba(48,80,200,.45), transparent)` }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontFamily: head, fontWeight: 600, fontSize: 50, lineHeight: 1.08, letterSpacing: '-0.035em', color: '#fff', margin: '0 auto', maxWidth: 680, textWrap: 'balance' }}>{C.ctaBandTitle}</h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.78)', margin: '20px auto 0', maxWidth: 500 }}>{C.ctaBandSub}</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34 }}>
              <button className="a-btn-p" style={{ background: '#fff', color: PAL.blueInk }}>{C.ctaPrimary}</button>
              <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 10, fontFamily: sans, fontWeight: 700, fontSize: 15, padding: '13px 24px', cursor: 'pointer' }}>{C.ctaSecondary}</button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 60, paddingBottom: 36, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <PinMark size={24} color={PAL.blue} />
              <span style={{ fontFamily: head, fontSize: 19, fontWeight: 700 }}>{C.brand}</span>
            </div>
            <p style={{ fontSize: 14.5, color: PAL.muted, margin: 0, maxWidth: 240, lineHeight: 1.6 }}>KI-gestützte Immobilienbewertung nach ImmoWertV 2024.</p>
          </div>
          {C.footerCols.map((col) => (
            <div key={col.h}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: PAL.ink, marginBottom: 18 }}>{col.h}</div>
              <div style={{ display: 'grid', gap: 11 }}>{col.items.map((it) => <a key={it} href="#" className="a-navlink" style={{ fontSize: 14.5, fontWeight: 500 }}>{it}</a>)}</div>
            </div>
          ))}
        </div>
        <div style={{ ...wrap, paddingBottom: 40 }}>
          <div style={{ borderTop: `1px solid ${PAL.border}`, paddingTop: 22, fontSize: 13.5, color: PAL.muted }}>{C.footerNote}</div>
        </div>
      </div>
    </div>
  );
}

window.DirectionAtlas = DirectionAtlas;
