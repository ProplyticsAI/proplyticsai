import Head from 'next/head';
import t from '../components/brand';
import { Cap, Btn, Card, MapMini } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';

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

const band = 0.62;

export default function AnalysePage() {
  return (
    <>
      <Head><title>Neue Bewertung — proplytic.ai</title></Head>
      <AppShell
        t={t}
        active="Neue Bewertung"
        title={
          <div>
            <Cap t={t} color={t.muted}>Neue Analyse</Cap>
            <div style={{ fontFamily: t.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>
              Gärtnerstraße 14, Berlin
            </div>
          </div>
        }
        action={<Btn t={t} variant="outline" size="sm" icon="download">PDF exportieren</Btn>}
      >
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* mode selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {modes.map(([ic, ti, d, on]) => (
              <div key={ti} style={{
                padding: '16px 18px', borderRadius: t.radiusLg, display: 'flex', alignItems: 'center', gap: 13,
                background: on ? t.highlightSoft : t.surface,
                border: `1px solid ${on ? t.highlight : t.line}`,
                cursor: 'pointer',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: t.radius, display: 'grid', placeItems: 'center', background: on ? t.highlight : t.surface2, color: on ? t.onHighlight : t.accent, flexShrink: 0 }}>
                  <Icon name={ic} size={19} />
                </div>
                <div>
                  <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14.5, color: t.ink }}>{ti}</div>
                  <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint }}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 3-column workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 300px', gap: 16 }}>
            {/* chat wizard */}
            <Card t={t} pad={0} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: `1px solid ${t.line}` }}>
                <div style={{ width: 30, height: 30, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}>
                  <Icon name="sparkles" size={16} />
                </div>
                <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14 }}>Bewertungs-Assistent</div>
              </div>
              <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chat.map(([who, msg], i) => (
                  <div key={i} style={{ alignSelf: who === 'u' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{
                      fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.5, padding: '10px 13px', borderRadius: t.radiusLg,
                      background: who === 'u' ? t.highlight : t.surface2,
                      color: who === 'u' ? t.onHighlight : t.ink,
                      borderTopRightRadius: who === 'u' ? 4 : t.radiusLg,
                      borderTopLeftRadius: who === 'u' ? t.radiusLg : 4,
                    }}>{msg}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, borderTop: `1px solid ${t.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 0 14px', height: 44, borderRadius: t.radius, border: `1px solid ${t.line}`, background: t.surface2 }}>
                  <span style={{ flex: 1, fontFamily: t.sans, fontSize: 13.5, color: t.faint }}>Antwort eingeben…</span>
                  <div style={{ width: 32, height: 32, borderRadius: t.radius - 1, background: t.primaryBg, color: t.primaryFg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="arrowRight" size={16} stroke={2.2} />
                  </div>
                </div>
              </div>
            </Card>

            {/* results */}
            <Card t={t} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Cap t={t} color={t.muted}>Geschätzter Marktwert</Cap>
                  <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 46, letterSpacing: '-0.025em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
                    1,84 Mio. €
                  </div>
                  <div style={{ fontFamily: t.sans, fontSize: 13.5, color: t.faint, marginTop: 2 }}>
                    Konfidenzband 1,78 Mio. € – 1,97 Mio. €
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '6px 11px', borderRadius: 999 }}>
                  <Icon name="check" size={12} stroke={2.4} /> ImmoWertV 2024
                </span>
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
                  <div key={l} style={{ padding: 15, borderRadius: t.radius, background: t.surface2, border: `1px solid ${t.line}` }}>
                    <Icon name={ic} size={15} color={t.accent} />
                    <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint, marginTop: 9 }}>{l}</div>
                    <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 18, color: t.ink, marginTop: 3 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* breakdown */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${t.line}` }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.line}` }}>
                  <Cap t={t} color={t.muted}>Comparables</Cap>
                </div>
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
    </>
  );
}
