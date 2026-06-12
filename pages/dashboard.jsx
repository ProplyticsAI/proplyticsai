import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import t from '../components/brand';
import { Cap, Btn, Card, Stat, Sparkline, Donut, fmt } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

const TYP_FARBEN = [t.accent, t.data, t.pos, t.faint, t.highlight];

function bruttorendite(b) {
  const miete = b.inputs?.jahresnettokaltmiete;
  const wert = b.ergebnis?.ergebnis;
  if (b.verfahren !== 'ertragswert' || !miete || !wert) return null;
  return (miete / wert) * 100;
}

function pct(v) {
  return v.toFixed(1).replace('.', ',') + ' %';
}

export default function DashboardPage() {
  const { user, ready, fetchWithAuth } = useAuth();
  const [bewertungen, setBewertungen] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ready || !user) return;
    let active = true;
    fetchWithAuth('/api/bewertungen')
      .then((res) => {
        if (!res.ok) throw new Error('Bewertungen konnten nicht geladen werden');
        return res.json();
      })
      .then((data) => { if (active) setBewertungen(data); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [ready, user, fetchWithAuth]);

  const list = bewertungen || [];
  const objekte = list.length;
  const portfolioWert = list.reduce((sum, b) => sum + (b.ergebnis?.ergebnis || 0), 0);
  const proObjekt = objekte ? portfolioWert / objekte : 0;
  const renditen = list.map(bruttorendite).filter((r) => r != null);
  const avgRendite = renditen.length ? renditen.reduce((a, c) => a + c, 0) / renditen.length : null;

  const typGroups = {};
  list.forEach((b) => {
    const typ = b.inputs?.gebaeudetyp || 'Sonstige';
    typGroups[typ] = (typGroups[typ] || 0) + 1;
  });
  const typEntries = Object.entries(typGroups);

  const sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let running = 0;
  const sparkData = sorted.map((b) => (running += b.ergebnis?.ergebnis || 0));

  const recent = list.slice(0, 5);
  const name = user?.name || user?.email;

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
              {name ? `${name}'s Portfolio` : 'Ihr Portfolio'}
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
          {!ready || (user && bewertungen === null && !error) ? (
            <Card t={t}>
              <Cap t={t} color={t.faint}>Lädt…</Cap>
            </Card>
          ) : !user ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.muted, marginBottom: 14 }}>
                Bitte melden Sie sich an, um Ihr Portfolio zu sehen.
              </div>
              <Link href="/login">
                <Btn t={t} variant="primary" size="sm">Anmelden</Btn>
              </Link>
            </Card>
          ) : error ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.neg }}>{error}</div>
            </Card>
          ) : (
            <>
              {/* stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                <Stat t={t} label="Objekte" value={String(objekte)} sub="Bewertete Immobilien" icon="building" />
                <Stat t={t} label="Portfoliowert" value={fmt(portfolioWert, { eur: true, compact: true })} sub="Summierte Marktwerte" icon="euro" highlight />
                <Stat t={t} label="Ø Rendite" value={avgRendite != null ? pct(avgRendite) : '–'} sub="Brutto, Ertragswert-Objekte" icon="percent" />
                <Stat t={t} label="Pro Objekt" value={objekte ? fmt(proObjekt, { eur: true, compact: true }) : '–'} sub="Durchschnittswert" icon="bars" />
              </div>

              {/* charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
                <Card t={t}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>Portfoliowert im Zeitverlauf</div>
                    <Cap t={t} color={t.faint}>Kumuliert je Bewertung</Cap>
                  </div>
                  {sparkData.length >= 2 ? (
                    <Sparkline t={t} data={sparkData} w={680} h={150} />
                  ) : (
                    <Cap t={t} color={t.faint}>Noch nicht genug Bewertungen für einen Verlauf.</Cap>
                  )}
                </Card>
                <Card t={t}>
                  <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Nach Objektart</div>
                  {typEntries.length ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                      <Donut t={t} segments={typEntries.map(([, count], i) => ({ v: count, c: TYP_FARBEN[i % TYP_FARBEN.length] }))} size={120} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {typEntries.map(([typ], i) => (
                          <div key={typ} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 9, height: 9, borderRadius: 2, background: TYP_FARBEN[i % TYP_FARBEN.length], flexShrink: 0 }} />
                            <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.muted }}>{typ}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Cap t={t} color={t.faint}>Noch keine Objekte erfasst.</Cap>
                  )}
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
                {recent.length === 0 ? (
                  <div style={{ padding: '32px 22px', textAlign: 'center' }}>
                    <div style={{ fontFamily: t.sans, fontSize: 14, color: t.muted, marginBottom: 14 }}>
                      Noch keine Bewertungen vorhanden.
                    </div>
                    <Link href="/analyse">
                      <Btn t={t} variant="primary" size="sm" icon="plus">Erste Bewertung erstellen</Btn>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr', padding: '11px 22px', borderBottom: `1px solid ${t.line}` }}>
                      {['Adresse', 'Stadt', 'Art', 'Baujahr', 'Fläche', 'Wert', 'Rendite'].map((h) => (
                        <Cap key={h} t={t} color={t.faint}>{h}</Cap>
                      ))}
                    </div>
                    {recent.map((b, i) => {
                      const rendite = bruttorendite(b);
                      return (
                        <div key={b.id} style={{
                          display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 0.8fr 0.9fr 1fr 0.8fr',
                          padding: '15px 22px', borderBottom: i < recent.length - 1 ? `1px solid ${t.line}` : 'none',
                          alignItems: 'center',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: t.radius, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                              <Icon name="building" size={15} />
                            </div>
                            <span style={{ fontFamily: t.sans, fontSize: 14, fontWeight: 600, color: t.ink }}>{b.objektName}</span>
                          </div>
                          <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{b.ort || '–'}</span>
                          <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{b.inputs?.gebaeudetyp || '–'}</span>
                          <span style={{ fontFamily: t.mono, fontSize: 13.5, color: t.muted }}>{b.inputs?.baujahr || '–'}</span>
                          <span style={{ fontFamily: t.mono, fontSize: 13.5, color: t.muted }}>{b.inputs?.flaeche ? `${b.inputs.flaeche} m²` : '–'}</span>
                          <span style={{ fontFamily: t.mono, fontSize: 14, fontWeight: 600, color: t.ink }}>{b.ergebnis?.ergebnis ? fmt(b.ergebnis.ergebnis, { eur: true }) : '–'}</span>
                          <span style={{ fontFamily: t.mono, fontSize: 13.5, color: rendite != null ? t.pos : t.faint }}>{rendite != null ? pct(rendite) : '–'}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </Card>
            </>
          )}
        </div>
      </AppShell>
    </>
  );
}
