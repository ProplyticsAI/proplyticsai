import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import t from '../components/brand';
import { Cap, Btn, Card, MapMini, fmt } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

const STATUS_LABEL = { entwurf: 'Entwurf', abgeschlossen: 'Abgeschlossen', archiviert: 'Archiviert' };

function bruttorendite(b) {
  const miete = b.inputs?.jahresnettokaltmiete;
  const wert = b.ergebnis?.ergebnis;
  if (b.verfahren !== 'ertragswert' || !miete || !wert) return null;
  return (miete / wert) * 100;
}

function pct(v) {
  return v.toFixed(1).replace('.', ',') + ' %';
}

export default function ValuationsPage() {
  const { user, ready, fetchWithAuth } = useAuth();
  const [bewertungen, setBewertungen] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typFilter, setTypFilter] = useState('Alle Arten');

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

  const typen = useMemo(() => {
    const set = new Set();
    list.forEach((b) => { if (b.inputs?.gebaeudetyp) set.add(b.inputs.gebaeudetyp); });
    return ['Alle Arten', ...Array.from(set)];
  }, [list]);

  const filtered = list.filter((b) => {
    if (typFilter !== 'Alle Arten' && b.inputs?.gebaeudetyp !== typFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const haystack = `${b.objektName} ${b.ort || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const gesamtwert = filtered.reduce((sum, b) => sum + (b.ergebnis?.ergebnis || 0), 0);
  const renditen = filtered.map(bruttorendite).filter((r) => r != null);
  const avgRendite = renditen.length ? renditen.reduce((a, c) => a + c, 0) / renditen.length : null;

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
          {!ready || (user && bewertungen === null && !error) ? (
            <Card t={t}>
              <Cap t={t} color={t.faint}>Lädt…</Cap>
            </Card>
          ) : !user ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.muted, marginBottom: 14 }}>
                Bitte melden Sie sich an, um Ihre Bewertungen zu sehen.
              </div>
              <Link href="/login">
                <Btn t={t} variant="primary" size="sm">Anmelden</Btn>
              </Link>
            </Card>
          ) : error ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.neg }}>{error}</div>
            </Card>
          ) : list.length === 0 ? (
            <Card t={t}>
              <div style={{ padding: '12px 4px', textAlign: 'center' }}>
                <div style={{ fontFamily: t.sans, fontSize: 14, color: t.muted, marginBottom: 14 }}>
                  Noch keine Bewertungen vorhanden.
                </div>
                <Link href="/analyse">
                  <Btn t={t} variant="primary" size="sm" icon="plus">Erste Bewertung erstellen</Btn>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              {/* toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 360, height: 42, padding: '0 14px', background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}>
                  <Icon name="search" size={17} color={t.faint} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nach Adresse oder Stadt suchen…"
                    style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: t.sans, fontSize: 14, color: t.ink }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {typen.map((c) => (
                    <button
                      key={c}
                      onClick={() => setTypFilter(c)}
                      style={{
                        fontFamily: t.sans, fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 999,
                        background: typFilter === c ? t.highlightSoft : t.surface,
                        color: typFilter === c ? t.highlight : t.muted,
                        border: `1px solid ${typFilter === c ? t.highlight : t.line}`,
                        cursor: 'pointer',
                      }}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* summary line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '4px 2px' }}>
                <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
                  <strong style={{ color: t.ink }}>{filtered.length}</strong> Bewertungen
                </span>
                <span style={{ width: 1, height: 14, background: t.line }} />
                <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
                  Gesamt <strong style={{ color: t.ink, fontFamily: t.mono }}>{fmt(gesamtwert, { eur: true, compact: true })}</strong>
                </span>
                <span style={{ width: 1, height: 14, background: t.line }} />
                <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>
                  Ø Rendite <strong style={{ color: avgRendite != null ? t.pos : t.faint, fontFamily: t.mono }}>{avgRendite != null ? pct(avgRendite) : '–'}</strong>
                </span>
              </div>

              {/* cards grid */}
              {filtered.length === 0 ? (
                <Card t={t}>
                  <Cap t={t} color={t.faint}>Keine Bewertungen für diese Filter.</Cap>
                </Card>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {filtered.map((b) => {
                    const rendite = bruttorendite(b);
                    return (
                      <Link key={b.id} href={`/analyse?id=${b.id}`} style={{ display: 'block' }}>
                        <Card t={t} pad={0} style={{ overflow: 'hidden', cursor: 'pointer' }}>
                          <div style={{ position: 'relative' }}>
                            <MapMini t={t} h={120} pin />
                            <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: t.mono, fontSize: 10.5, color: t.surface, background: 'rgba(25,27,28,.78)', padding: '4px 8px', borderRadius: 999 }}>
                              {STATUS_LABEL[b.status] || b.status}
                            </span>
                          </div>
                          <div style={{ padding: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, color: t.ink }}>{b.objektName}</div>
                                <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint, marginTop: 2 }}>{b.ort || '–'}</div>
                              </div>
                              <Icon name="arrowUpRight" size={17} color={t.faint} />
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                              {[b.inputs?.gebaeudetyp, b.inputs?.baujahr ? `Baujahr ${b.inputs.baujahr}` : null].filter(Boolean).map((m) => (
                                <span key={m} style={{ fontFamily: t.sans, fontSize: 11.5, color: t.muted, background: t.surface2, padding: '4px 9px', borderRadius: 999, border: `1px solid ${t.line}` }}>{m}</span>
                              ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.line}` }}>
                              <div>
                                <Cap t={t} color={t.faint}>Marktwert</Cap>
                                <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 22, color: t.ink, marginTop: 3 }}>
                                  {b.ergebnis?.ergebnis ? fmt(b.ergebnis.ergebnis, { eur: true }) : '–'}
                                </div>
                              </div>
                              {rendite != null && (
                                <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.pos, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Icon name="trendingUp" size={13} color={t.pos} />{pct(rendite)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </AppShell>
    </>
  );
}
