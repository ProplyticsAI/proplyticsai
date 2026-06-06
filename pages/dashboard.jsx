import Head from 'next/head';
import Link from 'next/link';
import t from '../components/brand';
import { Cap, Btn, Card, Stat, Sparkline, Donut } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';

const rows = [
  ['Gärtnerstraße 14', 'Berlin', 'Mehrfamilienhaus', '1992', '612 m²', '1,84 Mio. €', '4,2 %'],
  ['Lindenallee 7', 'Hamburg', 'Eigentumswohnung', '2008', '94 m²', '420 Tsd. €', '3,6 %'],
  ['Sonnenweg 22', 'München', 'Einfamilienhaus', '1976', '180 m²', '980 Tsd. €', '2,9 %'],
  ['Hafenstraße 3', 'Bremen', 'Gemischt genutzt', '1965', '740 m²', '1,21 Mio. €', '5,4 %'],
];

export default function DashboardPage() {
  return (
    <>
      <Head><title>Dashboard — proplytic.ai</title></Head>
      <AppShell
        t={t}
        active="Dashboard"
        title={
          <div>
            <Cap t={t} color={t.muted}>Willkommen zurück</Cap>
            <div style={{ fontFamily: t.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>
              Alex' Portfolio
            </div>
          </div>
        }
        action={
          <Link href="/analyse">
            <Btn t={t} variant="primary" size="sm" icon="plus">Neue Bewertung</Btn>
          </Link>
        }
      >
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                      <span style={{ width: 9, height: 9, borderRadius: 2, background: c, flexShrink: 0 }} />
                      <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.muted }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* recent table */}
          <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: `1px solid ${t.line}` }}>
              <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Letzte Bewertungen</div>
              <Link href="/valuations" style={{ fontFamily: t.sans, fontSize: 13, color: t.highlight, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Alle ansehen <Icon name="arrowRight" size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}` }}>
              {['Adresse', 'Stadt', 'Art', 'Baujahr', 'Fläche', 'Wert', 'Rendite'].map((h) => (
                <Cap key={h} t={t} color={t.faint}>{h}</Cap>
              ))}
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr',
                padding: '15px 22px', borderBottom: i < rows.length - 1 ? `1px solid ${t.line}` : 'none',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: t.radius, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="building" size={15} />
                  </div>
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
    </>
  );
}
