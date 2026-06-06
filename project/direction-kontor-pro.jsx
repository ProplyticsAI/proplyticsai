// direction-kontor-pro.jsx — "Dossier" direction for proplytic.ai.
// An editorial, engineered valuation instrument — not a generic SaaS template.
// Signature system: left-aligned asymmetric composition, a fine blueprint /
// cadastral grid, a § chapter-numbering system (ImmoWertV flavour), and a
// recurring measurement-ruler motif (precision / valuation).
// Props: { fontBody, accent, more, mono }  — driven by the Tweaks panel.

function KontorPro({ fontBody = "'Geist', system-ui, sans-serif", accent = '#3050C8', more = false, mono = true }) {
  const serif = "'Bodoni Moda', Georgia, serif";
  const sans = fontBody;
  const monoF = "'Geist Mono', ui-monospace, monospace";
  const label = mono ? monoF : sans;
  const W = 1240;
  const wrap = { maxWidth: W, margin: '0 auto', padding: '0 72px', boxSizing: 'border-box' };

  // mono / technical micro-label
  const Lbl = ({ children, color = PAL.muted, style = {} }) => (
    <span style={{ fontFamily: label, fontSize: 11.5, fontWeight: mono ? 500 : 700,
      letterSpacing: mono ? '.2em' : '.2em', textTransform: 'uppercase', color, ...style }}>{children}</span>
  );

  // logo-agnostic text wordmark (user inserts their mark later)
  const Brand = ({ fs = 22 }) => (
    <span style={{ fontFamily: serif, fontSize: fs, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1, color: PAL.ink }}>
      proplytic<span style={{ color: accent }}>.ai</span>
    </span>
  );

  // § chapter eyebrow — the signature section marker
  const Chapter = ({ n, children }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: accent, lineHeight: 1 }}>§&nbsp;{n}</span>
      <span style={{ width: 26, height: 1, background: PAL.border }} />
      <Lbl color={PAL.muted}>{children}</Lbl>
    </div>
  );

  // signature measurement-ruler motif (full-width divider or accent under text)
  const Ruler = ({ w = '100%', ticks = 48, color = PAL.border, big = accent, align = 'left' }) => {
    const arr = Array.from({ length: ticks + 1 });
    return (
      <svg width={w} height="16" viewBox={`0 0 ${ticks * 10} 16`} preserveAspectRatio={`xMidYMid meet`}
        style={{ display: 'block', overflow: 'visible' }}>
        <line x1="0" y1="15" x2={ticks * 10} y2="15" stroke={color} strokeWidth="1" />
        {arr.map((_, i) => {
          const major = i % 5 === 0;
          const lead = i === 0;
          return <line key={i} x1={i * 10} y1={lead ? 4 : major ? 8 : 11} x2={i * 10} y2="15"
            stroke={lead ? big : color} strokeWidth={lead ? 2 : 1} />;
        })}
      </svg>
    );
  };

  const statBg = more ? `color-mix(in srgb, ${accent} 5%, ${PAL.card})` : PAL.card;

  return (
    <div style={{ ['--accent']: accent, width: '100%', background: PAL.cream, color: PAL.ink,
      fontFamily: sans, fontSize: 16, lineHeight: 1.6, WebkitFontSmoothing: 'antialiased',
      fontVariantNumeric: 'tabular-nums' }}>
      <style>{`
        .kp-a{color:var(--accent);text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}
        .kp-a:hover{border-color:var(--accent)}
        .kp-nav{color:${PAL.ink2};text-decoration:none;font-size:14.5px;font-weight:500;transition:color .2s}
        .kp-nav:hover{color:var(--accent)}
        .kp-btn-p{background:${PAL.green};color:#fff;border:none;border-radius:8px;font-family:${sans};
          font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:transform .15s,box-shadow .2s}
        .kp-btn-p:hover{transform:translateY(-1px);box-shadow:0 12px 26px -12px ${PAL.green}}
        .kp-btn-g{background:transparent;color:${PAL.ink};border:1px solid ${PAL.border};border-radius:8px;
          font-family:${sans};font-weight:600;font-size:15px;padding:13px 24px;cursor:pointer;transition:border-color .2s,color .2s}
        .kp-btn-g:hover{border-color:var(--accent);color:var(--accent)}
        .kp-method{padding-top:24px;border-top:1px solid ${PAL.ink};transition:border-color .25s}
        .kp-method:hover{border-color:var(--accent)}
        .kp-method:hover .kp-mnum{color:var(--accent)}
        .kp-grid-bg{background-image:
          linear-gradient(${PAL.border} 1px, transparent 1px),
          linear-gradient(90deg, ${PAL.border} 1px, transparent 1px);
          background-size:34px 34px;}
      `}</style>

      {/* SYSTEM BAR */}
      <div style={{ borderBottom: `1px solid ${PAL.border}`, background: PAL.cream }}>
        <div style={{ ...wrap, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Lbl>proplytic.ai · Immobilienbewertung</Lbl>
          <Lbl>ImmoWertV 2024 · DE</Lbl>
        </div>
      </div>

      {/* NAV */}
      <div style={{ borderBottom: `1px solid ${PAL.border}`, position: 'sticky', top: 0, zIndex: 20, background: 'color-mix(in srgb, var(--cream, #F5F3EF) 88%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div style={{ ...wrap, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Brand fs={23} />
          <div style={{ display: 'flex', gap: 36 }}>{C.nav.map((n) => <a key={n} href="#" className="kp-nav">{n}</a>)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#" className="kp-nav">Anmelden</a>
            <button className="kp-btn-p" style={{ padding: '10px 20px' }}>{C.ctaPrimary}</button>
          </div>
        </div>
      </div>

      {/* HERO — asymmetric editorial, blueprint grid */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${PAL.border}` }}>
        {/* blueprint grid backdrop, fading out */}
        <div className="kp-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5,
          maskImage: 'radial-gradient(120% 90% at 18% 12%, #000 0%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 18% 12%, #000 0%, transparent 72%)' }} />
        <div style={{ ...wrap, position: 'relative', paddingTop: 80, paddingBottom: 84 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr', gap: 64, alignItems: 'center' }}>
            {/* LEFT — text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 26 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
                <Lbl color={accent}>{C.badge}</Lbl>
              </div>
              <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: 62, lineHeight: 1.02, letterSpacing: '-0.02em',
                margin: 0, maxWidth: 540, textWrap: 'balance' }}>
                {C.h1a}<br />
                <span style={{ fontStyle: 'italic', position: 'relative', whiteSpace: 'nowrap' }}>
                  {C.h1b}
                  <span style={{ position: 'absolute', left: 0, right: '6%', bottom: 9, height: 3, borderRadius: 2, background: accent, opacity: .9 }} />
                </span>
              </h1>
              <div style={{ margin: '28px 0 4px', maxWidth: 300 }}>
                <Ruler ticks={30} />
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.62, color: PAL.ink2, maxWidth: 440, margin: '20px 0 0', textWrap: 'pretty' }}>{C.sub}</p>
              <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
                <button className="kp-btn-p">{C.ctaPrimary}</button>
                <button className="kp-btn-g">{C.ctaSecondary}</button>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 26, flexWrap: 'wrap' }}>
                {['DSGVO-konform', 'Keine Kreditkarte', 'Ergebnis in 2 Min'].map((s, i) => (
                  <React.Fragment key={s}>
                    {i > 0 && <span style={{ width: 1, height: 12, background: PAL.border, alignSelf: 'center' }} />}
                    <Lbl>{s}</Lbl>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* RIGHT — the product artifact */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: -26, left: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Lbl>Abb. 01 — Bewertungsbericht</Lbl>
              </div>
              <ReportCard accent={accent} serif={serif} sans={sans} label={label} />
            </div>
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 40, paddingBottom: 40, display: 'flex', alignItems: 'center', gap: 40 }}>
          <Lbl style={{ flex: '0 0 auto', maxWidth: 150, lineHeight: 1.5 }}>{C.trustLabel}</Lbl>
          <span style={{ width: 1, height: 30, background: PAL.border }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 26 }}>
            {['Sparkasse', 'VR Bank', 'Engel & V.', 'JLL', 'Sprengnetter'].map((l) => (
              <div key={l} style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, color: '#B6B2AA' }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS — asymmetric: one lead figure + supporting */}
      <div style={{ borderBottom: `1px solid ${PAL.border}`, background: statBg }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1fr', padding: '56px 72px' }}>
          {C.stats.map((s, i) => (
            <div key={s.l} style={{ padding: '0 32px', borderLeft: i ? `1px solid ${PAL.border}` : 'none' }}>
              <div style={{ marginBottom: 16 }}><Lbl color={i === 0 ? accent : PAL.muted}>{`§ 0${i + 1}`}</Lbl></div>
              <div style={{ fontFamily: serif, fontSize: i === 0 ? 64 : 48, fontWeight: 500, lineHeight: 0.98, letterSpacing: '-0.02em',
                color: i === 0 ? accent : PAL.ink }}>{s.n}</div>
              <div style={{ fontSize: 14.5, color: PAL.muted, marginTop: 14, maxWidth: 170 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* METHODS */}
      <div style={{ ...wrap, paddingTop: 100, paddingBottom: 30 }}>
        <Chapter n="01">Verfahren</Chapter>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', margin: '22px 0 52px' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0 }}>{C.methodsTitle}</h2>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: PAL.ink2, margin: 0, textWrap: 'pretty' }}>{C.methodsLede}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
          {C.methods.map((m) => (
            <div key={m.k} className="kp-method">
              <div className="kp-mnum" style={{ fontFamily: label, fontSize: 13, fontWeight: mono ? 500 : 700, letterSpacing: '.14em',
                color: more ? accent : PAL.muted, transition: 'color .25s' }}>{m.k}</div>
              <h3 style={{ fontFamily: serif, fontSize: 27, fontWeight: 500, letterSpacing: '-0.01em', margin: '16px 0 12px' }}>{m.t}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.62, color: PAL.ink2, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RULER DIVIDER — signature motif */}
      <div style={{ ...wrap, paddingTop: 80, paddingBottom: 0 }}>
        <Ruler ticks={Math.round((W - 144) / 22)} />
      </div>

      {/* MARKET SPLIT */}
      <div style={{ ...wrap, paddingTop: 96, paddingBottom: 104 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 64, alignItems: 'center' }}>
          <div>
            <Chapter n="02">Marktdaten</Chapter>
            <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 48, lineHeight: 1.06, letterSpacing: '-0.02em', margin: '22px 0 22px' }}>{C.mapTitle}</h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.62, color: PAL.ink2, margin: '0 0 30px', textWrap: 'pretty' }}>{C.mapLede}</p>
            <div style={{ display: 'grid', gap: 0 }}>
              {C.mapBullets.map((b, i) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 16, color: PAL.ink,
                  padding: '14px 0', borderTop: `1px solid ${PAL.border}`, borderBottom: i === C.mapBullets.length - 1 ? `1px solid ${PAL.border}` : 'none' }}>
                  <span style={{ fontFamily: label, fontSize: 11.5, color: accent, width: 24, letterSpacing: '.1em' }}>{`0${i + 1}`}</span>{b}
                </div>
              ))}
            </div>
          </div>
          <MapPanel accent={accent} serif={serif} label={label} />
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: PAL.card, borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}>
        <div style={{ ...wrap, paddingTop: 92, paddingBottom: 92 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Chapter n="03">Ablauf</Chapter></div>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 50, letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 60px' }}>{C.stepsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 50, position: 'relative' }}>
            {C.steps.map((s, i) => (
              <div key={s.n} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 54, height: 54, borderRadius: more ? 14 : '50%',
                  border: `1px solid ${more ? accent : PAL.ink}`, background: more ? `color-mix(in srgb, ${accent} 8%, transparent)` : 'transparent',
                  color: more ? accent : PAL.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px',
                  fontFamily: label, fontSize: 19, fontWeight: mono ? 500 : 700 }}>{s.n}</div>
                <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, margin: '0 0 12px' }}>{s.t}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.6, color: PAL.ink2, margin: '0 auto', maxWidth: 270 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="kp-grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5,
          maskImage: 'radial-gradient(90% 120% at 82% 90%, #000 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(90% 120% at 82% 90%, #000 0%, transparent 70%)' }} />
        <div style={{ ...wrap, position: 'relative', paddingTop: 100, paddingBottom: 100, textAlign: 'center' }}>
          <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: 58, lineHeight: 1.06, letterSpacing: '-0.02em', margin: '0 auto', maxWidth: 760, textWrap: 'balance' }}>{C.ctaBandTitle}</h2>
          <p style={{ fontSize: 18, color: PAL.ink2, margin: '24px auto 0', maxWidth: 520 }}>{C.ctaBandSub}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34 }}>
            <button className="kp-btn-p">{C.ctaPrimary}</button>
            <button className="kp-btn-g">{C.ctaSecondary}</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${PAL.border}`, background: PAL.cream }}>
        <div style={{ ...wrap, paddingTop: 60, paddingBottom: 36, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ marginBottom: 16 }}><Brand fs={21} /></div>
            <p style={{ fontSize: 14.5, color: PAL.muted, margin: 0, maxWidth: 250, lineHeight: 1.6 }}>KI-gestützte Immobilienbewertung nach ImmoWertV 2024.</p>
          </div>
          {C.footerCols.map((col) => (
            <div key={col.h}>
              <div style={{ marginBottom: 18 }}><Lbl color={PAL.ink}>{col.h}</Lbl></div>
              <div style={{ display: 'grid', gap: 11 }}>{col.items.map((it) => <a key={it} href="#" className="kp-nav" style={{ fontSize: 14.5 }}>{it}</a>)}</div>
            </div>
          ))}
        </div>
        <div style={{ ...wrap, paddingBottom: 40 }}>
          <div style={{ borderTop: `1px solid ${PAL.border}`, paddingTop: 22 }}><Lbl>{C.footerNote}</Lbl></div>
        </div>
      </div>
    </div>
  );
}

window.KontorPro = KontorPro;
