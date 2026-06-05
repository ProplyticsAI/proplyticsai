// logo.jsx — Custom logo marks for Proplytics (Property + Analytics).
// Real-estate valuation. Marks are built from precise geometry only
// (squares, ticks, gables, ascending steps) to match the engineered,
// editorial "Kontor" aesthetic. Each takes { size, color, accent }.
// Exports the marks + a Wordmark lockup to window.

// ---------------------------------------------------------------------------
// MARK A — "Apex"  (RECOMMENDED)
// Three ascending steps (the three Verfahren) rising to a square value-node
// at the peak. Reads at once as: a roof gable, a rising valuation, a map pin
// apex. The single accent node is the determined market value.
// ---------------------------------------------------------------------------
function MarkApex({ size = 32, color = '#2D5A3D', accent = '#3050C8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: 'block', flex: '0 0 auto' }}>
      <path d="M4.5 27 L4.5 20.5 L12 20.5 L12 14 L19.5 14 L19.5 9"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="15.9" y="5.4" width="7.2" height="7.2" rx="1.6" fill={accent} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK B — "Parcel P"  monogram on a cadastral grid
// A square plot (rounded) with the counter of a "P" cut from negative space
// and one subdivision hairline — the Flurstück / parcel.
// ---------------------------------------------------------------------------
function MarkParcel({ size = 32, color = '#2D5A3D', accent = '#3050C8', reverse = false }) {
  if (reverse) {
    // outline variant for dark/green surfaces
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
        style={{ display: 'block', flex: '0 0 auto' }}>
        <rect x="4" y="4" width="24" height="24" rx="6" fill="none" stroke={color} strokeWidth="2.2" />
        <path d="M12 24 L12 9 L18.5 9 A4.5 4.5 0 0 1 18.5 18 L12 18"
          stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="20.5" y="20.5" width="3.4" height="3.4" rx="0.8" fill={accent} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: 'block', flex: '0 0 auto' }}>
      <rect x="4" y="4" width="24" height="24" rx="6" fill={color} />
      <path d="M12 24 L12 9 L18.5 9 A4.5 4.5 0 0 1 18.5 18 L12 18"
        stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="20.5" y="20.5" width="3.4" height="3.4" rx="0.8" fill={accent} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK C — "Benchmark"  surveyor's reference mark
// A precise rotated square (Vermessungspunkt) with crosshair ticks and a
// center value-node. Speaks to surveying precision & valuation accuracy.
// ---------------------------------------------------------------------------
function MarkBenchmark({ size = 32, color = '#2D5A3D', accent = '#3050C8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: 'block', flex: '0 0 auto' }}>
      <rect x="16" y="3.5" width="17.7" height="17.7" rx="3" transform="rotate(45 16 3.5)"
        stroke={color} strokeWidth="2.4" />
      <path d="M16 1.5 L16 7 M16 25 L16 30.5 M1.5 16 L7 16 M25 16 L30.5 16"
        stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.4" fill={accent} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK D — "Gable"  pure roof + value point
// A clean gable of two strokes with a square node at the apex, on a baseline.
// The most minimal, most "real-estate" read. Great as a favicon.
// ---------------------------------------------------------------------------
function MarkGable({ size = 32, color = '#2D5A3D', accent = '#3050C8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: 'block', flex: '0 0 auto' }}>
      <path d="M5 23 L16 9 L27 23"
        stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 27 L27 27"
        stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.34" />
      <rect x="12.4" y="5.2" width="7.2" height="7.2" rx="1.6" fill={accent} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MARK E — "Column"  built environment + bar chart
// Four ascending columns inside an implied plot, the tallest capped with the
// accent value-node. Building columns ↔ data columns.
// ---------------------------------------------------------------------------
function MarkColumn({ size = 32, color = '#2D5A3D', accent = '#3050C8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: 'block', flex: '0 0 auto' }}>
      <rect x="5" y="20" width="4.4" height="7" rx="1.2" fill={color} opacity="0.4" />
      <rect x="11.2" y="16" width="4.4" height="11" rx="1.2" fill={color} opacity="0.62" />
      <rect x="17.4" y="11" width="4.4" height="16" rx="1.2" fill={color} />
      <rect x="23.6" y="6.6" width="4.4" height="4.4" rx="1.2" fill={accent} />
      <rect x="23.6" y="13" width="4.4" height="14" rx="1.2" fill={color} />
      <path d="M4 27 L28 27" stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.34" />
    </svg>
  );
}

const MARKS = {
  Apex: MarkApex,
  Parcel: MarkParcel,
  Benchmark: MarkBenchmark,
  Gable: MarkGable,
  Column: MarkColumn,
};

// ---------------------------------------------------------------------------
// Wordmark lockup — mark + "proplytic.ai" set in Bodoni Moda (brand serif).
// The ".ai" suffix is rendered in the accent colour as a distinct token.
// ---------------------------------------------------------------------------
function Wordmark({ mark = 'Apex', size = 28, color = '#2D5A3D', accent = '#3050C8',
  ink = '#1A1A1A', gap = 11, fontSize, serif = "'Bodoni Moda', Georgia, serif" }) {
  const Mark = MARKS[mark] || MarkApex;
  const fs = fontSize || size * 0.86;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Mark size={size} color={color} accent={accent} />
      <span style={{ fontFamily: serif, fontSize: fs, fontWeight: 600,
        letterSpacing: '.005em', lineHeight: 1 }}>
        <span style={{ color: ink }}>proplytic</span><span style={{ color: accent }}>.ai</span>
      </span>
    </span>
  );
}

Object.assign(window, {
  MarkApex, MarkParcel, MarkBenchmark, MarkGable, MarkColumn, MARKS, Wordmark,
});
