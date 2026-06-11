import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import t from '../components/brand';
import { Cap, Btn, Card, MiniRadar, fmt } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

const COLORS = [t.accent, t.data, t.pos, t.highlight];
const RADAR_LABELS = ['Rendite', '€/m²', 'Fläche', 'Wert'];

function pct(v) {
  return v.toFixed(1).replace('.', ',') + ' %';
}

function eurPerM2(o) {
  if (!o.inputs?.flaeche || !o.ergebnis) return null;
  return o.ergebnis / o.inputs.flaeche;
}

function bruttorendite(o) {
  const miete = o.inputs?.jahresnettokaltmiete;
  if (o.verfahren !== 'ertragswert' || !miete || !o.ergebnis) return null;
  return (miete / o.ergebnis) * 100;
}

function normalize(values, invert = false) {
  const valid = values.filter((v) => v != null);
  if (valid.length === 0) return values.map(() => 0);
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  return values.map((v) => {
    if (v == null) return 0;
    if (max === min) return 0.6;
    const n = (v - min) / (max - min);
    return invert ? 1 - n : n;
  });
}

const ROWS = [
  { label: 'Marktwert', get: (o) => o.ergebnis, format: (v) => (v != null ? fmt(v, { eur: true, compact: true }) : '–') },
  { label: 'Verfahren', get: (o) => (o.verfahren === 'ertragswert' ? 'Ertragswert' : 'Sachwert'), format: (v) => v },
  { label: 'Objektart', get: (o) => o.inputs?.gebaeudetyp ?? null, format: (v) => v ?? '–' },
  { label: 'Baujahr', get: (o) => o.inputs?.baujahr ?? null, format: (v) => v ?? '–' },
  { label: 'Wohnfläche', get: (o) => o.inputs?.flaeche ?? null, format: (v) => (v != null ? `${v} m²` : '–') },
  { label: '€/m²', get: eurPerM2, format: (v) => (v != null ? fmt(v, { eur: true }) : '–'), highlight: 'min' },
  { label: 'Bruttorendite', get: bruttorendite, format: (v) => (v != null ? pct(v) : '–'), highlight: 'max' },
];

export default function ComparisonPage() {
  const router = useRouter();
  const { user, ready, fetchWithAuth } = useAuth();
  const [alle, setAlle] = useState(null);
  const [objekte, setObjekte] = useState(null);
  const [error, setError] = useState(null);

  const selectedIds = useMemo(() => {
    const raw = router.query.objekte;
    if (!raw) return [];
    return (Array.isArray(raw) ? raw[0] : raw).split(',').filter(Boolean).slice(0, 4);
  }, [router.query.objekte]);

  useEffect(() => {
    if (!ready || !user) return;
    let active = true;
    fetchWithAuth('/api/bewertungen')
      .then((res) => {
        if (!res.ok) throw new Error('Bewertungen konnten nicht geladen werden');
        return res.json();
      })
      .then((data) => { if (active) setAlle(data); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [ready, user, fetchWithAuth]);

  useEffect(() => {
    if (!ready || !user || selectedIds.length === 0) { setObjekte(null); return; }
    let active = true;
    fetchWithAuth('/api/bewertungen/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Vergleich konnte nicht geladen werden');
        return res.json();
      })
      .then((data) => { if (active) setObjekte(data.objekte); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [ready, user, selectedIds.join(','), fetchWithAuth]);

  function setSelection(ids) {
    router.push(ids.length ? `/comparison?objekte=${ids.join(',')}` : '/comparison', undefined, { shallow: true });
  }
  function addObjekt(id) {
    if (selectedIds.includes(id) || selectedIds.length >= 4) return;
    setSelection([...selectedIds, id]);
  }
  function removeObjekt(id) {
    setSelection(selectedIds.filter((x) => x !== id));
  }

  const verfuegbar = (alle || []).filter((b) => !selectedIds.includes(b.id));
  const canAdd = selectedIds.length < 4 && verfuegbar.length > 0;

  const picker = (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 13px', borderRadius: t.radius,
      border: `1px solid ${t.lineStrong}`, opacity: canAdd ? 1 : 0.5,
    }}>
      <Icon name="plus" size={15} stroke={2} color={t.ink} />
      <select
        value=""
        disabled={!canAdd}
        onChange={(e) => { if (e.target.value) addObjekt(e.target.value); }}
        style={{ border: 0, outline: 0, background: 'transparent', fontFamily: t.sans, fontWeight: 600, fontSize: 13, color: t.ink, cursor: canAdd ? 'pointer' : 'not-allowed' }}
      >
        <option value="" disabled hidden>
          {selectedIds.length >= 4 ? 'Maximal 4 Objekte' : 'Objekt hinzufügen'}
        </option>
        {verfuegbar.map((b) => (
          <option key={b.id} value={b.id}>{b.objektName}{b.ort ? ` · ${b.ort}` : ''}</option>
        ))}
      </select>
    </div>
  );

  let radarSeries = null;
  if (objekte && objekte.length) {
    const normMarkt = normalize(objekte.map((o) => o.ergebnis));
    const normM2 = normalize(objekte.map(eurPerM2), true);
    const normFlaeche = normalize(objekte.map((o) => o.inputs?.flaeche ?? null));
    const normRendite = normalize(objekte.map(bruttorendite));
    radarSeries = objekte.map((o, i) => ({
      c: COLORS[i % COLORS.length],
      vals: [normRendite[i], normM2[i], normFlaeche[i], normMarkt[i]],
    }));
  }

  const bestByRow = ROWS.map((row) => {
    if (!row.highlight || !objekte) return null;
    const vals = objekte.map(row.get);
    const valid = vals.filter((v) => v != null);
    if (valid.length === 0) return null;
    const best = row.highlight === 'max' ? Math.max(...valid) : Math.min(...valid);
    return vals.map((v) => v != null && v === best);
  });

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
            {objekte && (
              <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>
                {objekte.length} {objekte.length === 1 ? 'Objekt' : 'Objekte'}
              </span>
            )}
          </div>
        }
        action={selectedIds.length > 0 ? picker : undefined}
      >
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!ready || (user && alle === null && !error) ? (
            <Card t={t}>
              <Cap t={t} color={t.faint}>Lädt…</Cap>
            </Card>
          ) : !user ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.muted, marginBottom: 14 }}>
                Bitte melden Sie sich an, um Objekte zu vergleichen.
              </div>
              <Link href="/login">
                <Btn t={t} variant="primary" size="sm">Anmelden</Btn>
              </Link>
            </Card>
          ) : error ? (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14.5, color: t.neg }}>{error}</div>
            </Card>
          ) : alle.length === 0 ? (
            <Card t={t}>
              <div style={{ padding: '12px 4px', textAlign: 'center' }}>
                <div style={{ fontFamily: t.sans, fontSize: 14, color: t.muted, marginBottom: 14 }}>
                  Noch keine Bewertungen vorhanden — legen Sie zuerst eine Bewertung an.
                </div>
                <Link href="/analyse">
                  <Btn t={t} variant="primary" size="sm" icon="plus">Erste Bewertung erstellen</Btn>
                </Link>
              </div>
            </Card>
          ) : selectedIds.length === 0 ? (
            <Card t={t}>
              <div style={{ padding: '12px 4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ fontFamily: t.sans, fontSize: 14, color: t.muted }}>
                  Wählen Sie bis zu 4 Bewertungen aus, um sie nebeneinander zu vergleichen.
                </div>
                {picker}
              </div>
            </Card>
          ) : !objekte ? (
            <Card t={t}>
              <Cap t={t} color={t.faint}>Lädt…</Cap>
            </Card>
          ) : (
            <>
              {/* object cards */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${objekte.length}, 1fr)`, gap: 16 }}>
                {objekte.map((o, i) => {
                  const col = COLORS[i % COLORS.length];
                  const rendite = bruttorendite(o);
                  return (
                    <Card t={t} key={o.id}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: t.radius, background: t.accentSoft, color: col, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <Icon name="building" size={21} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15.5, color: t.ink }}>{o.objektName}</div>
                          <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.faint }}>{o.ort || '–'}</div>
                        </div>
                        <button
                          onClick={() => removeObjekt(o.id)}
                          style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 999, border: `1px solid ${t.line}`, background: 'transparent', color: t.faint, cursor: 'pointer', flexShrink: 0 }}
                          aria-label="Entfernen"
                        >
                          <Icon name="x" size={11} stroke={2} />
                        </button>
                      </div>
                      <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, border: `1px solid ${t.line}`, padding: '4px 9px', borderRadius: 999 }}>
                        {o.inputs?.gebaeudetyp || (o.verfahren === 'ertragswert' ? 'Ertragswert' : 'Sachwert')}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18 }}>
                        <div>
                          <Cap t={t} color={t.faint}>Marktwert</Cap>
                          <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 24, color: col, marginTop: 4 }}>
                            {o.ergebnis != null ? fmt(o.ergebnis, { eur: true, compact: true }) : '–'}
                          </div>
                        </div>
                        {rendite != null && (
                          <div style={{ textAlign: 'right' }}>
                            <Cap t={t} color={t.faint}>Rendite</Cap>
                            <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 16, color: t.pos, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Icon name="trendingUp" size={13} color={t.pos} />{pct(rendite)}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* radar + table */}
              <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
                <Card t={t}>
                  <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Kennzahlen-Profil</div>
                  <Cap t={t} color={t.faint}>Normalisiert, höher = besser</Cap>
                  <div style={{ display: 'grid', placeItems: 'center', marginTop: 10 }}>
                    {radarSeries && objekte.length >= 2 ? (
                      <MiniRadar t={t} series={radarSeries} labels={RADAR_LABELS} w={290} h={250} />
                    ) : (
                      <div style={{ padding: '40px 0' }}><Cap t={t} color={t.faint}>Mindestens 2 Objekte für ein Profil.</Cap></div>
                    )}
                  </div>
                </Card>
                <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}`, fontFamily: t.sans, fontWeight: 600, fontSize: 15 }}>
                    Detaillierter Vergleich
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `1.4fr repeat(${objekte.length}, 1fr)`, padding: '11px 22px', borderBottom: `1px solid ${t.line}`, background: t.surface2 }}>
                    <Cap t={t} color={t.faint}>Kennzahl</Cap>
                    {objekte.map((o, i) => (
                      <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                        <Cap t={t} color={t.muted}>{o.ort || o.objektName}</Cap>
                      </div>
                    ))}
                  </div>
                  {ROWS.map((row, ri) => {
                    const vals = objekte.map(row.get);
                    return (
                      <div key={row.label} style={{ display: 'grid', gridTemplateColumns: `1.4fr repeat(${objekte.length}, 1fr)`, padding: '13px 22px', borderBottom: ri < ROWS.length - 1 ? `1px solid ${t.line}` : 'none', alignItems: 'center' }}>
                        <span style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted }}>{row.label}</span>
                        {vals.map((v, ci) => {
                          const isBest = bestByRow[ri]?.[ci];
                          return (
                            <span key={ci} style={{ textAlign: 'right', fontFamily: t.mono, fontSize: 13.5, fontWeight: isBest ? 600 : 500, color: isBest ? t.pos : t.ink }}>
                              {row.format(v)}{isBest && <span style={{ marginLeft: 5, color: t.accent }}>★</span>}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </Card>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </>
  );
}
