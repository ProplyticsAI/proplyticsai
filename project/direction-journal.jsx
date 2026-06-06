// direction-journal.jsx — Direction 3: literary magazine.
// Newsreader (serif, with italics) headlines + Schibsted Grotesk body.
// Royal blue + green balanced; a deep blue-ink editorial section.
// Exports DirectionJournal to window.

function DirectionJournal() {
  const serif = "'Newsreader', Georgia, serif";
  const sans = "'Schibsted Grotesk', system-ui, sans-serif";
  const mono = "'Hanken Grotesk', ui-monospace, monospace";
  const W = 1180;
  const wrap = { maxWidth: W, margin: '0 auto', padding: '0 80px', boxSizing: 'border-box' };
  const kicker = { fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: PAL.blue };

  return (
    <div style={{ width: '100%', background: PAL.cream, color: PAL.ink, fontFamily: sans,
      fontSize: 16, lineHeight: 1.6, WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        .j-navlink{color:${PAL.ink2};text-decoration:none;font-size:14.5px;font-weight:500;transition:color .2s}
        .j-navlink:hover{color:${PAL.blue}}
        .j-btn-p{background:${PAL.green};color:#fff;border:none;border-radius:8px;font-family:${sans};
          font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:transform .15s,box-shadow .2s}
        .j-btn-p:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px ${PAL.green}}
        .j-btn-g{background:transparent;color:${PAL.ink};border:1px solid ${PAL.ink};border-radius:8px;
          font-family:${sans};font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
        .j-btn-g:hover{background:${PAL.ink};color:#fff}
        .j-row{border-top:1px solid rgba(237,235,230,.18);transition:background .25s}
        .j-row:hover{background:rgba(237,235,230,.04)}
        .j-row:hover .j-rnum{color:${PAL.gold}}
        .j-link{color:${PAL.blue};text-decoration:none;border-bottom:1px solid ${PAL.blueLt}}
      `}</style>

      {/* TOP UTILITY STRIP */}
      <div style={{ background: PAL.ink, color: PAL.cream }}>
        <div style={{ ...wrap, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: mono, fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(245,243,239,.72)' }}>
          <span>Immobilienbewertung</span>
          <span>Ausgabe 2026 · Nach ImmoWertV 2024</span>
        </div>
      </div>

      {/* NAV */}
      <div style={{ borderBottom: `1px solid ${PAL.ink}` }}>
        <div style={{ ...wrap, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 30 }}>{C.nav.slice(0, 2).map((n) => <a key={n} href="#" className="j-navlink">{n}</a>)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <PinMark size={26} color={PAL.green} />
            <span style={{ fontFamily: serif, fontSize: 27, fontWeight: 500, letterSpacing: '.005em' }}>{C.brand}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {C.nav.slice(2).map((n) => <a key={n} href="#" className="j-navlink">{n}</a>)}
            <a href="#" className="j-navlink">Anmelden</a>
          </div>
        </div>
      </div>

      {/* HERO masthead */}
      <div style={{ ...wrap, paddingTop: 72, paddingBottom: 56 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30 }}>
          <span style={kicker}>{C.badge}</span>
          <span style={{ ...kicker, color: PAL.muted }}>Bewertung in 2 Minuten</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56, alignItems: 'end' }}>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: 92, lineHeight: 0.98, letterSpacing: '-0.022em', margin: 0 }}>
            {C.h1a}<br /><span style={{ fontStyle: 'italic', color: PAL.green }}>{C.h1b}</span>
          </h1>
          <div style={{ paddingBottom: 10 }}>
            <p style={{ fontSize: 18, lineHeight: 1.62, color: PAL.ink2, margin: '0 0 26px', textWrap: 'pretty' }}>{C.sub}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="j-btn-p">{C.ctaPrimary}</button>
              <button className="j-btn-g">{C.ctaSecondary}</button>
            </div>
            <div style={{ fontSize: 13.5, color: PAL.muted, marginTop: 18 }}>{C.micro}</div>
          </div>
        </div>
      </div>

      {/* FEATURE IMAGE */}
      <div style={{ ...wrap, paddingBottom: 18 }}>
        <Placeholder label="Bewertungsbericht — Screenshot" label2="Produkt-UI · 1180 × 540" height={540} radius={6} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: mono, fontSize: 12, color: PAL.muted, letterSpacing: '.04em' }}>
          <span>Abb. 1 — Marktwert nach drei Verfahren, ein prüffähiger Bericht.</span>
          <span>proplytics.de</span>
        </div>
      </div>

      {/* STATS — editorial */}
      <div style={{ ...wrap, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `2px solid ${PAL.ink}`, borderBottom: `1px solid ${PAL.border}` }}>
          {C.stats.map((s, i) => (
            <div key={s.l} style={{ padding: '34px 26px 30px', borderLeft: i ? `1px solid ${PAL.border}` : 'none' }}>
              <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em', color: i === 1 ? PAL.blue : PAL.ink }}>{s.n}</div>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16.5, color: PAL.muted, marginTop: 12 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* METHODS — dark ink editorial index */}
      <div style={{ background: PAL.blueInk, color: PAL.cream }}>
        <div style={{ ...wrap, paddingTop: 96, paddingBottom: 96 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'baseline', marginBottom: 16 }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 60, lineHeight: 1.02, letterSpacing: '-0.02em', margin: 0 }}>
              Drei Verfahren.<br /><span style={{ fontStyle: 'italic', color: PAL.gold }}>Ein Bericht.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.62, color: 'rgba(245,243,239,.72)', margin: 0, textWrap: 'pretty' }}>{C.methodsLede}</p>
          </div>
          <div>
            {C.methods.map((m) => (
              <div key={m.k} className="j-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.4fr', gap: 36, alignItems: 'start', padding: '34px 0' }}>
                <div className="j-rnum" style={{ fontFamily: serif, fontSize: 40, fontStyle: 'italic', color: 'rgba(245,243,239,.4)', transition: 'color .25s' }}>{m.k}</div>
                <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em', margin: 0, paddingTop: 4 }}>{m.t}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(245,243,239,.78)', margin: 0, paddingTop: 6 }}>{m.d}</p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(237,235,230,.18)' }} />
          </div>
        </div>
      </div>

      {/* MARKET split */}
      <div style={{ ...wrap, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <span style={kicker}>Marktdaten</span>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 52, lineHeight: 1.04, letterSpacing: '-0.02em', margin: '18px 0 22px' }}>
              Marktdaten, <span style={{ fontStyle: 'italic' }}>die zählen.</span>
            </h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.62, color: PAL.ink2, margin: '0 0 28px', textWrap: 'pretty' }}>{C.mapLede}</p>
            <div style={{ display: 'grid', gap: 0 }}>
              {C.mapBullets.map((b, i) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 16.5, color: PAL.ink,
                  padding: '15px 0', borderTop: `1px solid ${PAL.border}`, borderBottom: i === C.mapBullets.length - 1 ? `1px solid ${PAL.border}` : 'none' }}>
                  <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: PAL.blue, width: 22 }}>{`0${i + 1}`}</span>{b}
                </div>
              ))}
            </div>
          </div>
          <Placeholder label="Lagekarte" label2="Bodenrichtwerte · Mietspiegel" height={440} radius={6} tint="#CFD3E6" />
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: PAL.card, borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 90, paddingBottom: 90 }}>
          <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 50, fontStyle: 'italic', letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 56px' }}>{C.stepsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 50 }}>
            {C.steps.map((s, i) => (
              <div key={s.n} style={{ borderTop: `2px solid ${PAL.ink}`, paddingTop: 22 }}>
                <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 400, color: PAL.blue, lineHeight: 1 }}>{`0${s.n}`}</div>
                <h3 style={{ fontFamily: serif, fontSize: 25, fontWeight: 500, margin: '16px 0 12px' }}>{s.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: PAL.ink2, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...wrap, paddingTop: 100, paddingBottom: 100, textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 66, lineHeight: 1.04, letterSpacing: '-0.02em', margin: '0 auto', maxWidth: 760, textWrap: 'balance' }}>
          Bewerten Sie Ihre erste Immobilie — <span style={{ fontStyle: 'italic', color: PAL.green }}>kostenlos.</span>
        </h2>
        <p style={{ fontSize: 18, color: PAL.ink2, margin: '22px auto 0', maxWidth: 500 }}>{C.ctaBandSub}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34 }}>
          <button className="j-btn-p">{C.ctaPrimary}</button>
          <button className="j-btn-g">{C.ctaSecondary}</button>
        </div>
      </div>

      {/* FOOTER colophon */}
      <div style={{ borderTop: `2px solid ${PAL.ink}` }}>
        <div style={{ ...wrap, paddingTop: 56, paddingBottom: 32, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <PinMark size={24} color={PAL.green} />
              <span style={{ fontFamily: serif, fontSize: 23, fontWeight: 500 }}>{C.brand}</span>
            </div>
            <p style={{ fontSize: 14.5, color: PAL.muted, margin: 0, maxWidth: 250, lineHeight: 1.6 }}>KI-gestützte Immobilienbewertung nach ImmoWertV 2024.</p>
          </div>
          {C.footerCols.map((col) => (
            <div key={col.h}>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: PAL.ink, marginBottom: 16 }}>{col.h}</div>
              <div style={{ display: 'grid', gap: 11 }}>{col.items.map((it) => <a key={it} href="#" className="j-navlink" style={{ fontSize: 14.5 }}>{it}</a>)}</div>
            </div>
          ))}
        </div>
        <div style={{ ...wrap, paddingBottom: 40 }}>
          <div style={{ borderTop: `1px solid ${PAL.border}`, paddingTop: 20, fontFamily: mono, fontSize: 12.5, color: PAL.muted, letterSpacing: '.04em' }}>{C.footerNote}</div>
        </div>
      </div>
    </div>
  );
}

window.DirectionJournal = DirectionJournal;
