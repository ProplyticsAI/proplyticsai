import { Card, Cap, Sparkline } from './primitives';
import Icon from './icons';

export default function ValuationCard({ t, w = 420 }) {
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
        <span style={{ fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '4px 8px', borderRadius: 999 }}>
          ImmoWertV ✓
        </span>
      </div>
      <div style={{ padding: 22 }}>
        <Cap t={t} color={t.muted}>Geschätzter Marktwert</Cap>
        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 34, letterSpacing: '-0.02em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
          1,84 Mio. € <span style={{ color: t.faint, fontSize: 17 }}>– 1,97 Mio. €</span>
        </div>
        <div style={{ marginTop: 18, marginLeft: -2 }}>
          <Sparkline t={t} data={series} w={w - 44} h={62} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[['Bruttorendite', '4,2 %', 'trendingUp'], ['IRR (10 J.)', '6,8 %', 'pie'], ['€/m²', '3.010 €', 'euro']].map(([l, v, ic]) => (
            <div key={l} style={{ padding: 13, background: t.surface2, borderRadius: t.radius, border: `1px solid ${t.line}` }}>
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
