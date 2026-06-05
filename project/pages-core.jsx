// pages-core.jsx — Landing, Login, Register, Dashboard.
// Theme-driven (`t` prop). Shared chrome: MarketingNav, SiteFooter, AppShell.
// Exports to window: LandingPage, LoginPage, RegisterPage, DashboardPage.

const PAGE_W = 1320;

// ─────────────────────────────────────────── shared bits
function SectionTag({ t, num, children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{
        fontFamily: t.mono, fontSize: 12, fontWeight: 600, color: t.accent,
        letterSpacing: '.08em',
      }}>{t.key === 'ledger' ? '§ ' + num : num + ' /'}</span>
      <span style={{ width: 26, height: 1, background: t.lineStrong }} />
      <Cap t={t} color={t.muted}>{children}</Cap>
    </div>
  );
}

function MarketingNav({ t }) {
  const links = ['Features', 'How it works', 'Security', 'Pricing'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', borderBottom: `1px solid ${t.line}`,
      position: 'sticky', top: 0, zIndex: 5,
      background: t.mode === 'dark' ? 'rgba(13,19,22,0.72)' : 'rgba(238,232,221,0.72)',
      backdropFilter: 'blur(14px)',
    }}>
      <Logo t={t} size={30} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        {links.map((l) => (
          <span key={l} style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.muted }}>{l}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: t.sans, fontSize: 14.5, fontWeight: 500, color: t.ink }}>Sign in</span>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} size="sm" iconRight="arrowRight">Analyze a property</Btn>
      </div>
    </div>
  );
}

function SiteFooter({ t }) {
  const cols = [
    ['Product', ['Valuation', 'Comparison', 'Floor plans', 'Energy report', 'Pricing']],
    ['Company', ['About', 'Academy', 'Marketplace', 'Careers']],
    ['Legal', ['Imprint', 'Privacy', 'Terms', 'Contact']],
  ];
  return (
    <div style={{ padding: '56px 56px 40px', borderTop: `1px solid ${t.line}`, background: t.mode === 'dark' ? t.sunken : t.surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
        <div style={{ maxWidth: 300 }}>
          <Logo t={t} size={28} />
          <p style={{ fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.6, color: t.muted, marginTop: 16 }}>
            AI-assisted real-estate valuation under ImmoWertV 2024. Audit-ready, in seconds.
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
        <Cap t={t} color={t.faint}>© 2026 Proplytics</Cap>
        <Cap t={t} color={t.faint}>Made in Berlin</Cap>
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
          <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>Multi-family · 1992 · 612 m²</div>
        </div>
        <span style={{ fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '4px 8px', borderRadius: 999 }}>ImmoWertV ✓</span>
      </div>
      <div style={{ padding: '22px' }}>
        <Cap t={t} color={t.muted}>Estimated market value</Cap>
        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
          €1.84M <span style={{ color: t.faint, fontSize: 17 }}>– €1.97M</span>
        </div>
        <div style={{ marginTop: 18, marginLeft: -2 }}><Sparkline t={t} data={series} w={w - 44} h={62} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[['Gross yield', '4.2%', 'trendingUp'], ['IRR (10y)', '6.8%', 'pie'], ['€/m²', '€3,010', 'euro']].map(([l, v, ic]) => (
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
    ['trendingUp', 'Market value range', 'A defensible value band drawn from live comparable transactions.'],
    ['pie', 'Yield & IRR', 'Instant profitability — gross yield, net yield and 10-year IRR.'],
    ['wrench', 'Renovation need', 'Cost estimate for required modernisation and CapEx planning.'],
    ['mapPin', 'Rent index & location', 'Local rent benchmarks and location factors at a glance.'],
    ['compare', 'Comparables', 'Similar properties nearby, ranked and side-by-side.'],
    ['download', 'PDF report', 'A bank-ready dossier, exported in a single click.'],
  ];
  const steps = [
    ['01', 'mapPin', 'Enter the address', 'Type the property address — nothing else required to begin.'],
    ['02', 'message', 'Confirm key facts', 'Our assistant asks for the few details that move the value.'],
    ['03', 'fileText', 'Get your result', 'Market value, yield and a downloadable report in seconds.'],
  ];
  const stats = [['15,000+', 'Valuations'], ['4.8/5', 'Satisfaction'], ['60s', 'Per analysis'], ['5,000+', 'Investors']];
  const trust = [['shield', 'GDPR-compliant', 'Full adherence to European data-protection standards.'],
    ['eye', 'Use anonymously', 'No account needed — start a valuation immediately.'],
    ['lock', 'Nothing stored', 'Without an account, your inputs are never retained.']];

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
              <Cap t={t} color={t.muted}>Now valuing under ImmoWertV 2024</Cap>
            </div>
            <h1 style={{
              fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 64,
              lineHeight: 1.04, letterSpacing: '-0.025em', margin: 0, color: t.ink,
            }}>
              Property valuation,{t.key === 'ledger'
                ? <span style={{ fontStyle: 'italic', color: t.accent }}> reimagined.</span>
                : <span style={{ color: t.accent }}> reimagined.</span>}
            </h1>
            <p style={{ fontFamily: t.sans, fontSize: 18.5, lineHeight: 1.6, color: t.muted, margin: '22px 0 0', maxWidth: 480 }}>
              Compliant, audit-ready valuations — AI-assisted and delivered in sixty seconds. From address to bank-ready report.
            </p>
            {/* address bar */}
            <div style={{ display: 'flex', gap: 10, marginTop: 32, padding: 8, background: t.surface, border: `1px solid ${t.lineStrong}`, borderRadius: t.radiusLg, maxWidth: 520 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
                <Icon name="mapPin" size={19} color={t.faint} />
                <span style={{ fontFamily: t.sans, fontSize: 15.5, color: t.faint }}>Enter a property address…</span>
              </div>
              <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} iconRight="arrowRight">Value it</Btn>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 26 }}>
              {[['zap', '60-second result'], ['shield', 'ImmoWertV 2024'], ['clock', '24/7 available']].map(([ic, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={ic} size={16} color={t.accent} />
                  <span style={{ fontFamily: t.sans, fontSize: 13.5, fontWeight: 500, color: t.muted }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, right: -10 }}>
              <Card t={t} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="sparkles" size={17} color={t.accent} />
                <span style={{ fontFamily: t.mono, fontSize: 12, color: t.ink }}>Analysed in 0:54</span>
              </Card>
            </div>
            <ValuationCard t={t} w={440} />
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
        <SectionTag t={t} num="01">Capabilities</SectionTag>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44 }}>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 42, letterSpacing: '-0.02em', margin: 0, maxWidth: 540, lineHeight: 1.1 }}>
            Everything you need to underwrite with confidence
          </h2>
          <span style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, maxWidth: 280, textAlign: 'right' }}>Six analytical layers, one coherent instrument.</span>
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
        <SectionTag t={t} num="02">Workflow</SectionTag>
        <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 42, letterSpacing: '-0.02em', margin: '0 0 44px', lineHeight: 1.1 }}>Three steps to a number you can defend</h2>
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
            <SectionTag t={t} num="03">Deliverable</SectionTag>
            <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 40, letterSpacing: '-0.02em', margin: '0 0 18px', lineHeight: 1.12 }}>A professional report, ready to share</h2>
            <p style={{ fontFamily: t.sans, fontSize: 16.5, lineHeight: 1.6, color: t.muted, margin: '0 0 28px', maxWidth: 440 }}>
              Your complete valuation dossier — available instantly, formatted for the people who ask the hard questions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {['Value band with min / max estimate', 'Every key metric on a single page', 'A clear recommendation for next steps'].map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}><Icon name="check" size={13} stroke={2.4} /></span>
                  <span style={{ fontFamily: t.sans, fontSize: 15, color: t.ink }}>{b}</span>
                </div>
              ))}
            </div>
            <Btn t={t} variant="outline" iconRight="arrowRight">See a sample report</Btn>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><ValuationCard t={t} w={440} /></div>
        </div>
      </div>

      {/* TRUST */}
      <div style={{ padding: '80px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><SectionTag t={t} num="04">Trust</SectionTag></div>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 40, letterSpacing: '-0.02em', margin: 0 }}>Your data stays yours</h2>
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
            Start now — an address is all it takes.
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 17, color: t.mode === 'dark' ? t.muted : 'rgba(244,239,230,0.7)', margin: '0 0 36px' }}>Get a professional value estimate in about a minute.</p>
          <div style={{ display: 'flex', gap: 10, padding: 8, background: t.surface, borderRadius: t.radiusLg, maxWidth: 520, margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
              <Icon name="mapPin" size={19} color={t.faint} />
              <span style={{ fontFamily: t.sans, fontSize: 15.5, color: t.faint }}>Enter a property address…</span>
            </div>
            <Btn t={t} variant="accent" iconRight="arrowRight">Value it now</Btn>
          </div>
        </div>
      </div>

      <SiteFooter t={t} />
    </div>
  );
}

// ─────────────────────────────────────────── AUTH SHELL
function AuthFrame({ t, children }) {
  return (
    <div style={{ width: PAGE_W, height: 860, background: t.page, color: t.ink, fontFamily: t.sans, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* left brand panel */}
      <div style={{ position: 'relative', background: t.mode === 'dark' ? t.sunken : t.ink, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
        <ContourBg t={t} />
        <div style={{ position: 'relative' }}><Logo t={t} size={30} color={t.mode === 'dark' ? t.ink : t.page} /></div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: t.mono, fontSize: 12, letterSpacing: '.16em', color: t.accent, marginBottom: 20 }}>{t.key === 'ledger' ? '§ PORTFOLIO' : 'PORTFOLIO'}</div>
          <h2 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0, color: t.mode === 'dark' ? t.ink : t.page, maxWidth: 380 }}>
            Every valuation you run, kept in one disciplined ledger.
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 15.5, lineHeight: 1.6, color: t.mode === 'dark' ? t.muted : 'rgba(244,239,230,0.66)', marginTop: 20, maxWidth: 380 }}>
            Track portfolio value, compare yields and export reports — all from your private workspace.
          </p>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 30 }}>
          {[['€4.2M', 'Portfolio'], ['12', 'Objects'], ['5.8%', 'Avg yield']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: t.mode === 'dark' ? t.ink : t.page }}>{v}</div>
              <Cap t={t} color={t.mode === 'dark' ? t.faint : 'rgba(244,239,230,0.5)'}>{l}</Cap>
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
        <h1 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>Welcome back</h1>
        <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>Sign in to keep your valuations in sync.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field t={t} label="Email" value="alex@kessler.de" icon="mail" />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <Cap t={t} color={t.muted}>Password</Cap>
            <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.accent, fontWeight: 500 }}>Forgot?</span>
          </div>
          <Field t={t} value="" placeholder="••••••••" icon="lock" type="password" />
        </div>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} full style={{ marginTop: 6, height: 48 }}>Sign in</Btn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0' }}>
          <span style={{ flex: 1, height: 1, background: t.line }} />
          <Cap t={t} color={t.faint}>or</Cap>
          <span style={{ flex: 1, height: 1, background: t.line }} />
        </div>
        <Btn t={t} variant="outline" full style={{ height: 48 }}>Continue with Google</Btn>
        <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 8 }}>
          No account yet? <span style={{ color: t.accent, fontWeight: 600 }}>Create one</span>
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
        <h1 style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>Create your account</h1>
        <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>Free to start — up to 10 saved valuations.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field t={t} label="First name" value="Alex" icon="user" />
          <Field t={t} label="Last name" value="Kessler" />
        </div>
        <Field t={t} label="Email" value="alex@kessler.de" icon="mail" />
        <Field t={t} label="Password" value="" placeholder="Choose a password" icon="lock" type="password" />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 2 }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${t.lineStrong}`, background: t.accent, color: t.onAccent, display: 'grid', placeItems: 'center', flex: '0 0 auto', marginTop: 1 }}><Icon name="check" size={12} stroke={3} /></span>
          <span style={{ fontFamily: t.sans, fontSize: 12.5, lineHeight: 1.5, color: t.muted }}>I agree to the Terms of Service and Privacy Policy.</span>
        </div>
        <Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} full style={{ marginTop: 4, height: 48 }}>Create account</Btn>
        <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 4 }}>
          Already registered? <span style={{ color: t.accent, fontWeight: 600 }}>Sign in</span>
        </p>
      </div>
    </AuthFrame>
  );
}

// ─────────────────────────────────────────── APP SHELL (sidebar + topbar)
function AppShell({ t, active, title, action, children, h = 1000 }) {
  const nav = [
    ['Portfolio', [['grid', 'Dashboard'], ['fileText', 'Valuations'], ['compare', 'Comparison']]],
    ['Tools', [['building2', 'New valuation'], ['ruler', 'Floor plans'], ['zap', 'Energy report'], ['user', 'Tenant lists'], ['wrench', 'Renovation']]],
    ['More', [['star', 'Academy'], ['layers', 'Marketplace']]],
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
                      background: on ? (t.mode === 'dark' ? t.accentSoft : t.accentSoft) : 'transparent',
                      color: on ? (t.mode === 'dark' ? t.accent : t.accentText || t.accent) : t.muted,
                      fontWeight: on ? 600 : 500,
                    }}>
                      <Icon name={ic} size={18} color={on ? t.accent : t.faint} />
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
            <div style={{ fontFamily: t.sans, fontSize: 11.5, color: t.faint }}>Free plan</div>
          </div>
        </div>
      </div>
      {/* main */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: `1px solid ${t.line}`, background: t.mode === 'dark' ? 'rgba(13,19,22,0.6)' : 'rgba(238,232,221,0.5)' }}>
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
    ['Gärtnerstraße 14', 'Berlin', 'Multi-family', '1992', '612 m²', '€1.84M', '4.2%'],
    ['Lindenallee 7', 'Hamburg', 'Apartment', '2008', '94 m²', '€420K', '3.6%'],
    ['Sonnenweg 22', 'Munich', 'Single-family', '1976', '180 m²', '€980K', '2.9%'],
    ['Hafenstraße 3', 'Bremen', 'Mixed-use', '1965', '740 m²', '€1.21M', '5.4%'],
  ];
  return (
    <AppShell t={t} active="Dashboard" h={1040}
      title={<div>
        <Cap t={t} color={t.muted}>Welcome back</Cap>
        <div style={{ fontFamily: t.display, fontWeight: t.key === 'atlas' ? 600 : 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>Alex's portfolio</div>
      </div>}
      action={<Btn t={t} variant={t.key === 'atlas' ? 'accent' : 'primary'} size="sm" icon="plus">New valuation</Btn>}>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%', boxSizing: 'border-box' }}>
        {/* stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <Stat t={t} label="Objects" value="12" sub="Valued properties" icon="building" />
          <Stat t={t} label="Portfolio value" value="€4.2M" sub="Summed market values" icon="euro" highlight />
          <Stat t={t} label="Avg yield" value="5.8%" sub="Gross, weighted" icon="percent" />
          <Stat t={t} label="Per object" value="€352K" sub="Average value" icon="bars" />
        </div>
        {/* charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <Card t={t}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Portfolio value over time</div>
              <Cap t={t} color={t.faint}>Last 12 months</Cap>
            </div>
            <Sparkline t={t} data={[28, 30, 33, 31, 36, 40, 38, 42, 45, 44, 49, 53]} w={680} h={150} />
          </Card>
          <Card t={t}>
            <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>By property type</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Donut t={t} segments={[{ v: 5, c: t.accent }, { v: 3, c: t.data }, { v: 2, c: t.pos }, { v: 2, c: t.faint }]} size={120} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[['Multi-family', t.accent], ['Apartment', t.data], ['Single-family', t.pos], ['Mixed-use', t.faint]].map(([l, c]) => (
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
            <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Recent valuations</div>
            <span style={{ fontFamily: t.sans, fontSize: 13, color: t.accent, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>View all <Icon name="arrowRight" size={14} /></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}` }}>
            {['Address', 'City', 'Type', 'Year', 'Area', 'Value', 'Yield'].map((h) => <Cap key={h} t={t} color={t.faint}>{h}</Cap>)}
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
