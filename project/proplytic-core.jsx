// pages-core.jsx — Landing, Login, Register, Dashboard.
// Theme-driven (`t` prop). Shared chrome: MarketingNav, SiteFooter, AppShell.
// Exports to window: LandingPage, LoginPage, RegisterPage, DashboardPage.

const PAGE_W = 1320;

// ─────────────────────────────────────────── shared bits
function SectionTag({ t, num, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{
        fontFamily: t.mono, fontSize: 12, fontWeight: 600, color: t.highlight,
        letterSpacing: '.08em',
      }}>{t.key === 'ledger' ? num : num + ' /'}</span>
      <span style={{ width: 26, height: 1, background: t.lineStrong }} />
      <Cap t={t} color={t.muted}>{children}</Cap>
    </div>
  );
}

function MarketingNav({ t }) {
  const links = ['Funktionen', 'So funktioniert’s', 'Sicherheit', 'Preise'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', borderBottom: `1px solid ${t.line}`,
      position: 'sticky', top: 0, zIndex: 5,
      background: t.glass || (t.mode === 'dark' ? 'rgba(13,19,22,0.72)' : 'rgba(248,250,252,0.78)'),
      backdropFilter: 'blur(14px)',
    }}>
      <Logo t={t} size={30} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        {links.map((l) => (
          <span key={l} style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.muted }}>{l}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.ink }}>Anmelden</span>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} size="sm" iconRight="arrowRight">Immobilie bewerten</Btn>
      </div>
    </div>
  );
}

function SiteFooter({ t }) {
  const cols = [
    ['Produkt', ['Bewertung', 'Vergleich', 'Grundrisse', 'Energieausweis', 'Preise']],
    ['Unternehmen', ['Über uns', 'Academy', 'Marktplatz', 'Karriere']],
    ['Rechtliches', ['Impressum', 'Datenschutz', 'AGB', 'Kontakt']],
  ];
  return (
    <div style={{ padding: '56px 56px 40px', borderTop: `1px solid ${t.line}`, background: t.mode === 'dark' ? t.sunken : t.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
        <div style={{ maxWidth: 300 }}>
          <Logo t={t} size={28} />
          <p style={{ fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.6, color: t.muted, marginTop: 16 }}>
            KI-gestützte Immobilienbewertung nach ImmoWertV 2024. Prüfsicher, in Sekunden.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 64 }}>
          {cols.map(([h, items]) => (
            <div key={h}>
              <Cap t={t} color={t.faint}>{h}</Cap>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {items.map((i) => <span key={i} style={{ fontFamily: t.sans, fontSize: 14, color: t.muted }}>{i}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${t.line}`, display: 'flex', justifyContent: 'space-between' }}>
        <Cap t={t} color={t.faint}>© 2026 proplytic.ai</Cap>
        <Cap t={t} color={t.faint}>Entwickelt in Berlin</Cap>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── valuation card (reused in hero & report)
function ValuationCard({ t, w = 420 }) {
  const series = [38, 41, 39, 44, 47, 45, 52, 56, 54, 61, 64, 68];
  return (
    <Card t={t} pad={0} style={{ width: w, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: `1px solid ${t.line}` }}>
        <div style={{ width: 40, height: 40, borderRadius: t.radius, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}>
          <Icon name="building" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14.5, color: t.ink }}>Gärtnerstraße 14, Berlin</div>
          <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>Mehrfamilienhaus · 1992 · 612 m²</div>
        </div>
        <span style={{ fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '4px 8px', borderRadius: 999 }}>ImmoWertV ✓</span>
      </div>
      <div style={{ padding: '22px' }}>
        <Cap t={t} color={t.muted}>Geschätzter Marktwert</Cap>
        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
          1,84 Mio. € <span style={{ color: t.faint, fontSize: 17 }}>– 1,97 Mio. €</span>
        </div>
        <div style={{ marginTop: 18, marginLeft: -2 }}><Sparkline t={t} data={series} w={w - 44} h={62} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[['Bruttorendite', '4,2 %', 'trendingUp'], ['IRR (10 J.)', '6,8 %', 'pie'], ['€/m²', '3.010 €', 'euro']].map(([l, v, ic]) => (
            <div key={l} style={{ padding: 13, background: t.mode === 'dark' ? t.sunken : t.surface2, borderRadius: t.radius, border: `1px solid ${t.line}` }}>
              <Icon name={ic} size={15} color={t.accent} />
              <div style={{ fontFamily: t.sans, fontSize: 11.5, color: t.faint, marginTop: 8 }}>{l}</div>
              <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 16, color: t.ink, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────── LANDING
function LandingPage({ t }) {
  const features = [
    ['trendingUp', 'Marktwert-Spanne', 'Eine belastbare Wertspanne aus aktuellen Vergleichstransaktionen.'],
    ['pie', 'Rendite & IRR', 'Sofortige Rentabilität — Brutto-, Nettorendite und 10-Jahres-IRR.'],
    ['wrench', 'Sanierungsbedarf', 'Kostenschätzung für nötige Modernisierung und CapEx-Planung.'],
    ['mapPin', 'Mietspiegel & Lage', 'Lokale Mietbenchmarks und Lagefaktoren auf einen Blick.'],
    ['compare', 'Comparables', 'Ähnliche Objekte in der Nähe, sortiert und gegenübergestellt.'],
    ['download', 'PDF-Bericht', 'Ein bankfertiges Dossier, exportiert mit einem Klick.'],
  ];
  const steps = [
    ['01', 'mapPin', 'Adresse eingeben', 'Geben Sie die Objektadresse ein — mehr braucht es nicht zum Start.'],
    ['02', 'message', 'Eckdaten bestätigen', 'Unser Assistent fragt die wenigen Details ab, die den Wert beeinflussen.'],
    ['03', 'fileText', 'Ergebnis erhalten', 'Marktwert, Rendite und ein herunterladbarer Bericht in Sekunden.'],
  ];
  const stats = [['15.000+', 'Bewertungen'], ['4,8/5', 'Zufriedenheit'], ['60 Sek.', 'Pro Analyse'], ['5.000+', 'Investoren']];
  const trust = [['shield', 'DSGVO-konform', 'Volle Einhaltung europäischer Datenschutzstandards.'],
    ['eye', 'Anonym nutzen', 'Kein Konto nötig — starten Sie sofort eine Bewertung.'],
    ['lock', 'Nichts gespeichert', 'Ohne Konto werden Ihre Eingaben nie gespeichert.']];

  return (
    <div style={{ width: PAGE_W, background: t.page, color: t.ink, fontFamily: t.sans }}>
      <MarketingNav t={t} />

      {/* HERO */}
      <div style={{ position: 'relative', padding: '76px 56px 84px', overflow: 'hidden' }}>
        <ContourBg t={t} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '6px 13px', borderRadius: 999, border: `1px solid ${t.line}`, background: t.surface, marginBottom: 26 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} />
              <Cap t={t} color={t.muted}>Jetzt bewerten nach ImmoWertV 2024</Cap>
            </div>
            <h1 style={{
              fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 64,
              lineHeight: 1.04, letterSpacing: '-0.025em', margin: 0, color: t.ink,
            }}>
              Immobilien­bewertung,<span style={{ color: t.highlight }}> neu gedacht.</span>
            </h1>
            <p style={{ fontFamily: t.sans, fontSize: 18.5, lineHeight: 1.6, color: t.muted, margin: '22px 0 0', maxWidth: 480 }}>
              Konforme, prüfsichere Bewertungen — KI-gestützt und in sechzig Sekunden geliefert. Von der Adresse zum bankfertigen Bericht.
            </p>
            {/* address bar */}
            <div style={{ display: 'flex', gap: 10, marginTop: 32, padding: 8, background: t.surface, border: `1px solid ${t.lineStrong}`, borderRadius: t.radiusLg, maxWidth: 520 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
                <Icon name="mapPin" size={19} color={t.faint} />
                <span style={{ fontFamily: t.sans, fontSize: 15.5, color: t.faint }}>Objektadresse eingeben…</span>
              </div>
              <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} iconRight="arrowRight">Bewerten</Btn>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 26 }}>
              {[['zap', 'Ergebnis in 60 Sek.'], ['shield', 'ImmoWertV 2024'], ['clock', '24/7 verfügbar']].map(([ic, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={ic} size={16} color={t.accent} />
                  <span style={{ fontFamily: t.sans, fontSize: 13.5, fontWeight: 500, color: t.muted }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            {t.mode !== 'dark' ? (
              <div style={{ position: 'relative', width: 560, height: 470 }}>
                <BuildingArt t={t} maxWidth={560} style={{ position: 'absolute', top: 0, right: -24 }} />
                <div style={{ position: 'absolute', top: 18, right: -8 }}>
                  <Card t={t} pad={13} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: t.highlight }} />
                    <span style={{ fontFamily: t.mono, fontSize: 12, color: t.ink }}>Analysiert in 0:54</span>
                  </Card>
                </div>
                <div style={{ position: 'absolute', left: -28, bottom: 6 }}>
                  <ValuationCard t={t} w={352} />
                </div>
              </div>
            ) : (
              <>
                <div style={{ position: 'absolute', top: -14, right: -10 }}>
                  <Card t={t} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name="sparkles" size={17} color={t.accent} />
                    <span style={{ fontFamily: t.mono, fontSize: 12, color: t.ink }}>Analysiert in 0:54</span>
                  </Card>
                </div>
                <ValuationCard t={t} w={440} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}` }}>
        {stats.map(([v, l], i) => (
          <div key={l} style={{ padding: '34px 40px', borderLeft: i ? `1px solid ${t.line}` : 'none' }}>
            <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em', color: t.ink }}>{v}</div>
            <Cap t={t} color={t.muted} style={{ marginTop: 6, display: 'block' }}>{l}</Cap>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 56px' }}>
        <SectionTag t={t} num="01">Funktionen</SectionTag>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44 }}>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 42, letterSpacing: '-0.02em', margin: 0, maxWidth: 540, lineHeight: 1.1 }}>
            Alles, um souverän zu kalkulieren
          </h2>
          <span style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, maxWidth: 280, textAlign: 'right' }}>Sechs Analyse-Ebenen, ein stimmiges Instrument.</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: `1px solid ${t.line}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
          {features.map(([ic, ti, d], i) => (
            <div key={ti} style={{
              padding: 30, borderRight: (i % 3 !== 2) ? `1px solid ${t.line}` : 'none',
              borderBottom: (i < 3) ? `1px solid ${t.line}` : 'none', background: t.surface,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: t.radius, display: 'grid', placeItems: 'center', background: t.accentSoft, color: t.accent, marginBottom: 20 }}>
                <Icon name={ic} size={21} />
              </div>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 17, color: t.ink, marginBottom: 8 }}>{ti}</div>
              <div style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.6, color: t.muted }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '20px 56px 80px' }}>
        <SectionTag t={t} num="02">Ablauf</SectionTag>
        <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 42, letterSpacing: '-0.02em', margin: '0 0 44px', lineHeight: 1.1 }}>Drei Schritte zu einer belastbaren Zahl</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
          {steps.map(([n, ic, ti, d]) => (
            <div key={n} style={{ position: 'relative' }}>
              <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 13, color: t.accent, marginBottom: 18 }}>{t.key === 'ledger' ? '— ' + n : n}</div>
              <div style={{ width: 56, height: 56, borderRadius: t.radiusLg, display: 'grid', placeItems: 'center', background: t.surface, border: `1px solid ${t.line}`, color: t.accent, marginBottom: 20 }}>
                <Icon name={ic} size={24} />
              </div>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 19, color: t.ink, marginBottom: 8 }}>{ti}</div>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, lineHeight: 1.6, color: t.muted, maxWidth: 280 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT PREVIEW */}
      <div style={{ padding: '80px 56px', background: t.mode === 'dark' ? t.surface : t.surface2, borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <SectionTag t={t} num="03">Ergebnis</SectionTag>
            <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 40, letterSpacing: '-0.02em', margin: '0 0 18px', lineHeight: 1.12 }}>Ein professioneller Bericht, bereit zum Teilen</h2>
            <p style={{ fontFamily: t.sans, fontSize: 16.5, lineHeight: 1.6, color: t.muted, margin: '0 0 28px', maxWidth: 440 }}>
              Ihr komplettes Bewertungsdossier — sofort verfügbar, formatiert für alle, die kritisch nachfragen.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {['Wertspanne mit Min-/Max-Schätzung', 'Alle Kennzahlen auf einer Seite', 'Eine klare Empfehlung für die nächsten Schritte'].map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}><Icon name="check" size={13} stroke={2.4} /></span>
                  <span style={{ fontFamily: t.sans, fontSize: 15, color: t.ink }}>{b}</span>
                </div>
              ))}
            </div>
            <Btn t={t} variant="outline" iconRight="arrowRight">Musterbericht ansehen</Btn>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><ValuationCard t={t} w={440} /></div>
        </div>
      </div>

      {/* TRUST */}
      <div style={{ padding: '80px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><SectionTag t={t} num="04">Vertrauen</SectionTag></div>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 40, letterSpacing: '-0.02em', margin: 0 }}>Ihre Daten bleiben Ihre</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 940, margin: '0 auto' }}>
          {trust.map(([ic, ti, d]) => (
            <div key={ti} style={{ textAlign: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: t.radiusLg, display: 'grid', placeItems: 'center', background: t.surface, border: `1px solid ${t.line}`, color: t.ink, margin: '0 auto 18px' }}><Icon name={ic} size={22} /></div>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 17, color: t.ink, marginBottom: 8 }}>{ti}</div>
              <div style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.6, color: t.muted, maxWidth: 240, margin: '0 auto' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: 'relative', padding: '84px 56px', background: t.mode === 'dark' ? t.sunken : t.ink, overflow: 'hidden' }}>
        {t.key === 'atlas' && <ContourBg t={t} />}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 44, letterSpacing: '-0.02em', margin: '0 0 16px', color: t.mode === 'dark' ? t.ink : t.page }}>
            Jetzt starten — eine Adresse genügt.
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 17, color: t.mode === 'dark' ? t.muted : 'rgba(244,239,230,0.7)', margin: '0 0 36px' }}>Erhalten Sie in etwa einer Minute eine professionelle Wertschätzung.</p>
          <div style={{ display: 'flex', gap: 10, padding: 8, background: t.surface, borderRadius: t.radiusLg, maxWidth: 520, margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
              <Icon name="mapPin" size={19} color={t.faint} />
              <span style={{ fontFamily: t.sans, fontSize: 15.5, color: t.faint }}>Objektadresse eingeben…</span>
            </div>
            <Btn t={t} variant="accent" iconRight="arrowRight" style={t.mode === 'dark' ? {} : { background: t.highlight, color: t.onHighlight }}>Jetzt bewerten</Btn>
          </div>
        </div>
      </div>

      <SiteFooter t={t} />
    </div>
  );
}

// ─────────────────────────────────────────── AUTH SHELL
function AuthFrame({ t, children }) {
  const dark = t.mode === 'dark';
  const panelBg = dark ? t.sunken : t.surface2;
  const tMain = dark ? t.ink : t.ink;
  const tSub = dark ? t.muted : t.muted;
  return (
    <div style={{ width: PAGE_W, height: 860, background: t.page, color: t.ink, fontFamily: t.sans, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* left brand panel */}
      <div style={{ position: 'relative', background: panelBg, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', borderRight: `1px solid ${t.line}` }}>
        <ContourBg t={t} />
        {!dark && <BuildingArt t={t} maxWidth={520} style={{ position: 'absolute', right: -90, top: '42%', transform: 'translateY(-50%)', opacity: 0.96, pointerEvents: 'none' }} />}
        <div style={{ position: 'relative' }}><Logo t={t} size={30} color={dark ? t.page : t.ink} /></div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: t.mono, fontSize: 12, letterSpacing: '.16em', color: t.highlight, marginBottom: 20 }}>PORTFOLIO</div>
          <h2 style={{ fontFamily: t.display, fontWeight: 600, fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0, color: dark ? t.page : tMain, maxWidth: 360 }}>
            Jede Bewertung, sauber geführt an einem Ort.
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 15.5, lineHeight: 1.6, color: dark ? 'rgba(235,241,240,0.66)' : tSub, marginTop: 20, maxWidth: 360 }}>
            Portfoliowert verfolgen, Renditen vergleichen und Berichte exportieren — alles in Ihrem privaten Arbeitsbereich.
          </p>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 30 }}>
          {[['4,2 Mio. €', 'Portfolio'], ['12', 'Objekte'], ['5,8 %', 'Ø Rendite']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: dark ? t.page : t.ink }}>{v}</div>
              <Cap t={t} color={dark ? 'rgba(235,241,240,0.5)' : t.faint}>{l}</Cap>
            </div>
          ))}
        </div>
      </div>
      {/* right form */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ width: 400 }}>{children}</div>
      </div>
    </div>
  );
}

function LoginPage({ t }) {
  return (
    <AuthFrame t={t}>
      <div style={{ marginBottom: 30 }}>
        <Mark t={t} size={40} />
        <h1 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>Willkommen zurück</h1>
        <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>Anmelden, um Ihre Bewertungen synchron zu halten.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field t={t} label="E-Mail" value="alex@kessler.de" icon="mail" />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <Cap t={t} color={t.muted}>Passwort</Cap>
            <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.highlight, fontWeight: 500 }}>Vergessen?</span>
          </div>
          <Field t={t} value="" placeholder="••••••••" icon="lock" type="password" />
        </div>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} full style={{ marginTop: 6, height: 48 }}>Anmelden</Btn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0' }}>
          <span style={{ flex: 1, height: 1, background: t.line }} />
          <Cap t={t} color={t.faint}>oder</Cap>
          <span style={{ flex: 1, height: 1, background: t.line }} />
        </div>
        <Btn t={t} variant="outline" full style={{ height: 48 }}>Mit Google fortfahren</Btn>
        <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 8 }}>
          Noch kein Konto? <span style={{ color: t.highlight, fontWeight: 600 }}>Jetzt erstellen</span>
        </p>
      </div>
    </AuthFrame>
  );
}

function RegisterPage({ t }) {
  return (
    <AuthFrame t={t}>
      <div style={{ marginBottom: 26 }}>
        <Mark t={t} size={40} />
        <h1 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>Konto erstellen</h1>
        <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>Kostenlos starten — bis zu 10 gespeicherte Bewertungen.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field t={t} label="Vorname" value="Alex" icon="user" />
          <Field t={t} label="Nachname" value="Kessler" />
        </div>
        <Field t={t} label="E-Mail" value="alex@kessler.de" icon="mail" />
        <Field t={t} label="Passwort" value="" placeholder="Passwort wählen" icon="lock" type="password" />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 2 }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${t.lineStrong}`, background: t.accent, color: t.onAccent, display: 'grid', placeItems: 'center', flex: '0 0 auto', marginTop: 1 }}><Icon name="check" size={12} stroke={3} /></span>
          <span style={{ fontFamily: t.sans, fontSize: 12.5, lineHeight: 1.5, color: t.muted }}>Ich stimme den AGB und der Datenschutzerklärung zu.</span>
        </div>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} full style={{ marginTop: 4, height: 48 }}>Konto erstellen</Btn>
        <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 4 }}>
          Bereits registriert? <span style={{ color: t.highlight, fontWeight: 600 }}>Anmelden</span>
        </p>
      </div>
    </AuthFrame>
  );
}

// ─────────────────────────────────────────── APP SHELL (sidebar + topbar)
function AppShell({ t, active, title, action, children, h = 1000 }) {
  const nav = [
    ['Portfolio', [['grid', 'Dashboard'], ['fileText', 'Bewertungen'], ['compare', 'Vergleich']]],
    ['Werkzeuge', [['building2', 'Neue Bewertung'], ['ruler', 'Grundrisse'], ['zap', 'Energieausweis'], ['user', 'Mietlisten'], ['wrench', 'Sanierung']]],
    ['Mehr', [['star', 'Academy'], ['layers', 'Marktplatz']]],
  ];
  return (
    <div style={{ width: PAGE_W, height: h, background: t.page, color: t.ink, fontFamily: t.sans, display: 'grid', gridTemplateColumns: '252px 1fr' }}>
      {/* sidebar */}
      <div style={{ background: t.mode === 'dark' ? t.sunken : t.surface, borderRight: `1px solid ${t.line}`, padding: '22px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '4px 8px 24px' }}><Logo t={t} size={27} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {nav.map(([grp, items]) => (
            <div key={grp}>
              <div style={{ padding: '0 8px 9px' }}><Cap t={t} color={t.faint}>{grp}</Cap></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(([ic, l]) => {
                  const on = l === active;
                  return (
                    <div key={l} style={{
                      display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: t.radius,
                      background: on ? t.highlightSoft : 'transparent',
                      color: on ? t.highlight : t.muted,
                      fontWeight: on ? 600 : 500,
                    }}>
                      <Icon name={ic} size={18} color={on ? t.highlight : t.faint} />
                      <span style={{ fontFamily: t.sans, fontSize: 14 }}>{l}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px', borderTop: `1px solid ${t.line}` }}>
          <Avatar t={t} initials="AK" size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.sans, fontSize: 13, fontWeight: 600, color: t.ink }}>Alex Kessler</div>
            <div style={{ fontFamily: t.sans, fontSize: 11.5, color: t.faint }}>Kostenlos-Tarif</div>
          </div>
        </div>
      </div>
      {/* main */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: `1px solid ${t.line}`, background: t.glass || (t.mode === 'dark' ? 'rgba(13,19,22,0.6)' : 'rgba(248,250,252,0.6)') }}>
          <div>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: t.radius, border: `1px solid ${t.line}`, display: 'grid', placeItems: 'center', color: t.muted }}><Icon name="bell" size={18} /></div>
            {action}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

function DashboardPage({ t }) {
  const rows = [
    ['Gärtnerstraße 14', 'Berlin', 'Mehrfamilienhaus', '1992', '612 m²', '1,84 Mio. €', '4,2 %'],
    ['Lindenallee 7', 'Hamburg', 'Eigentumswohnung', '2008', '94 m²', '420 Tsd. €', '3,6 %'],
    ['Sonnenweg 22', 'München', 'Einfamilienhaus', '1976', '180 m²', '980 Tsd. €', '2,9 %'],
    ['Hafenstraße 3', 'Bremen', 'Gemischt genutzt', '1965', '740 m²', '1,21 Mio. €', '5,4 %'],
  ];
  return (
    <AppShell t={t} active="Dashboard" h={1040}
      title={<div>
        <Cap t={t} color={t.muted}>Willkommen zurück</Cap>
        <div style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>Alex’ Portfolio</div>
      </div>}
      action={<Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} size="sm" icon="plus">Neue Bewertung</Btn>}>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%', boxSizing: 'border-box' }}>
        {/* stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <Stat t={t} label="Objekte" value="12" sub="Bewertete Immobilien" icon="building" />
          <Stat t={t} label="Portfoliowert" value="4,2 Mio. €" sub="Summierte Marktwerte" icon="euro" highlight />
          <Stat t={t} label="Ø Rendite" value="5,8 %" sub="Brutto, gewichtet" icon="percent" />
          <Stat t={t} label="Pro Objekt" value="352 Tsd. €" sub="Durchschnittswert" icon="bars" />
        </div>
        {/* charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <Card t={t}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Portfoliowert im Zeitverlauf</div>
              <Cap t={t} color={t.faint}>Letzte 12 Monate</Cap>
            </div>
            <Sparkline t={t} data={[28, 30, 33, 31, 36, 40, 38, 42, 45, 44, 49, 53]} w={680} h={150} />
          </Card>
          <Card t={t}>
            <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Nach Objektart</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Donut t={t} segments={[{ v: 5, c: t.accent }, { v: 3, c: t.data }, { v: 2, c: t.pos }, { v: 2, c: t.faint }]} size={120} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[['Mehrfamilienhaus', t.accent], ['Eigentumswohnung', t.data], ['Einfamilienhaus', t.pos], ['Gemischt genutzt', t.faint]].map(([l, c]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
                    <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.muted }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        {/* recent table */}
        <Card t={t} pad={0} style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: `1px solid ${t.line}` }}>
            <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Letzte Bewertungen</div>
            <span style={{ fontFamily: t.sans, fontSize: 13, color: t.highlight, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>Alle ansehen <Icon name="arrowRight" size={14} /></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}` }}>
            {['Adresse', 'Stadt', 'Art', 'Baujahr', 'Fläche', 'Wert', 'Rendite'].map((h) => <Cap key={h} t={t} color={t.faint}>{h}</Cap>)}
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr', padding: '15px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${t.line}` : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: t.radius, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}><Icon name="building" size={15} /></div>
                <span style={{ fontFamily: t.sans, fontSize: 14, fontWeight: 600, color: t.ink }}>{r[0]}</span>
              </div>
              <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{r[1]}</span>
              <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{r[2]}</span>
              <span style={{ fontFamily: t.mono, fontSize: 13.5, color: t.muted }}>{r[3]}</span>
              <span style={{ fontFamily: t.mono, fontSize: 13.5, color: t.muted }}>{r[4]}</span>
              <span style={{ fontFamily: t.mono, fontSize: 14, fontWeight: 600, color: t.ink }}>{r[5]}</span>
              <span style={{ fontFamily: t.mono, fontSize: 13.5, color: t.pos }}>{r[6]}</span>
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}

Object.assign(window, { LandingPage, LoginPage, RegisterPage, DashboardPage, AppShell, PAGE_W, SiteFooter, MarketingNav });
