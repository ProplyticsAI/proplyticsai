#!/usr/bin/env node
/**
 * scripts/build.js
 * Bündelt alle Design-Token- und Komponenten-CSS-Dateien
 * zu dist/proplytic.css zusammen.
 *
 * Aufruf: node scripts/build.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Reihenfolge: Tokens zuerst, dann Komponenten alphabetisch
const TOKEN_FILES = [
  'tokens/colors.css',
  'tokens/typography.css',
  'tokens/spacing.css',
];

const COMPONENT_FILES = [
  'components/avatar.css',
  'components/badge.css',
  'components/button.css',
  'components/card.css',
  'components/checkbox-radio.css',
  'components/dropdown.css',
  'components/input.css',
  'components/modal.css',
  'components/pagination.css',
  'components/skeleton.css',
  'components/switch.css',
  'components/table.css',
  'components/tabs.css',
  'components/toast.css',
  'components/tooltip.css',
];

const LAYOUT_FILES = [
  'layouts/dashboard.css',
  'layouts/detail.css',
];

// Google Fonts @import separat ans Dokument-Ende stellen
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap');";

function readFile(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    console.warn(`  ⚠  Nicht gefunden: ${rel}`);
    return '';
  }
  let content = fs.readFileSync(full, 'utf8');
  // @import url() für Fonts entfernen — wird oben gebündelt
  content = content.replace(/@import\s+url\([^)]+\);?\s*/g, '');
  return content.trim();
}

function section(title) {
  const line = '='.repeat(60 - title.length - 4);
  return `\n/* ${'─'.repeat(58)} */\n/* ${title.toUpperCase()} */\n/* ${'─'.repeat(58)} */\n`;
}

function build() {
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

  const now  = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const ver  = '0.1.0';
  const files = [...TOKEN_FILES, ...COMPONENT_FILES, ...LAYOUT_FILES];

  const banner = `/*!\n * Proplytic.ai Design System v${ver}\n * Generiert: ${now}\n * ${files.length} Dateien gebündelt\n */\n`;

  const parts = [banner, FONT_IMPORT];

  parts.push(section('Design Tokens'));
  for (const f of TOKEN_FILES) {
    const content = readFile(f);
    if (content) {
      parts.push(`/* ── ${f} ── */`);
      parts.push(content);
    }
  }

  parts.push(section('Komponenten'));
  for (const f of COMPONENT_FILES) {
    const content = readFile(f);
    if (content) {
      parts.push(`/* ── ${f} ── */`);
      parts.push(content);
    }
  }

  parts.push(section('Layouts'));
  for (const f of LAYOUT_FILES) {
    const content = readFile(f);
    if (content) {
      parts.push(`/* ── ${f} ── */`);
      parts.push(content);
    }
  }

  const output = parts.join('\n\n') + '\n';
  const outPath = path.join(DIST, 'proplytic.css');
  fs.writeFileSync(outPath, output);

  const kb = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
  console.log(`✓  dist/proplytic.css  (${kb} kB, ${files.length} Dateien)`);
}

build();
