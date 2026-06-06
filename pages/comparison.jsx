import Head from 'next/head';
import t from '../components/brand';
import { Cap, Btn, Card, MiniRadar } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';

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

const best = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 };

export default function ComparisonPage() {
  return (
    <>
      <Head><title>Vergleich — proplytic.ai</title></Head>
      <AppShell
        t={t}
        active="Vergleich"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="compare" size={22} color={t.accent} />
            <div style={{ fontFamily: t.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em' }}>Objektvergleich</div>
            <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>3 Objekte</span>
          </div>
        }
        action={<Btn t={t} variant="outline" size="sm" icon="plus">Objekt hinzufügen</Btn>}
      >
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* object cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {objs.map((o) => (
              <Card t={t} key={o.a}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: t.radius, background: t.accentSoft, color: o.col, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="building" size={21} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15.5, color: t.ink }}>{o.a}</div>
                    <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>{o.c}</div>
                  </div>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: o.col, marginTop: 4, flexShrink: 0 }} />
                </div>
                <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>{o.type}</span>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18 }}>
                  <div>
                    <Cap t={t} color={t.faint}>Marktwert</Cap>
                    <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 24, color: o.col, marginTop: 4 }}>{o.val}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Cap t={t} color={t.faint}>Rendite</Cap>
                    <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 16, color: t.pos, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="trendingUp" size={13} color={t.pos} />{o.yld}
                    </div>
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
              <div style={{ display: 'grid', placeItems: 'center', marginTop: 10 }}>
                <MiniRadar t={t} series={radar} w={290} h={250} />
              </div>
            </Card>
            <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}`, fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>
                Detaillierter Vergleich
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}`, background: t.surface2 }}>
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
    </>
  );
}
