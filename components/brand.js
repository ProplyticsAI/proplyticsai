// proplytic.ai brand tokens — Ledger theme
const LEDGER_BASE = {
  key: 'ledger',
  mode: 'light',
  ink: '#1B2733',
  muted: '#566571',
  faint: '#93A1AC',
  accent: '#2E4150',
  accentSoft: '#E7ECF1',
  onAccent: '#FFFFFF',
  highlight: '#3AA7B5',
  highlightSoft: '#DDEEF1',
  onHighlight: '#FFFFFF',
  pos: '#2E8A66',
  neg: '#C25A43',
  data: '#3AA7B5',
  display: "'DM Sans', system-ui, sans-serif",
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
  radius: 8,
  radiusLg: 14,
  hair: 1,
  shadow: '0 1px 2px rgba(27,39,51,.05), 0 18px 40px -28px rgba(27,39,51,.30)',
  primaryBg: '#2E4150',
  primaryFg: '#FFFFFF',
};

const LEDGER_VARIANTS = {
  klar:      { page: '#F1F4F7', surface: '#FFFFFF', surface2: '#EEF2F5', sunken: '#E7ECF1', line: '#E3E8EE', lineStrong: '#CFD7E0', mapLand: '#E6EAEF', glass: 'rgba(248,250,252,0.78)' },
  nebel:     { page: '#E8EDF2', surface: '#F7FAFC', surface2: '#E1E8EF', sunken: '#DAE2EA', line: '#D6DEE7', lineStrong: '#C0CAD5', mapLand: '#DCE3EA', glass: 'rgba(240,245,249,0.80)' },
  porzellan: { page: '#F2F3F2', surface: '#FFFFFF', surface2: '#EBEDEC', sunken: '#E4E7E5', line: '#E1E4E2', lineStrong: '#CCD1CF', mapLand: '#E7EAE8', glass: 'rgba(249,250,250,0.80)' },
};

export function makeLedger(variant = 'nebel') {
  return { ...LEDGER_BASE, ...(LEDGER_VARIANTS[variant] || LEDGER_VARIANTS.nebel) };
}

export const t = makeLedger('nebel');
export default t;
