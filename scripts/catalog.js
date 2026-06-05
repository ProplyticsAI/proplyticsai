#!/usr/bin/env node
/**
 * scripts/catalog.js
 * Generiert components/index.html — eine Übersichtsseite
 * mit allen Komponenten-Demos als verlinkte Karten.
 *
 * Aufruf: node scripts/catalog.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT       = path.resolve(__dirname, '..');
const COMPONENTS = path.join(ROOT, 'components');
const LAYOUTS    = path.join(ROOT, 'layouts');

// Metadaten pro Komponente
const META = {
  'avatar':         { label: 'Avatar',          desc: 'Initialen, Bild, Status-Dot, Gruppe',           group: 'Anzeige' },
  'badge':          { label: 'Badge',            desc: 'subtle · solid · outline · dot · 6 Farben',     group: 'Anzeige' },
  'button':         { label: 'Button',           desc: 'primary · secondary · ghost · outline · icon',  group: 'Aktion'  },
  'card':           { label: 'Card',             desc: 'default · flat · interactive · accent · stat',  group: 'Layout'  },
  'checkbox-radio': { label: 'Checkbox & Radio', desc: 'checked · indeterminate · card-variante',       group: 'Formular'},
  'dropdown':       { label: 'Dropdown',         desc: 'Aktionen, Checkmarks, Gruppen, danger',         group: 'Aktion'  },
  'input':          { label: 'Input / FormField',desc: 'text · select · textarea · icon · addon',       group: 'Formular'},
  'modal':          { label: 'Modal',            desc: 'Formular · Confirm · Info · sm–xl',             group: 'Overlay' },
  'pagination':     { label: 'Pagination',       desc: 'standard · compact · simple',                   group: 'Navigation'},
  'skeleton':       { label: 'Skeleton',         desc: 'Shimmer-Ladezustand für Cards, Tabellen, Feed', group: 'Anzeige' },
  'switch':         { label: 'Switch',           desc: 'sm/md/lg · Einstellungen-Gruppe',               group: 'Formular'},
  'table':          { label: 'Table',            desc: 'sortierbar · striped · kompakt · pagination',   group: 'Daten'   },
  'tabs':           { label: 'Tabs',             desc: 'underline · pills · boxed · sm/md/lg',          group: 'Navigation'},
  'toast':          { label: 'Toast',            desc: 'success · warning · error · info · auto-close', group: 'Overlay' },
  'tooltip':        { label: 'Tooltip',          desc: 'CSS-only · top/bottom/left/right',              group: 'Overlay' },
};

const LAYOUT_META = {
  'dashboard': { label: 'Dashboard',        desc: 'Sidebar · Header · KPI-Grid · Aktivitäts-Feed' },
  'detail':    { label: 'Objekt-Detailseite', desc: 'Hero · KPI-Strip · Tabs · Analyse-Panel'     },
};

const GROUP_ORDER = ['Aktion', 'Formular', 'Anzeige', 'Daten', 'Navigation', 'Overlay', 'Layout'];

const GROUP_COLORS = {
  'Aktion':     { bg: '#E8F0EA', color: '#2D5A3D' },
  'Formular':   { bg: '#EDF1F6', color: '#2C4A6E' },
  'Anzeige':    { bg: '#F5F0E8', color: '#7A7A7A' },
  'Daten':      { bg: '#FDF3E7', color: '#C4883A' },
  'Navigation': { bg: '#E8F0EA', color: '#2D5A3D' },
  'Overlay':    { bg: '#FAECEA', color: '#B84A3C' },
  'Layout':     { bg: '#EDF1F6', color: '#2C4A6E' },
};

function groupComponents() {
  const groups = {};
  for (const [key, meta] of Object.entries(META)) {
    const file = path.join(COMPONENTS, `${key}.html`);
    if (!fs.existsSync(file)) continue;
    const g = meta.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push({ key, ...meta });
  }
  return groups;
}

function componentCard(comp) {
  const { key, label, desc, group } = comp;
  const gc = GROUP_COLORS[group] || GROUP_COLORS['Anzeige'];
  return `
      <a class="comp-card" href="./${key}.html" target="_blank">
        <span class="comp-tag" style="background:${gc.bg};color:${gc.color};">${group}</span>
        <h3 class="comp-name">${label}</h3>
        <p class="comp-desc">${desc}</p>
        <span class="comp-link">Demo öffnen →</span>
      </a>`;
}

function layoutCard(key, meta) {
  return `
      <a class="comp-card comp-card-layout" href="../layouts/${key}.html" target="_blank">
        <span class="comp-tag" style="background:#EDF1F6;color:#2C4A6E;">Layout</span>
        <h3 class="comp-name">${meta.label}</h3>
        <p class="comp-desc">${meta.desc}</p>
        <span class="comp-link">Demo öffnen →</span>
      </a>`;
}

function generate() {
  const groups  = groupComponents();
  const total   = Object.values(groups).reduce((n, g) => n + g.length, 0);
  const now     = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  let sections = '';
  for (const groupName of GROUP_ORDER) {
    const comps = groups[groupName];
    if (!comps || comps.length === 0) continue;
    sections += `
    <section class="group">
      <h2 class="group-title">${groupName}</h2>
      <div class="grid">
        ${comps.map(componentCard).join('')}
      </div>
    </section>`;
  }

  // Layout-Sektion
  const layoutCards = Object.entries(LAYOUT_META)
    .filter(([key]) => fs.existsSync(path.join(LAYOUTS, `${key}.html`)))
    .map(([key, meta]) => layoutCard(key, meta))
    .join('');

  if (layoutCards) {
    sections += `
    <section class="group">
      <h2 class="group-title">Layouts</h2>
      <div class="grid">
        ${layoutCards}
      </div>
    </section>`;
  }

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Komponenten — Proplytic.ai Design System</title>
  <link rel="stylesheet" href="../tokens/tokens.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      line-height: var(--leading-normal);
      padding: var(--space-16) var(--space-10);
      max-width: 1200px;
      margin: 0 auto;
    }
    .header { margin-bottom: var(--space-12); }
    .header-top { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-3); }
    .page-title { font-family: var(--font-serif); font-size: var(--text-5xl); font-weight: var(--font-normal); letter-spacing: var(--tracking-tight); }
    .page-subtitle { font-size: var(--text-base); color: var(--color-muted); }
    .meta { font-size: var(--text-xs); color: var(--color-muted); text-align: right; line-height: 1.6; }
    .meta strong { color: var(--color-foreground); font-weight: var(--font-semibold); }
    .group { margin-bottom: var(--space-12); }
    .group-title {
      font-family: var(--font-serif); font-size: var(--text-2xl); font-weight: var(--font-normal);
      letter-spacing: var(--tracking-tight); margin-bottom: var(--space-5);
      padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4); }
    .comp-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      text-decoration: none;
      color: var(--color-foreground);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
    }
    .comp-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--color-border-strong);
      transform: translateY(-1px);
    }
    .comp-card-layout { border-left: 3px solid var(--color-secondary); }
    .comp-tag {
      display: inline-flex; align-items: center;
      padding: 2px var(--space-2); border-radius: var(--radius-sm);
      font-size: var(--text-2xs); font-weight: var(--font-semibold);
      letter-spacing: 0.05em; text-transform: uppercase;
      width: fit-content;
    }
    .comp-name { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: var(--font-normal); letter-spacing: var(--tracking-tight); margin-top: var(--space-1); }
    .comp-desc { font-size: var(--text-xs); color: var(--color-muted); line-height: var(--leading-normal); flex: 1; }
    .comp-link { font-size: var(--text-xs); color: var(--color-primary); font-weight: var(--font-medium); margin-top: var(--space-2); }
    .comp-card:hover .comp-link { text-decoration: underline; }
    footer { margin-top: var(--space-16); padding-top: var(--space-6); border-top: 1px solid var(--color-border); font-size: var(--text-xs); color: var(--color-muted); display: flex; justify-content: space-between; }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-top">
      <div>
        <h1 class="page-title">Design System</h1>
        <p class="page-subtitle">Proplytic.ai · Komponenten & Layouts</p>
      </div>
      <div class="meta">
        <strong>${total + Object.keys(LAYOUT_META).length}</strong> Komponenten &amp; Layouts<br>
        Generiert: ${now}
      </div>
    </div>
  </div>

  ${sections}

  <footer>
    <span>Proplytic.ai Design System</span>
    <span>Generiert von scripts/catalog.js</span>
  </footer>

</body>
</html>`;

  const outPath = path.join(COMPONENTS, 'index.html');
  fs.writeFileSync(outPath, html);
  console.log(`✓  components/index.html  (${total} Komponenten + ${Object.keys(LAYOUT_META).length} Layouts)`);
}

generate();
