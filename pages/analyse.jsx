import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import t from '../components/brand';
import { Cap, Btn, Card, MapMini, fmt } from '../components/primitives';
import { AppShell } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';
import ValuationProcedures from '../components/valuation-procedures';

const VERFAHREN_OPTIONS = [
  ['ertragswert', 'Ertragswertverfahren', 'Vermietete Objekte · §§ 17–20 ImmoWertV', 'trendingUp'],
  ['sachwert', 'Sachwertverfahren', 'Eigengenutzte Objekte · §§ 21–23 ImmoWertV', 'building'],
];

const GEBAEUDETYPEN = Object.keys(ValuationProcedures.GESAMTNUTZUNGSDAUER);
const MODERNISIERUNG_OPTIONS = [['keine', 'Keine'], ['teilweise', 'Teilweise'], ['umfassend', 'Umfassend']];
const STANDARD_OPTIONS = [['einfach', 'Einfach'], ['mittel', 'Mittel'], ['gehoben', 'Gehoben']];

const EMPTY_FORM = {
  objektName: '',
  ort: '',
  gebaeudetyp: 'Mehrfamilienhaus',
  baujahr: '1990',
  flaeche: '',
  grundstuecksflaeche: '',
  bodenrichtwert: '',
  modernisierung: 'keine',
  jahresnettokaltmiete: '',
  standard: 'mittel',
};

function pct(v) {
  return v.toFixed(1).replace('.', ',') + ' %';
}

function TextField({ label, value, onChange, placeholder, type = 'text', suffix }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ marginBottom: 7 }}><Cap t={t} color={t.muted}>{label}</Cap></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 13px', height: 46, background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', fontFamily: t.sans, fontSize: 14.5, color: t.ink }}
        />
        {suffix && <span style={{ fontFamily: t.sans, fontSize: 13, color: t.faint, flexShrink: 0 }}>{suffix}</span>}
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ marginBottom: 7 }}><Cap t={t} color={t.muted}>{label}</Cap></div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 13px', height: 46, background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: t.sans, fontSize: 14.5, color: t.ink, cursor: 'pointer' }}
        >
          {options.map((o) => (
            Array.isArray(o)
              ? <option key={o[0]} value={o[0]}>{o[1]}</option>
              : <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

export default function AnalysePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, ready, fetchWithAuth } = useAuth();

  const [verfahren, setVerfahren] = useState('ertragswert');
  const [form, setForm] = useState(EMPTY_FORM);
  const [ergebnis, setErgebnis] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Adresse aus der Landing-Page-Eingabe übernehmen ("Straße 1, Stadt" →
  // Objektname + Ort), sofern keine bestehende Bewertung geladen wird.
  useEffect(() => {
    if (!router.isReady || id) return;
    const adresse = router.query.adresse;
    if (typeof adresse !== 'string' || !adresse.trim()) return;
    const idx = adresse.lastIndexOf(',');
    setForm((f) => ({
      ...f,
      objektName: f.objektName || (idx > 0 ? adresse.slice(0, idx).trim() : adresse.trim()),
      ort: f.ort || (idx > 0 ? adresse.slice(idx + 1).trim() : ''),
    }));
  }, [router.isReady, router.query.adresse, id]);

  useEffect(() => {
    if (!ready || !user || !id) return;
    let active = true;
    fetchWithAuth(`/api/bewertungen/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Bewertung konnte nicht geladen werden');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setVerfahren(data.verfahren);
        setForm({
          objektName: data.objektName || '',
          ort: data.ort || '',
          gebaeudetyp: data.inputs?.gebaeudetyp || EMPTY_FORM.gebaeudetyp,
          baujahr: String(data.inputs?.baujahr ?? EMPTY_FORM.baujahr),
          flaeche: String(data.inputs?.flaeche ?? ''),
          grundstuecksflaeche: String(data.inputs?.grundstuecksflaeche ?? ''),
          bodenrichtwert: String(data.inputs?.bodenrichtwert ?? ''),
          modernisierung: data.inputs?.modernisierung || 'keine',
          jahresnettokaltmiete: String(data.inputs?.jahresnettokaltmiete ?? ''),
          standard: data.inputs?.standard || 'mittel',
        });
        setErgebnis(data.ergebnis || null);
      })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [ready, user, id, fetchWithAuth]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function buildInputs() {
    return {
      gebaeudetyp: form.gebaeudetyp,
      baujahr: Number(form.baujahr) || new Date().getFullYear(),
      modernisierung: form.modernisierung,
      flaeche: Number(form.flaeche) || 0,
      grundstuecksflaeche: Number(form.grundstuecksflaeche) || 0,
      bodenrichtwert: Number(form.bodenrichtwert) || 0,
      jahresnettokaltmiete: Number(form.jahresnettokaltmiete) || 0,
      standard: form.standard,
    };
  }

  function berechnen() {
    const inputs = buildInputs();
    const result = verfahren === 'ertragswert'
      ? ValuationProcedures.ertragswert(inputs)
      : ValuationProcedures.sachwert(inputs);
    setErgebnis(result);
    setSaved(false);
    setError(null);
  }

  async function speichern() {
    if (!ergebnis || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/bewertungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objektName: form.objektName || 'Unbenanntes Objekt',
          ort: form.ort || null,
          verfahren,
          status: 'abgeschlossen',
          inputs: buildInputs(),
          ergebnis,
        }),
      });
      if (!res.ok) throw new Error('Speichern fehlgeschlagen');
      const created = await res.json();
      setSaved(true);
      router.replace(`/analyse?id=${created.id}`, undefined, { shallow: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const rendite = ergebnis && verfahren === 'ertragswert' && ergebnis.ergebnis && Number(form.jahresnettokaltmiete) > 0
    ? (Number(form.jahresnettokaltmiete) / ergebnis.ergebnis) * 100
    : null;

  const breakdownTotal = ergebnis?.breakdown?.reduce((sum, b) => sum + b.wert, 0) || 0;

  return (
    <>
      <Head><title>Neue Bewertung — proplytic.ai</title></Head>
      <AppShell
        t={t}
        active="Neue Bewertung"
        title={
          <div>
            <Cap t={t} color={t.muted}>{id ? 'Bewertung bearbeiten' : 'Neue Analyse'}</Cap>
            <div style={{ fontFamily: t.display, fontWeight: 500, fontSize: 24, letterSpacing: '-0.01em', marginTop: 3 }}>
              {form.objektName || 'Neue Bewertung'}{form.ort ? `, ${form.ort}` : ''}
            </div>
          </div>
        }
        action={
          user ? (
            <Btn
              t={t}
              variant="primary"
              size="sm"
              icon="check"
              onClick={speichern}
              style={!ergebnis || saving ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {saving ? 'Speichert…' : saved ? 'Gespeichert' : 'Speichern'}
            </Btn>
          ) : (
            <Link href="/login">
              <Btn t={t} variant="outline" size="sm">Anmelden zum Speichern</Btn>
            </Link>
          )
        }
      >
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <Card t={t}>
              <div style={{ fontFamily: t.sans, fontSize: 14, color: t.neg }}>{error}</div>
            </Card>
          )}

          {/* verfahren toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {VERFAHREN_OPTIONS.map(([key, ti, d, ic]) => {
              const on = verfahren === key;
              return (
                <div
                  key={key}
                  onClick={() => { setVerfahren(key); setErgebnis(null); setSaved(false); }}
                  style={{
                    padding: '16px 18px', borderRadius: t.radiusLg, display: 'flex', alignItems: 'center', gap: 13,
                    background: on ? t.highlightSoft : t.surface,
                    border: `1px solid ${on ? t.highlight : t.line}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: t.radius, display: 'grid', placeItems: 'center', background: on ? t.highlight : t.surface2, color: on ? t.onHighlight : t.accent, flexShrink: 0 }}>
                    <Icon name={ic} size={19} />
                  </div>
                  <div>
                    <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14.5, color: t.ink }}>{ti}</div>
                    <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint }}>{d}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3-column workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 300px', gap: 16 }}>
            {/* input form */}
            <Card t={t} pad={0} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: `1px solid ${t.line}` }}>
                <div style={{ width: 30, height: 30, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center' }}>
                  <Icon name="sliders" size={16} />
                </div>
                <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14 }}>Objektdaten</div>
              </div>
              <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TextField label="Objektname" value={form.objektName} onChange={(v) => update('objektName', v)} placeholder="z. B. Gärtnerstraße 14" />
                <TextField label="Ort" value={form.ort} onChange={(v) => update('ort', v)} placeholder="z. B. Berlin" />
                <SelectField label="Gebäudetyp" value={form.gebaeudetyp} onChange={(v) => update('gebaeudetyp', v)} options={GEBAEUDETYPEN} />
                <TextField label="Baujahr" type="number" value={form.baujahr} onChange={(v) => update('baujahr', v)} />
                <TextField label="Wohnfläche" type="number" value={form.flaeche} onChange={(v) => update('flaeche', v)} suffix="m²" />
                <TextField label="Grundstücksfläche" type="number" value={form.grundstuecksflaeche} onChange={(v) => update('grundstuecksflaeche', v)} suffix="m²" />
                <TextField label="Bodenrichtwert" type="number" value={form.bodenrichtwert} onChange={(v) => update('bodenrichtwert', v)} suffix="€/m²" />
                <SelectField label="Modernisierung" value={form.modernisierung} onChange={(v) => update('modernisierung', v)} options={MODERNISIERUNG_OPTIONS} />
                {verfahren === 'ertragswert' ? (
                  <TextField label="Jahresnettokaltmiete" type="number" value={form.jahresnettokaltmiete} onChange={(v) => update('jahresnettokaltmiete', v)} suffix="€/Jahr" />
                ) : (
                  <SelectField label="Ausstattungsstandard" value={form.standard} onChange={(v) => update('standard', v)} options={STANDARD_OPTIONS} />
                )}
              </div>
              <div style={{ padding: 14, borderTop: `1px solid ${t.line}` }}>
                <Btn t={t} variant="primary" full icon="zap" onClick={berechnen}>Berechnen</Btn>
              </div>
            </Card>

            {/* results */}
            <Card t={t} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {ergebnis ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Cap t={t} color={t.muted}>Geschätzter Marktwert</Cap>
                      <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 46, letterSpacing: '-0.025em', color: t.ink, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(ergebnis.ergebnis, { eur: true, compact: true })}
                      </div>
                      <div style={{ fontFamily: t.sans, fontSize: 13.5, color: t.faint, marginTop: 2 }}>
                        {ergebnis.titel}
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: t.mono, fontSize: 11, color: t.pos, border: `1px solid ${t.line}`, padding: '6px 11px', borderRadius: 999 }}>
                      <Icon name="check" size={12} stroke={2.4} /> {ergebnis.rechtsgrundlage}
                    </span>
                  </div>

                  {/* kennzahlen grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 22 }}>
                    {ergebnis.kennzahlen.map((k) => (
                      <div key={k.label} style={{ padding: 15, borderRadius: t.radius, background: t.surface2, border: `1px solid ${t.line}` }}>
                        <Icon name="bars" size={15} color={t.accent} />
                        <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint, marginTop: 9 }}>{k.label}</div>
                        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 18, color: t.ink, marginTop: 3 }}>{k.wert}</div>
                      </div>
                    ))}
                    {rendite != null && (
                      <div style={{ padding: 15, borderRadius: t.radius, background: t.surface2, border: `1px solid ${t.line}` }}>
                        <Icon name="trendingUp" size={15} color={t.accent} />
                        <div style={{ fontFamily: t.sans, fontSize: 12, color: t.faint, marginTop: 9 }}>Bruttorendite</div>
                        <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 18, color: t.ink, marginTop: 3 }}>{pct(rendite)}</div>
                      </div>
                    )}
                  </div>

                  {/* breakdown */}
                  {ergebnis.breakdown && (
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${t.line}` }}>
                      <Cap t={t} color={t.muted}>Wertzusammensetzung</Cap>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
                        {ergebnis.breakdown.map((b) => (
                          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontFamily: t.sans, fontSize: 13, color: t.muted, width: 130 }}>{b.label}</span>
                            <div style={{ flex: 1, height: 8, borderRadius: 4, background: t.line, overflow: 'hidden' }}>
                              <div style={{ width: `${breakdownTotal ? Math.max(0, b.wert / breakdownTotal * 100) : 0}%`, height: '100%', background: t.accent, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.ink, width: 70, textAlign: 'right' }}>{fmt(b.wert, { eur: true, compact: true })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 360, gap: 12 }}>
                  <Icon name="bars" size={28} color={t.faint} />
                  <div style={{ fontFamily: t.sans, fontSize: 14, color: t.muted, maxWidth: 280 }}>
                    Objektdaten links eingeben und auf „Berechnen" klicken, um Marktwert und Kennzahlen zu ermitteln.
                  </div>
                </div>
              )}
            </Card>

            {/* map + Berechnungsschritte */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
                <MapMini t={t} h={170} pin={!!form.ort} />
                <div style={{ padding: '12px 16px' }}>
                  <Cap t={t} color={t.muted}>Lage</Cap>
                  <div style={{ fontFamily: t.sans, fontSize: 14, color: t.ink, marginTop: 5 }}>
                    {form.ort || 'Noch kein Ort angegeben'}
                  </div>
                </div>
              </Card>
              {ergebnis?.schritte && (
                <Card t={t} pad={0} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.line}` }}>
                    <Cap t={t} color={t.muted}>Berechnungsschritte</Cap>
                  </div>
                  {ergebnis.schritte.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: i < ergebnis.schritte.length - 1 ? `1px solid ${t.line}` : 'none' }}>
                      <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.ink }}>{s.summe.label}</span>
                      <span style={{
                        fontFamily: t.mono, fontSize: 12.5, textAlign: 'right', flexShrink: 0,
                        color: s.summe.isResult ? t.highlight : s.summe.subtract ? t.neg : t.muted,
                        fontWeight: s.summe.isResult ? 600 : 500,
                      }}>
                        {s.summe.subtract ? '− ' : ''}{fmt(s.summe.wert, { eur: true, compact: true })}
                      </span>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
