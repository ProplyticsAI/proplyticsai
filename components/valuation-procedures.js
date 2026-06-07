/*!
 * ValuationProcedures — Proplytic.ai
 * Berechnung von Ertragswert- und Sachwertverfahren
 * gemäß Immobilienwertermittlungsverordnung (ImmoWertV 2021).
 *
 * Hinweis: Die hinterlegten Liegenschaftszinssätze, Nutzungsdauern,
 * Regelherstellungskosten und Sachwertfaktoren sind vereinfachte
 * Orientierungswerte. Für rechtsverbindliche Gutachten sind die
 * aktuellen Daten des örtlich zuständigen Gutachterausschusses
 * (Bodenrichtwerte, Liegenschaftszinssätze, Sachwertfaktoren) heranzuziehen.
 *
 * API:
 *   ValuationProcedures.ertragswert(inputs) → { titel, ergebnis, kennzahlen, schritte }
 *   ValuationProcedures.sachwert(inputs)    → { titel, ergebnis, kennzahlen, schritte }
 *   ValuationProcedures.eur(value)          → "1.234.000 €"
 */
const ValuationProcedures = (() => {
  'use strict';

  // ── Tabellenwerte (Orientierungswerte) ─────────────────

  // Liegenschaftszinssätze nach Objektart — typische Bandbreiten der Gutachterausschüsse
  const LIEGENSCHAFTSZINS = {
    'Eigentumswohnung':  0.035,
    'Mehrfamilienhaus':  0.045,
    'Einfamilienhaus':   0.030,
    'Reihenhaus':        0.030,
    'Bürogebäude':       0.060,
    'Geschäftshaus':     0.065,
  };

  // Gesamtnutzungsdauer in Jahren (Sachwertrichtlinie Anlage 1 / Anlage 4 ImmoWertV)
  const GESAMTNUTZUNGSDAUER = {
    'Eigentumswohnung':  80,
    'Mehrfamilienhaus':  80,
    'Einfamilienhaus':   80,
    'Reihenhaus':        80,
    'Bürogebäude':       60,
    'Geschäftshaus':     60,
  };

  // Regelherstellungskosten je m² Bruttogrundfläche, Baupreisstand 2010 (NHK 2010)
  const RHK_BASIS_2010 = { einfach: 700, mittel: 1050, gehoben: 1500 };
  // Hochrechnung 2010 → aktueller Baupreisstand (grober Orientierungsfaktor)
  const BAUPREISINDEX_FAKTOR = 1.55;

  // Sachwertfaktor (Marktanpassungsfaktor) — grobe Orientierungswerte je Objektart
  const SACHWERTFAKTOR = {
    'Eigentumswohnung':  1.05,
    'Mehrfamilienhaus':  1.00,
    'Einfamilienhaus':   1.00,
    'Reihenhaus':        1.00,
    'Bürogebäude':       0.95,
    'Geschäftshaus':     0.95,
  };

  // Umrechnungsfaktor Wohn-/Nutzfläche → Bruttogrundfläche (BGF)
  const BGF_FAKTOR = 1.5;

  // Modernisierung verjüngt das wirtschaftliche Baualter (fiktiv, Jahre)
  const MODERNISIERUNG_BONUS = { keine: 0, teilweise: 10, umfassend: 25 };

  // ── Hilfsfunktionen ────────────────────────────────────

  function eur(v) {
    return Math.round(v).toLocaleString('de-DE') + ' €';
  }

  function round1000(v) {
    return Math.round(v / 1000) * 1000;
  }

  // Rentenbarwertfaktor (Vervielfältiger), § 20 ImmoWertV / Anlage 1
  function vervielfaeltiger(zinssatz, restnutzungsdauer) {
    const q  = 1 + zinssatz;
    const qn = Math.pow(q, restnutzungsdauer);
    return (qn - 1) / (qn * (q - 1));
  }

  function wirtschaftlichesAlter(baujahr, modernisierung, bewertungsjahr) {
    const alterRoh = Math.max(0, bewertungsjahr - baujahr);
    const bonus    = MODERNISIERUNG_BONUS[modernisierung] ?? 0;
    return Math.max(0, alterRoh - bonus);
  }

  // ── Ertragswertverfahren — §§ 17–20 ImmoWertV ──────────
  //
  //   Bodenwert              = Grundstücksfläche × Bodenrichtwert
  //   Rohertrag              = Jahresnettokaltmiete
  //   Bewirtschaftungskosten = Verwaltung + Instandhaltung + Mietausfallwagnis  (§ 32 ImmoWertV)
  //   Reinertrag             = Rohertrag − Bewirtschaftungskosten
  //   Bodenwertverzinsung    = Bodenwert × Liegenschaftszinssatz
  //   Gebäudereinertrag      = Reinertrag − Bodenwertverzinsung
  //   Vervielfältiger        = Rentenbarwertfaktor(Liegenschaftszinssatz, Restnutzungsdauer)
  //   Gebäudeertragswert     = Gebäudereinertrag × Vervielfältiger
  //   Ertragswert            = Gebäudeertragswert + Bodenwert
  //
  function ertragswert(inputs) {
    const jahr = inputs.bewertungsjahr || new Date().getFullYear();
    const typ  = inputs.gebaeudetyp;
    const p    = LIEGENSCHAFTSZINS[typ]    ?? 0.045;
    const gnd  = GESAMTNUTZUNGSDAUER[typ]  ?? 80;

    const alter = wirtschaftlichesAlter(inputs.baujahr, inputs.modernisierung, jahr);
    const rnd   = Math.max(Math.round(gnd * 0.3), gnd - alter);

    const rohertrag              = inputs.jahresnettokaltmiete;
    const verwaltungskosten      = rohertrag * 0.03;
    const instandhaltungskosten  = inputs.flaeche * 12;
    const mietausfallwagnis      = rohertrag * 0.02;
    const bewirtschaftungskosten = verwaltungskosten + instandhaltungskosten + mietausfallwagnis;

    const reinertrag          = rohertrag - bewirtschaftungskosten;
    const bodenwert           = inputs.grundstuecksflaeche * inputs.bodenrichtwert;
    const bodenwertverzinsung = bodenwert * p;
    const gebaeudereinertrag  = Math.max(0, reinertrag - bodenwertverzinsung);

    const v                   = vervielfaeltiger(p, rnd);
    const gebaeudeertragswert = gebaeudereinertrag * v;
    const ergebnisRoh         = gebaeudeertragswert + bodenwert;
    const ergebnis            = round1000(ergebnisRoh);

    return {
      verfahren: 'ertragswert',
      titel: 'Ertragswertverfahren',
      rechtsgrundlage: '§§ 17–20 ImmoWertV',
      ergebnis,
      kennzahlen: [
        { label: 'Liegenschaftszinssatz', wert: (p * 100).toFixed(1) + ' %' },
        { label: 'Restnutzungsdauer',     wert: rnd + ' von ' + gnd + ' Jahren' },
        { label: 'Vervielfältiger',       wert: v.toFixed(2) },
        { label: 'Bewirtschaftungskosten', wert: eur(bewirtschaftungskosten) + ' / Jahr' },
      ],
      schritte: [
        {
          gruppe: 'Bodenwert',
          rows: [
            { label: 'Grundstücksfläche × Bodenrichtwert', formel: `${inputs.grundstuecksflaeche} m² × ${eur(inputs.bodenrichtwert)}/m²`, wert: bodenwert },
          ],
          summe: { label: 'Bodenwert', wert: bodenwert },
        },
        {
          gruppe: 'Rohertrag',
          rows: [
            { label: 'Jahresnettokaltmiete', formel: 'lt. Angabe', wert: rohertrag },
          ],
          summe: { label: 'Rohertrag', wert: rohertrag },
        },
        {
          gruppe: 'Bewirtschaftungskosten (§ 32 ImmoWertV)',
          rows: [
            { label: 'Verwaltungskosten',     formel: '3 % vom Rohertrag', wert: verwaltungskosten },
            { label: 'Instandhaltungskosten', formel: `${inputs.flaeche} m² × 12 €/m² · Jahr`, wert: instandhaltungskosten },
            { label: 'Mietausfallwagnis',     formel: '2 % vom Rohertrag', wert: mietausfallwagnis },
          ],
          summe: { label: 'Bewirtschaftungskosten gesamt', wert: bewirtschaftungskosten, subtract: true },
        },
        {
          gruppe: 'Reinertrag',
          rows: [],
          summe: { label: 'Reinertrag = Rohertrag − Bewirtschaftungskosten', wert: reinertrag },
        },
        {
          gruppe: 'Bodenwertverzinsung',
          rows: [
            { label: 'Bodenwert × Liegenschaftszinssatz', formel: `${eur(bodenwert)} × ${(p * 100).toFixed(1)} %`, wert: bodenwertverzinsung },
          ],
          summe: { label: 'Bodenwertverzinsung', wert: bodenwertverzinsung, subtract: true },
        },
        {
          gruppe: 'Gebäudereinertrag → Gebäudeertragswert',
          rows: [
            { label: 'Gebäudereinertrag', formel: 'Reinertrag − Bodenwertverzinsung', wert: gebaeudereinertrag },
            { label: 'Vervielfältiger (Rentenbarwertfaktor)', formel: `p = ${(p * 100).toFixed(1)} % · Restnutzungsdauer = ${rnd} Jahre`, wert: v, isFactor: true },
          ],
          summe: { label: 'Gebäudeertragswert = Gebäudereinertrag × Vervielfältiger', wert: gebaeudeertragswert },
        },
        {
          gruppe: 'Ertragswert',
          rows: [
            { label: 'Gebäudeertragswert', formel: '', wert: gebaeudeertragswert },
            { label: 'Bodenwert',          formel: '', wert: bodenwert },
          ],
          summe: { label: 'Ertragswert (gerundet)', wert: ergebnis, isResult: true },
        },
      ],
    };
  }

  // ── Sachwertverfahren — §§ 21–23 ImmoWertV ─────────────
  //
  //   Bodenwert            = Grundstücksfläche × Bodenrichtwert
  //   Herstellungskosten   = Bruttogrundfläche × Regelherstellungskosten (NHK 2010, indexiert)
  //   Alterswertminderung  = Herstellungskosten × (wirtschaftl. Alter ÷ Gesamtnutzungsdauer), gedeckelt 70 %
  //   Gebäudesachwert      = Herstellungskosten − Alterswertminderung
  //   Vorläufiger Sachwert = Bodenwert + Gebäudesachwert + Außenanlagenwert
  //   Sachwert             = Vorläufiger Sachwert × Sachwertfaktor (Marktanpassung)
  //
  function sachwert(inputs) {
    const jahr = inputs.bewertungsjahr || new Date().getFullYear();
    const typ  = inputs.gebaeudetyp;
    const gnd  = GESAMTNUTZUNGSDAUER[typ] ?? 80;
    const alter = wirtschaftlichesAlter(inputs.baujahr, inputs.modernisierung, jahr);

    const bgf        = inputs.flaeche * BGF_FAKTOR;
    const rhkBasis   = RHK_BASIS_2010[inputs.standard] ?? RHK_BASIS_2010.mittel;
    const rhkAktuell = rhkBasis * BAUPREISINDEX_FAKTOR;
    const herstellungskosten = bgf * rhkAktuell;

    const alterswertminderungQuote = Math.min(0.7, alter / gnd);
    const alterswertminderung      = herstellungskosten * alterswertminderungQuote;
    const gebaeudesachwert         = herstellungskosten - alterswertminderung;

    const bodenwert         = inputs.grundstuecksflaeche * inputs.bodenrichtwert;
    const aussenanlagenwert = gebaeudesachwert * 0.02;
    const vorlaeufigerSachwert = bodenwert + gebaeudesachwert + aussenanlagenwert;

    const sachwertfaktor = SACHWERTFAKTOR[typ] ?? 1.0;
    const ergebnisRoh    = vorlaeufigerSachwert * sachwertfaktor;
    const ergebnis       = round1000(ergebnisRoh);

    return {
      verfahren: 'sachwert',
      titel: 'Sachwertverfahren',
      rechtsgrundlage: '§§ 21–23 ImmoWertV',
      ergebnis,
      kennzahlen: [
        { label: 'Bruttogrundfläche (BGF)', wert: Math.round(bgf).toLocaleString('de-DE') + ' m²' },
        { label: 'Wirtschaftl. Alter',      wert: alter + ' von ' + gnd + ' Jahren' },
        { label: 'Alterswertminderung',     wert: (alterswertminderungQuote * 100).toFixed(0) + ' %' },
        { label: 'Sachwertfaktor',          wert: sachwertfaktor.toFixed(2) },
      ],
      schritte: [
        {
          gruppe: 'Bodenwert',
          rows: [
            { label: 'Grundstücksfläche × Bodenrichtwert', formel: `${inputs.grundstuecksflaeche} m² × ${eur(inputs.bodenrichtwert)}/m²`, wert: bodenwert },
          ],
          summe: { label: 'Bodenwert', wert: bodenwert },
        },
        {
          gruppe: 'Herstellungskosten (Regelherstellungskosten NHK 2010)',
          rows: [
            { label: 'Bruttogrundfläche (BGF)', formel: `${inputs.flaeche} m² Wohnfläche × Umrechnungsfaktor ${BGF_FAKTOR}`, wert: bgf, isArea: true },
            { label: `Regelherstellungskosten (Standard: ${inputs.standard})`, formel: `${rhkBasis} €/m² × Baupreisindex ${BAUPREISINDEX_FAKTOR}`, wert: rhkAktuell, isRate: true },
          ],
          summe: { label: 'Herstellungskosten = BGF × Regelherstellungskosten', wert: herstellungskosten },
        },
        {
          gruppe: 'Alterswertminderung',
          rows: [
            { label: `Wirtschaftliches Alter ${alter} J. ÷ Gesamtnutzungsdauer ${gnd} J.`, formel: `${(alterswertminderungQuote * 100).toFixed(1)} % der Herstellungskosten (gedeckelt auf 70 %)`, wert: alterswertminderung },
          ],
          summe: { label: 'Alterswertminderung', wert: alterswertminderung, subtract: true },
        },
        {
          gruppe: 'Gebäudesachwert',
          rows: [],
          summe: { label: 'Gebäudesachwert = Herstellungskosten − Alterswertminderung', wert: gebaeudesachwert },
        },
        {
          gruppe: 'Vorläufiger Sachwert',
          rows: [
            { label: 'Bodenwert',                          formel: '', wert: bodenwert },
            { label: 'Gebäudesachwert',                    formel: '', wert: gebaeudesachwert },
            { label: 'Wert der Außenanlagen',              formel: 'pauschal 2 % vom Gebäudesachwert', wert: aussenanlagenwert },
          ],
          summe: { label: 'Vorläufiger Sachwert', wert: vorlaeufigerSachwert },
        },
        {
          gruppe: 'Marktanpassung',
          rows: [
            { label: 'Sachwertfaktor (regionale Marktanpassung)', formel: `× ${sachwertfaktor.toFixed(2)}`, wert: sachwertfaktor, isFactor: true },
          ],
          summe: { label: 'Sachwert (gerundet)', wert: ergebnis, isResult: true },
        },
      ],
    };
  }

  return {
    ertragswert,
    sachwert,
    eur,
    LIEGENSCHAFTSZINS,
    GESAMTNUTZUNGSDAUER,
    RHK_BASIS_2010,
    SACHWERTFAKTOR,
  };
})();
