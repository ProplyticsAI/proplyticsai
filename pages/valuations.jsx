import Head from 'next/head';
import Link from 'next/link';
import t from '../components/brand';
import { Cap, Btn, Card, MapMini } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';

const items = [
  ['Gärtnerstraße 14', 'Berlin', 'Mehrfamilienhaus', '612 m²', '1992', '1,84 Mio. €', '4,2 %'],
  ['Hafenstraße 3', 'Bremen', 'Gemischt genutzt', '740 m²', '1965', '1,21 Mio. €', '5,4 %'],
  ['Sonnenweg 22', 'München', 'Einfamilienhaus', '180 m²', '1976', '980 Tsd. €', '2,9 %'],
  ['Lindenallee 7', 'Hamburg', 'Eigentumswohnung', '94 m²', '2008', '420 Tsd. €', '3,6 %'],
  ['Marktplatz 5', 'Leipzig', 'Gemischt genutzt', '520 m²', '1958', '870 Tsd. €', '6,1 %'],
  ['Rosenweg 11', 'Köln', 'Einfamilienhaus', '210 m²', '1989', '1,05 Mio. €', '3,1 %'],
];

const chips = ['Alle Arten', 'Mehrfamilienhaus', 'Eigentumswohnung', 'Einfamilienhaus', 'Gemischt genutzt'];

export default function ValuationsPage() {
  return (
    <>
      <Head><title>Bewertungen — proplytic.ai</title></Head>
      <AppShell
        t={t}
        active="Bewertungen"
        title={
          <div>
            <Cap t={t} color={t.muted}>Portfolio</Cap>
            <div style={{ fontFamily: t.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>
              Alle Bewertungen
            </div>
          </div>
        }
        action={
          <Link href="/analyse">
            <Btn t={t} variant="primary" size="sm" icon="plus">Neue Bewertung</Btn>
          </Link>
        }
      >
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
                  color: i === 0 ? t.highlight : t.muted,
                  border: `1px solid ${i === 0 ? t.highlight : t.line}`,
                  cursor: 'pointer',
                }}>{c}</span>
              ))}
              <div style={{ width: 42, height: 42, borderRadius: t.radius, border: `1px solid ${t.line}`, display: 'grid', placeItems: 'center', color: t.muted, marginLeft: 4, cursor: 'pointer' }}>
                <Icon name="filter" size={17} />
              </div>
            </div>
          </div>

          {/* summary line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '4px 2px' }}>
            <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
              <strong style={{ color: t.ink }}>6</strong> Bewertungen
            </span>
            <span style={{ width: 1, height: 14, background: t.line }} />
            <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
              Gesamt <strong style={{ color: t.ink, fontFamily: t.mono }}>6,37 Mio. €</strong>
            </span>
            <span style={{ width: 1, height: 14, background: t.line }} />
            <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
              Ø Rendite <strong style={{ color: t.pos, fontFamily: t.mono }}>4,2 %</strong>
            </span>
          </div>

          {/* cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {items.map((it, i) => (
              <Card t={t} key={i} pad={0} style={{ overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                  <MapMini t={t} h={120} pin />
                  <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: t.mono, fontSize: 10.5, color: t.surface, background: 'rgba(25,27,28,.78)', padding: '4px 8px', borderRadius: 999 }}>
                    {it[6]} Rendite
                  </span>
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
                      <span key={m} style={{ fontFamily: t.sans, fontSize: 11.5, color: t.muted, background: t.surface2, padding: '4px 9px', borderRadius: 999, border: `1px solid ${t.line}` }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.line}` }}>
                    <div>
                      <Cap t={t} color={t.faint}>Marktwert</Cap>
                      <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: t.ink, marginTop: 3 }}>{it[5]}</div>
                    </div>
                    <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.pos, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="trendingUp" size={13} color={t.pos} />{it[6]}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    </>
  );
}
