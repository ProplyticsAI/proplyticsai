import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import t from '../components/brand';
import { Cap, Btn, ContourBg } from '../components/primitives';
import { SectionTag, MarketingNav, SiteFooter } from '../components/layout';
import ValuationCard from '../components/valuation-card';
import Icon from '../components/icons';

const features = [
  ['trendingUp', 'Marktwert-Spanne', 'Eine belastbare Wertspanne aus aktuellen Vergleichstransaktionen.'],
  ['pie', 'Rendite & IRR', 'Sofortige Rentabilität — Brutto-, Nettorendite und 10-Jahres-IRR.'],
  ['wrench', 'Sanierungsbedarf', 'Kostenschätzung für nötige Modernisierung und CapEx-Planung.'],
  ['mapPin', 'Mietspiegel & Lage', 'Lokale Mietbenchmarks und Lagefaktoren auf einen Blick.'],
  ['compare', 'Comparables', 'Ähnliche Objekte in der Nähe, sortiert und gegenübergestellt.'],
  ['download', 'PDF-Bericht', 'Ein bankfertiges Dossier, exportiert mit einem Klick.'],
];

const steps = [
  ['01', 'mapPin', 'Adresse eingeben', 'Geben Sie die Objektadresse ein — mehr braucht es nicht zum Start.'],
  ['02', 'message', 'Eckdaten bestätigen', 'Unser Assistent fragt die wenigen Details ab, die den Wert beeinflussen.'],
  ['03', 'fileText', 'Ergebnis erhalten', 'Marktwert, Rendite und ein herunterladbarer Bericht in Sekunden.'],
];

const pfade = [
  ['fileText', 'Excel-Import', 'Ein oder mehrere Objekte aus einer Liste hochladen und gesammelt bewerten.', null],
  ['zap', 'Schnellanalyse', 'In drei Schritten zur ersten belastbaren Bewertung.', '/analyse'],
  ['sliders', 'Detailanalyse', 'Sieben Schritte für das ausführliche Gutachten.', null],
];

const trust = [
  ['shield', 'DSGVO-konform', 'Volle Einhaltung europäischer Datenschutzstandards.'],
  ['eye', 'Anonym nutzen', 'Kein Konto nötig — starten Sie sofort eine Bewertung.'],
  ['lock', 'Nichts gespeichert', 'Ohne Konto werden Ihre Eingaben nie gespeichert.'],
];

export default function LandingPage() {
  const router = useRouter();
  const [adresse, setAdresse] = useState('');

  function bewertungStarten() {
    const a = adresse.trim();
    router.push(a ? `/analyse?adresse=${encodeURIComponent(a)}` : '/analyse');
  }

  return (
    <>
      <Head>
        <title>proplytic.ai — Immobilienbewertung, neu gedacht</title>
        <meta name="description" content="KI-gestützte Immobilienbewertung nach ImmoWertV 2024. Prüfsicher, in Sekunden." />
      </Head>
      <div style={{ background: t.page, color: t.ink, fontFamily: t.sans }}>
        <MarketingNav t={t} />

        {/* HERO */}
        <div style={{ position: 'relative', padding: '64px 56px 72px', overflow: 'hidden' }}>
          <ContourBg t={t} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center', maxWidth: 1320, margin: '0 auto' }}>
            {/* left: address input + analysis paths */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '6px 13px', borderRadius: 999, border: `1px solid ${t.line}`, background: t.surface, marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} />
                <Cap t={t} color={t.muted}>Jetzt bewerten nach ImmoWertV 2024</Cap>
              </div>
              <h1 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 54, lineHeight: 1.06, letterSpacing: '-0.025em', margin: 0, color: t.ink }}>
                Immobilien­bewertung,<span style={{ color: t.highlight }}> neu gedacht.</span>
              </h1>
              <p style={{ fontFamily: t.sans, fontSize: 17.5, lineHeight: 1.6, color: t.muted, margin: '18px 0 0', maxWidth: 480 }}>
                Konforme, prüfsichere Bewertungen — KI-gestützt und in sechzig Sekunden geliefert. Von der Adresse zum bankfertigen Bericht.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 28, padding: 8, background: t.surface, border: `1px solid ${t.lineStrong}`, borderRadius: t.radiusLg, maxWidth: 560 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
                  <Icon name="mapPin" size={19} color={t.faint} />
                  <input
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') bewertungStarten(); }}
                    placeholder="Objektadresse eingeben…"
                    style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', fontFamily: t.sans, fontSize: 15.5, color: t.ink }}
                  />
                </div>
                <Btn t={t} variant="primary" iconRight="arrowRight" onClick={bewertungStarten}>Immobilie bewerten</Btn>
              </div>
              {/* drei Analyse-Pfade */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 26, maxWidth: 640 }}>
                {pfade.map(([ic, ti, d, href]) => {
                  const inner = (
                    <div style={{
                      height: '100%', padding: '16px 16px 14px', background: t.surface, border: `1px solid ${href ? t.lineStrong : t.line}`,
                      borderRadius: t.radiusLg, display: 'flex', flexDirection: 'column', gap: 8,
                      cursor: href ? 'pointer' : 'default', opacity: href ? 1 : 0.75,
                    }}>
                      <div style={{ width: 34, height: 34, borderRadius: t.radius, display: 'grid', placeItems: 'center', background: t.accentSoft, color: t.accent }}>
                        <Icon name={ic} size={17} />
                      </div>
                      <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 14.5, color: t.ink }}>{ti}</div>
                      <div style={{ fontFamily: t.sans, fontSize: 12.5, lineHeight: 1.5, color: t.muted, flex: 1 }}>{d}</div>
                      {href ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: t.sans, fontSize: 12.5, fontWeight: 600, color: t.highlight }}>
                          Starten <Icon name="arrowRight" size={12} stroke={2.2} />
                        </span>
                      ) : (
                        <Cap t={t} color={t.faint} style={{ fontSize: 10 }}>Bald verfügbar</Cap>
                      )}
                    </div>
                  );
                  return href
                    ? <Link key={ti} href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
                    : <div key={ti}>{inner}</div>;
                })}
              </div>
            </div>
            {/* right: example valuation + minimal explanation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <ValuationCard t={t} w={420} />
              <p style={{ fontFamily: t.sans, fontSize: 13.5, lineHeight: 1.6, color: t.muted, maxWidth: 380, textAlign: 'center', margin: 0 }}>
                Beispielbewertung: Marktwert-Spanne, Rendite und Kennzahlen — erstellt in rund sechzig Sekunden.
              </p>
            </div>
          </div>
        </div>

        {/* ROADMAP: eigene Bewertungs-KI */}
        <div style={{ borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`, background: t.surface }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '44px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '5px 12px', borderRadius: 999, background: t.accentSoft, marginBottom: 14 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} />
                <Cap t={t} color={t.accent}>In Entwicklung</Cap>
              </div>
              <h3 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 28, letterSpacing: '-0.02em', margin: '0 0 10px', color: t.ink }}>
                proplytic.ai ML — unsere eigene Bewertungs-KI
              </h3>
              <p style={{ fontFamily: t.sans, fontSize: 15, lineHeight: 1.65, color: t.muted, margin: 0 }}>
                Wir trainieren derzeit ein eigenes, spezialisiertes Machine-Learning-Modell mit unseren Bewertungsdaten.
                Es verarbeitet ausschließlich die wertbestimmenden Kennzahlen einer Immobilie — für schnellere und noch präzisere Marktwerte.
              </p>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: t.radiusLg, display: 'grid', placeItems: 'center', background: t.accentSoft, color: t.accent, flexShrink: 0 }}>
              <Icon name="sparkles" size={34} />
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div id="funktionen" style={{ padding: '80px 56px', maxWidth: 1320, margin: '0 auto', scrollMarginTop: 80 }}>
          <SectionTag t={t} num="01">Funktionen</SectionTag>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44 }}>
            <h2 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 42, letterSpacing: '-0.02em', margin: 0, maxWidth: 540, lineHeight: 1.1 }}>
              Alles, um souverän zu kalkulieren
            </h2>
            <span style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, maxWidth: 280, textAlign: 'right' }}>
              Sechs Analyse-Ebenen, ein stimmiges Instrument.
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: `1px solid ${t.line}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
            {features.map(([ic, ti, d], i) => (
              <div key={ti} style={{
                padding: 30,
                borderRight: (i % 3 !== 2) ? `1px solid ${t.line}` : 'none',
                borderBottom: (i < 3) ? `1px solid ${t.line}` : 'none',
                background: t.surface,
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
        <div id="ablauf" style={{ padding: '20px 56px 80px', maxWidth: 1320, margin: '0 auto', scrollMarginTop: 80 }}>
          <SectionTag t={t} num="02">Ablauf</SectionTag>
          <h2 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 42, letterSpacing: '-0.02em', margin: '0 0 44px', lineHeight: 1.1 }}>
            Drei Schritte zu einer belastbaren Zahl
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {steps.map(([n, ic, ti, d]) => (
              <div key={n}>
                <div style={{ fontFamily: t.mono, fontWeight: 600, fontSize: 13, color: t.accent, marginBottom: 18 }}>— {n}</div>
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
        <div style={{ background: t.surface2, borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}` }}>
          <div style={{ padding: '80px 56px', maxWidth: 1320, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div>
                <SectionTag t={t} num="03">Ergebnis</SectionTag>
                <h2 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 40, letterSpacing: '-0.02em', margin: '0 0 18px', lineHeight: 1.12 }}>
                  Ein professioneller Bericht, bereit zum Teilen
                </h2>
                <p style={{ fontFamily: t.sans, fontSize: 16.5, lineHeight: 1.6, color: t.muted, margin: '0 0 28px', maxWidth: 440 }}>
                  Ihr komplettes Bewertungsdossier — sofort verfügbar, formatiert für alle, die kritisch nachfragen.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                  {['Wertspanne mit Min-/Max-Schätzung', 'Alle Kennzahlen auf einer Seite', 'Eine klare Empfehlung für die nächsten Schritte'].map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 999, background: t.accentSoft, color: t.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <Icon name="check" size={13} stroke={2.4} />
                      </span>
                      <span style={{ fontFamily: t.sans, fontSize: 15, color: t.ink }}>{b}</span>
                    </div>
                  ))}
                </div>
                <Btn t={t} variant="outline" iconRight="arrowRight">Musterbericht ansehen</Btn>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ValuationCard t={t} w={440} />
              </div>
            </div>
          </div>
        </div>

        {/* TRUST */}
        <div id="sicherheit" style={{ padding: '80px 56px', maxWidth: 1320, margin: '0 auto', scrollMarginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SectionTag t={t} num="04">Vertrauen</SectionTag>
            </div>
            <h2 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 40, letterSpacing: '-0.02em', margin: 0 }}>
              Ihre Daten bleiben Ihre
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 940, margin: '0 auto' }}>
            {trust.map(([ic, ti, d]) => (
              <div key={ti} style={{ textAlign: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: t.radiusLg, display: 'grid', placeItems: 'center', background: t.surface, border: `1px solid ${t.line}`, color: t.ink, margin: '0 auto 18px' }}>
                  <Icon name={ic} size={22} />
                </div>
                <div style={{ fontFamily: t.sans, fontWeight: 600, fontSize: 17, color: t.ink, marginBottom: 8 }}>{ti}</div>
                <div style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.6, color: t.muted, maxWidth: 240, margin: '0 auto' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ position: 'relative', padding: '84px 56px', background: t.ink, overflow: 'hidden' }}>
          <div style={{ position: 'relative', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 44, letterSpacing: '-0.02em', margin: '0 0 16px', color: t.page }}>
              Jetzt starten — eine Adresse genügt.
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 17, color: 'rgba(244,239,230,0.7)', margin: '0 0 36px' }}>
              Erhalten Sie in etwa einer Minute eine professionelle Wertschätzung.
            </p>
            <div style={{ display: 'flex', gap: 10, padding: 8, background: t.surface, borderRadius: t.radiusLg, maxWidth: 520, margin: '0 auto' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
                <Icon name="mapPin" size={19} color={t.faint} />
                <span style={{ fontFamily: t.sans, fontSize: 15.5, color: t.faint }}>Objektadresse eingeben…</span>
              </div>
              <Link href="/analyse">
                <Btn t={t} variant="accent" iconRight="arrowRight" style={{ background: t.highlight, color: t.onHighlight }}>Jetzt bewerten</Btn>
              </Link>
            </div>
          </div>
        </div>

        <SiteFooter t={t} />
      </div>
    </>
  );
}
