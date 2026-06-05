// landing-shared.jsx — palette tokens, content data, shared atoms for the
// three Proplytics landing directions. Exports to window.

// ---- Palette (from DESIGN.md + new royal blue) -------------------------
const PAL = {
  cream:    '#F5F3EF',
  cream2:   '#F0EEE9',
  card:     '#FFFFFF',
  ink:      '#1A1A1A',
  ink2:     '#3A3A38',
  muted:    '#6B6B66',
  border:   '#E5E3DF',
  green:    '#2D5A3D',
  greenLt:  '#4A7C59',
  // new royal blue (user picked #3050C8) + supporting tints/shades
  blue:     '#3050C8',
  blueDeep: '#1E2F7A',
  blueInk:  '#16205A',
  blueLt:   '#E7EAFA',
  blueLt2:  '#F1F3FC',
  gold:     '#B89357',
};

// ---- Content (German — brand is German) --------------------------------
const C = {
  brand: 'proplytic.ai',
  nav: ['Produkt', 'Verfahren', 'Preise', 'Academy'],
  badge: 'ImmoWertV 2024 konform',
  h1a: 'Immobilien bewerten,',
  h1b: 'ohne Bauchgefühl.',
  sub: 'KI-gestützte Bewertung nach ImmoWertV 2024 — Ertrags-, Sach- und Vergleichswertverfahren in einem prüffähigen Bericht. In Minuten statt Wochen.',
  micro: 'Keine Kreditkarte · DSGVO-konform · Ergebnis in 2 Minuten',
  ctaPrimary: 'Kostenlos starten',
  ctaSecondary: 'Demo ansehen',
  trustLabel: 'Im Einsatz bei Banken, Maklern und Sachverständigen',
  stats: [
    { n: '47.000+', l: 'Bewertungen erstellt' },
    { n: '±2,8\u202f%', l: 'Ø Abweichung zum Gutachten' },
    { n: '3', l: 'anerkannte Verfahren' },
    { n: '2\u202fMin', l: 'bis zum Ergebnis' },
  ],
  methodsTitle: 'Drei Verfahren. Ein Bericht.',
  methodsLede: 'proplytic.ai ermittelt den Marktwert nach allen drei in der ImmoWertV 2024 anerkannten Verfahren — und erklärt, welches für Ihr Objekt zählt.',
  methods: [
    { k: '01', t: 'Ertragswertverfahren', d: 'Für Kapitalanlagen. Der Wert ergibt sich aus nachhaltig erzielbaren Mieterträgen, Bewirtschaftungskosten und Liegenschaftszins.' },
    { k: '02', t: 'Sachwertverfahren', d: 'Für Eigennutzer. Bodenwert plus Gebäudesachwert nach NHK 2010, Alterswertminderung und regionalem Sachwertfaktor.' },
    { k: '03', t: 'Vergleichswertverfahren', d: 'Für Standardobjekte. Marktwert aus realen Vergleichspreisen der Region, bereinigt um Lage, Zustand und Ausstattung.' },
  ],
  stepsTitle: 'So funktioniert\u2019s',
  steps: [
    { n: '1', t: 'Objektdaten eingeben', d: 'PLZ, Objekttyp, Fläche und Kaufpreis — oder ein ImmoScout-Exposé per Link importieren.' },
    { n: '2', t: 'KI analysiert', d: 'Marktdaten, Lage und Bausubstanz fließen automatisch in alle drei Verfahren ein.' },
    { n: '3', t: 'Bericht erhalten', d: 'Prüffähiges PDF mit Marktwert, Spannen und Renditeanalyse — für Bank und Gutachter.' },
  ],
  mapTitle: 'Marktdaten, die zählen.',
  mapLede: 'Bodenrichtwerte, Mietspiegel und reale Transaktionspreise — laufend aktualisiert und auf die Mikrolage Ihres Objekts bezogen.',
  mapBullets: ['Bodenrichtwerte je Gemarkung', 'Mietspiegel & Vergleichsmieten', 'Lagebewertung bis auf Straßenebene', 'Stresstest für Zins- & Mietszenarien'],
  ctaBandTitle: 'Bewerten Sie Ihre erste Immobilie — kostenlos.',
  ctaBandSub: 'In zwei Minuten zum prüffähigen Marktwert. Keine Installation, keine Kreditkarte.',
  footerNote: '© 2026 proplytic.ai · Bewertung nach anerkannten Methoden der ImmoWertV 2024',
  footerCols: [
    { h: 'Produkt', items: ['Bewertung', 'Vergleich', 'Energieausweis', 'Marktplatz'] },
    { h: 'Ressourcen', items: ['Academy', 'ImmoWertV 2024', 'API-Docs', 'Support'] },
    { h: 'Unternehmen', items: ['Über uns', 'Datenschutz', 'Impressum', 'Kontakt'] },
  ],
};

// ---- Pin logo mark (simple geometry) -----------------------------------
function PinMark({ size = 26, color = PAL.green, dot = '#fff' }) {
  return (
    React.createElement('span', {
      style: { display: 'inline-flex', width: size, height: size, borderRadius: size * 0.34,
        background: color, alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' } },
      React.createElement('span', { style: { width: size * 0.30, height: size * 0.30, borderRadius: '50%',
        background: dot, boxShadow: `0 0 0 ${size * 0.07}px ${color}` } })
    )
  );
}

// ---- Striped image placeholder -----------------------------------------
function Placeholder({ label, height = 300, radius = 6, tint = '#D9D6CF', label2, style = {} }) {
  return (
    React.createElement('div', {
      style: {
        position: 'relative', height, borderRadius: radius, overflow: 'hidden',
        background: `repeating-linear-gradient(135deg, ${tint} 0 2px, transparent 2px 13px), ${PAL.cream2}`,
        border: `1px solid ${PAL.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        ...style,
      } },
      React.createElement('span', { style: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, letterSpacing: '.06em',
        textTransform: 'uppercase', color: PAL.muted, background: PAL.card, padding: '5px 11px',
        borderRadius: 4, border: `1px solid ${PAL.border}` } }, label),
      label2 ? React.createElement('span', { style: {
        fontFamily: 'ui-monospace, monospace', fontSize: 11, color: PAL.muted, opacity: .8 } }, label2) : null
    )
  );
}

Object.assign(window, { PAL, C, PinMark, Placeholder });
