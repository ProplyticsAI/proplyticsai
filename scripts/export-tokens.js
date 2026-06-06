#!/usr/bin/env node
/**
 * scripts/export-tokens.js
 * Liest alle CSS-Token-Dateien und exportiert die Custom Properties
 * als strukturiertes JSON nach dist/tokens.json.
 *
 * Aufruf: node scripts/export-tokens.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const TOKEN_FILES = [
  { file: 'tokens/colors.css',     group: 'colors'     },
  { file: 'tokens/typography.css', group: 'typography' },
  { file: 'tokens/spacing.css',    group: 'spacing'    },
];

// Extrahiert aktive Sektion aus Kommentaren (/* === TITEL === */)
function parseSection(comment) {
  const m = comment.match(/\/\*[=\s-]*([A-ZÄÖÜa-zäöü/ ]+?)[=\s-]*\*\//);
  return m ? m[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '_') : null;
}

function parseTokenFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const result  = {};
  let section   = 'root';

  // Zeilenweise verarbeiten
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();

    // Abschnitt-Kommentar erkennen
    if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
      const s = parseSection(trimmed);
      if (s) section = s;
    }

    // CSS Custom Property: --name: value;
    const propMatch = trimmed.match(/^(--[\w-]+)\s*:\s*(.+?)\s*(?:\/\*.*?\*\/)?\s*;/);
    if (propMatch) {
      const [, name, value] = propMatch;
      if (!result[section]) result[section] = {};
      result[section][name] = value.trim();
    }
  }

  return result;
}

// Konvertiert CSS-Wert in primitiven JS-Wert wo möglich
function coerce(value) {
  // rem → px (16px base)
  if (/^\d+(\.\d+)?rem$/.test(value)) {
    return { rem: parseFloat(value), px: Math.round(parseFloat(value) * 16) };
  }
  // px
  if (/^\d+(\.\d+)?px$/.test(value)) {
    return { px: parseFloat(value) };
  }
  // ms
  if (/^\d+ms$/.test(value)) {
    return { ms: parseInt(value) };
  }
  // Zahl
  if (/^\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value);
  }
  return value;
}

function processTokens(raw) {
  const out = {};
  for (const [section, props] of Object.entries(raw)) {
    out[section] = {};
    for (const [name, value] of Object.entries(props)) {
      // --color-primary → primary
      const key = name.replace(/^--[\w]+-/, '').replace(/-/g, '_');
      out[section][key] = {
        variable: name,
        value:    coerce(value),
      };
    }
  }
  return out;
}

function exportTokens() {
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

  const output = {
    meta: {
      generated: new Date().toISOString(),
      source:    TOKEN_FILES.map(t => t.file),
    },
    tokens: {},
  };

  for (const { file, group } of TOKEN_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn(`  ⚠  Nicht gefunden: ${file}`);
      continue;
    }
    const raw       = parseTokenFile(full);
    output.tokens[group] = processTokens(raw);
    console.log(`  ✓  ${file}  (${Object.values(raw).reduce((n, s) => n + Object.keys(s).length, 0)} Tokens)`);
  }

  // Flat-Map aller Variablennamen für schnellen Lookup
  const flat = {};
  for (const group of Object.values(output.tokens)) {
    for (const section of Object.values(group)) {
      for (const [, token] of Object.entries(section)) {
        if (token && token.variable) flat[token.variable] = token.value;
      }
    }
  }
  output.flat = flat;

  const json    = JSON.stringify(output, null, 2);
  const outPath = path.join(DIST, 'tokens.json');
  fs.writeFileSync(outPath, json);

  const kb    = (Buffer.byteLength(json, 'utf8') / 1024).toFixed(1);
  const total = Object.keys(flat).length;
  console.log(`✓  dist/tokens.json  (${kb} kB, ${total} Tokens gesamt)`);
}

exportTokens();
