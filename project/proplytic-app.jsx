// pages-app.jsx — Analyse (core tool), Comparison, Valuations list.
// Uses AppShell, primitives from window. Theme-driven (`t`).
// Exports to window: AnalysePage, ComparisonPage, ValuationsPage.

// ─────────────────────────────────────────── ANALYSE (core valuation tool)
function AnalysePage({ t }) {
  const modes = [
    ['zap', 'Schnell', 'Adresse + Basics', true],
    ['sliders', 'Detailliert', 'Volle ImmoWertV-Eingaben', false],
    ['link', 'Link importieren', 'Aus einem Inserat-Link', false],
    ['fileText', 'PDF-Upload', 'Aus Exposé extrahieren', false],
  ];
  const chat = [
    ['a', 'Welche Objektart bewerten Sie?'],
    ['u', 'Ein Mehrfamilienhaus.'],
    ['a', 'Verstanden. Wie viele vermietbare Einheiten und wie groß ist die Gesamtwohnfläche?'],
    ['u', '8 Einheiten · 612 m²'],
    ['a', 'Danke — ich berechne jetzt Marktwert, Rendite und Vergleichsobjekte.'],
  ];
  const band = 0.62; // marker position
  return (
    <AppShell t={t} active="Neue Bewertung" h={1040}
      title={<div>
        <Cap t={t} color={t.muted}>Neue Analyse</Cap>
        <div style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>Gärtnerstraße 14, Berlin</div>
      </div>}
      action={<Btn t={t} variant="outline" size="sm" icon="download">PDF exportieren</Btn>}>
      <div style={{ padding: '24px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* mode selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {modes.map(([ic, ti, d, on]) => (
            <div key={ti} style={{
              padding: '16px 18px', borderRadius: t.radiusLg, display: 'flex', alignItems: 'center', gap: 13,
              background: on ? t.highlightSoft : t.surface,
              border: `1px solid ${on ? t.highlight : t.line}`,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: t.radius, display: 'grid', placeItems: 'center', background: on ? t.highlight : (t.mode === 'dark' ? t.surface2 : t.surface2), color: on ? t.onHighlight : t.accent }}><Icon name={ic} size={19} /></div>
              <div>
                <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14.5, color: t.ink }}>{ti}</div>
                <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 3-column workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 300px', gap: 16, flex: 1, minHeight: 0 }}>
          {/* chat wizard */}
          <Card t={t} pad={0} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: `1px solid ${t.line}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}><Icon name="sparkles" size={16} /></div>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14 }}>Bewertungs-Assistent</div>
            </div>
            <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
              {chat.map(([who, msg], i) => (
                <div key={i} style={{ alignSelf: who === 'u' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.5, padding: '10px 13px', borderRadius: t.radiusLg,
                    background: who === 'u' ? t.highlight : (t.mode === 'dark' ? t.surface2 : t.surface2),
                    color: who === 'u' ? t.onHighlight : t.ink,
                    borderTopRightRadius: who === 'u' ? 4 : t.radiusLg, borderTopLeftRadius: who === 'u' ? t.radiusLg : 4,
                  }}>{msg}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderTop: `1px solid ${t.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 0 14px', height: 44, borderRadius: t.radius, border: `1px solid ${t.line}`, background: t.mode === 'dark' ? t.sunken : t.surface2 }}>
                <span style={{ flex: 1, fontFamily: t.sans, fontSize: 13.5, color: t.faint }}>Antwort eingeben…</span>
                <div style={{ width: 32, height: 32, borderRadius: t.radius - 1, background: t.primaryBg, color: t.primaryFg, display: 'grid', placeItems: 'center' }}><Icon name="arrowRight" size={16} stroke={2.2} /></div>
              </div>
            </div>
          </Card>
          {/* results */}
          <Card t={t} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Cap t={t} color={t.muted}>Geschätzter Marktwert</Cap>
                <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 46, letterSpacing: '-0.025em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>1,84 Mio. €</div>
                <div style={{ fontFamily: t.sans, fontSize: 13.5, color: t.faint, marginTop: 2 }}>Konfidenzband 1,78 Mio. € – 1,97 Mio. €</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '6px 11px', borderRadius: 999 }}><Icon name="check" size={12} stroke={2.4} /> ImmoWertV 2024</span>
            </div>
            {/* value band */}
            <div style={{ marginTop: 22 }}>
              <div style={{ position: 'relative', height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${t.line}, ${t.highlight})` }}>
                <div style={{ position: 'absolute', left: `${band * 100}%`, top: -5, width: 3, height: 20, borderRadius: 2, background: t.ink, transform: 'translateX(-50%)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontFamily: t.mono, fontSize: 11.5, color: t.faint }}>1,62 Mio. €</span>
                <span style={{ fontFamily: t.mono, fontSize: 11.5, color: t.faint }}>2,10 Mio. €</span>
              </div>
            </div>
            {/* metric grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 22 }}>
              {[['Bruttorendite', '4,2 %', 'trendingUp'], ['Nettorendite', '3,4 %', 'percent'], ['IRR (10 J.)', '6,8 %', 'pie'], ['Faktor', '18,4×', 'bars'], ['€/m²', '3.010 €', 'euro'], ['Cashflow/Mon.', '+2.140 €', 'euro']].map(([l, v, ic]) => (
                <div key={l} style={{ padding: 15, borderRadius: t.radius, background: t.mode === 'dark' ? t.sunken : t.surface2, border: `1px solid ${t.line}` }}>
                  <Icon name={ic} size={15} color={t.accent} />
                  <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint, marginTop: 9 }}>{l}</div>
                  <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 18, color: t.ink, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
            {/* breakdown */}
            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
              <Cap t={t} color={t.muted}>Wertzusammensetzung</Cap>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
                {[['Bodenwert', 0.34], ['Gebäudewert', 0.52], ['Lageaufschlag', 0.14]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontFamily: t.sans, fontSize: 13, color: t.muted, width: 130 }}>{l}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: t.line, overflow: 'hidden' }}>
                      <div style={{ width: `${v * 100}%`, height: '100%', background: t.accent, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.ink, width: 40, textAlign: 'right' }}>{Math.round(v * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          {/* map + comparables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
            <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
              <MapMini t={t} h={170} />
              <div style={{ padding: '12px 16px' }}>
                <Cap t={t} color={t.muted}>Lage-Score</Cap>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 5 }}>
                  <span style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 24, color: t.ink }}>8,4</span>
                  <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>/ 10 · Top</span>
                </div>
              </div>
            </Card>
            <Card t={t} pad={0} style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.line}` }}><Cap t={t} color={t.muted}>Comparables</Cap></div>
              {[['Gärtnerstr. 9', '2.940 €/m²'], ['Bornholmer 41', '3.120 €/m²'], ['Schönhauser 7', '2.880 €/m²']].map(([a, p], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < 2 ? `1px solid ${t.line}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: t.data }} />
                    <span style={{ fontFamily: t.sans, fontSize: 13, color: t.ink }}>{a}</span>
                  </div>
                  <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.muted }}>{p}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ─────────────────────────────────────────── COMPARISON
function ComparisonPage({ t }) {
  const objs = [
    { a: 'Gärtnerstraße 14', c: 'Berlin', type: 'Mehrfamilienhaus', val: '1,84 Mio. €', yld: '4,2 %', col: t.accent },
    { a: 'Hafenstraße 3', c: 'Bremen', type: 'Gemischt genutzt', val: '1,21 Mio. €', yld: '5,4 %', col: t.data },
    { a: 'Sonnenweg 22', c: 'München', type: 'Einfamilienhaus', val: '980 Tsd. €', yld: '2,9 %', col: t.pos },
  ];
  const radar = [
    { c: t.accent, vals: [0.42, 0.55, 0.6, 0.7, 0.5] },
    { c: t.data, vals: [0.72, 0.66, 0.74, 0.5, 0.68] },
    { c: t.pos, vals: [0.3, 0.4, 0.36, 0.62, 0.44] },
  ];
  const tableRows = [
    ['Marktwert', ['1,84 Mio. €', '1,21 Mio. €', '980 Tsd. €'], 0],
    ['Bruttorendite', ['4,2 %', '5,4 %', '2,9 %'], 1],
    ['Nettorendite', ['3,4 %', '4,6 %', '2,2 %'], 1],
    ['Faktor', ['18,4×', '14,1×', '24,0×'], 1],
    ['€/m²', ['3.010 €', '1.640 €', '5.440 €'], 1],
    ['Cashflow / Mon.', ['+2.140 €', '+3.260 €', '–180 €'], 1],
    ['Eigenkapitalrendite', ['7,1 %', '9,4 %', '3,0 %'], 1],
    ['Wohnfläche', ['612 m²', '740 m²', '180 m²'], -1],
    ['Baujahr', ['1992', '1965', '1976'], -1],
  ];
  const best = { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 }; // col index of best per highlightable row
  return (
    <AppShell t={t} active="Vergleich" h={1080}
      title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="compare" size={22} color={t.accent} />
        <div style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 24, letterSpacing: '-0.01em' }}>Objektvergleich</div>
        <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>3 Objekte</span>
      </div>}
      action={<Btn t={t} variant="outline" size="sm" icon="plus">Objekt hinzufügen</Btn>}>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* object cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {objs.map((o) => (
            <Card t={t} key={o.a}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: t.radius, background: t.accentSoft, color: o.col, display: 'grid', placeItems: 'center' }}><Icon name="building" size={21} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15.5, color: t.ink }}>{o.a}</div>
                  <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>{o.c}</div>
                </div>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: o.col, marginTop: 4 }} />
              </div>
              <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>{o.type}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18 }}>
                <div>
                  <Cap t={t} color={t.faint}>Marktwert</Cap>
                  <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 24, color: o.col, marginTop: 4 }}>{o.val}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Cap t={t} color={t.faint}>Rendite</Cap>
                  <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 16, color: t.pos, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="trendingUp" size={13} color={t.pos} />{o.yld}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* radar + table */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
          <Card t={t}>
            <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Kennzahlen-Profil</div>
            <Cap t={t} color={t.faint}>Normalisiert, höher = besser</Cap>
            <div style={{ display: 'grid', placeItems: 'center', marginTop: 10 }}><MiniRadar t={t} series={radar} w={290} h={250} /></div>
          </Card>
          <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}`, fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Detaillierter Vergleich</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}`, background: t.mode === 'dark' ? t.sunken : t.surface2 }}>
              <Cap t={t} color={t.faint}>Kennzahl</Cap>
              {objs.map((o) => (
                <div key={o.a} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: o.col }} />
                  <Cap t={t} color={t.muted}>{o.c}</Cap>
                </div>
              ))}
            </div>
            {tableRows.map(([label, vals, hl], ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', padding: '13px 22px', borderBottom: ri < tableRows.length - 1 ? `1px solid ${t.line}` : 'none', alignItems: 'center' }}>
                <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{label}</span>
                {vals.map((v, ci) => {
                  const isBest = hl === 1 && best[ri] === ci;
                  const neg = typeof v === 'string' && v.indexOf('–') === 0;
                  return (
                    <span key={ci} style={{ textAlign: 'right', fontFamily: t.mono, fontSize: 13.5, fontWeight: isBest ? 600 : 500, color: isBest ? t.pos : neg ? t.neg : t.ink }}>
                      {v}{isBest && <span style={{ marginLeft: 5, color: t.accent }}>★</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

// ─────────────────────────────────────────── VALUATIONS LIST
function ValuationsPage({ t }) {
  const items = [
    ['Gärtnerstraße 14', 'Berlin', 'Mehrfamilienhaus', '612 m²', '1992', '1,84 Mio. €', '4,2 %', 12],
    ['Hafenstraße 3', 'Bremen', 'Gemischt genutzt', '740 m²', '1965', '1,21 Mio. €', '5,4 %', 18],
    ['Sonnenweg 22', 'München', 'Einfamilienhaus', '180 m²', '1976', '980 Tsd. €', '2,9 %', 9],
    ['Lindenallee 7', 'Hamburg', 'Eigentumswohnung', '94 m²', '2008', '420 Tsd. €', '3,6 %', 14],
    ['Marktplatz 5', 'Leipzig', 'Gemischt genutzt', '520 m²', '1958', '870 Tsd. €', '6,1 %', 21],
    ['Rosenweg 11', 'Köln', 'Einfamilienhaus', '210 m²', '1989', '1,05 Mio. €', '3,1 %', 6],
  ];
  const chips = ['Alle Arten', 'Mehrfamilienhaus', 'Eigentumswohnung', 'Einfamilienhaus', 'Gemischt genutzt'];
  return (
    <AppShell t={t} active="Bewertungen" h={1040}
      title={<div>
        <Cap t={t} color={t.muted}>Portfolio</Cap>
        <div style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>Alle Bewertungen</div>
      </div>}
      action={<Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} size="sm" icon="plus">Neue Bewertung</Btn>}>
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 360, height: 42, padding: '0 14px', background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}>
            <Icon name="search" size={17} color={t.faint} />
            <span style={{ fontFamily: t.sans, fontSize: 14, color: t.faint }}>Nach Adresse oder Stadt suchen…</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {chips.map((c, i) => (
              <span key={c} style={{
                fontFamily: t.sans, fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 999,
                background: i === 0 ? t.highlightSoft : t.surface,
                color: i === 0 ? t.highlight : t.muted, border: `1px solid ${i === 0 ? t.highlight : t.line}`,
              }}>{c}</span>
            ))}
            <div style={{ width: 42, height: 42, borderRadius: t.radius, border: `1px solid ${t.line}`, display: 'grid', placeItems: 'center', color: t.muted, marginLeft: 4 }}><Icon name="filter" size={17} /></div>
          </div>
        </div>
        {/* summary line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '4px 2px' }}>
          <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}><strong style={{ color: t.ink }}>6</strong> Bewertungen</span>
          <span style={{ width: 1, height: 14, background: t.line }} />
          <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>Gesamt <strong style={{ color: t.ink, fontFamily: t.mono }}>6,37 Mio. €</strong></span>
          <span style={{ width: 1, height: 14, background: t.line }} />
          <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>Ø Rendite <strong style={{ color: t.pos, fontFamily: t.mono }}>4,2 %</strong></span>
        </div>
        {/* cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {items.map((it, i) => (
            <Card t={t} key={i} pad={0} style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <MapMini t={t} h={120} pin />
                <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: t.mono, fontSize: 10.5, color: t.mode === 'dark' ? t.ink : t.surface, background: t.mode === 'dark' ? 'rgba(13,19,22,.72)' : 'rgba(25,27,28,.78)', padding: '4px 8px', borderRadius: 999 }}>{it[6]} Rendite</span>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, color: t.ink }}>{it[0]}</div>
                    <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint, marginTop: 2 }}>{it[1]}</div>
                  </div>
                  <Icon name="arrowUpRight" size={17} color={t.faint} />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {[it[2], it[3], 'Baujahr ' + it[4]].map((m) => (
                    <span key={m} style={{ fontFamily: t.sans, fontSize: 11.5, color: t.muted, background: t.mode === 'dark' ? t.sunken : t.surface2, padding: '4px 9px', borderRadius: 999, border: `1px solid ${t.line}` }}>{m}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.line}` }}>
                  <div>
                    <Cap t={t} color={t.faint}>Marktwert</Cap>
                    <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: t.ink, marginTop: 3 }}>{it[5]}</div>
                  </div>
                  <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.pos, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="trendingUp" size={13} color={t.pos} />{it[6]}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

Object.assign(window, { AnalysePage, ComparisonPage, ValuationsPage });
