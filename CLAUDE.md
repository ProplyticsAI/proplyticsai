# Proplytic.ai Design System — CLAUDE.md

## Marke

- **Präzise** Immobilien-KI
- **Blau-Grau (Slate)** als Hauptfarbe (kühl, sachlich, vertrauenswürdig)
- **Teal** als Akzent-/CTA-Farbe
- **Cormorant Garamond** für Headlines (Serif, elegant)
- **System-Sans** für Body
- **Kein Dark Mode**

## Logo

- **Keine Logo-Grafik.** Marke wird ausschließlich als **Text-Wortmarke** geführt:
  `proplytic` + `.ai` (der Punkt-Suffix `.ai` in Teal `--color-primary`).
- Markup: `proplytic<span class="wordmark-dot">.ai</span>`, Klasse `.wordmark`
  (`.wordmark-light` auf der Slate-Sidebar, `.wordmark-dark` auf hellen Flächen).
- Schrift: Cormorant Garamond (`--font-serif`). Die alten SVG-Dateien in `brand/`
  werden nicht mehr eingebunden.

## Farben

Single Source: `tokens/colors.css` (`:root`). Hauptschema **hell blau-grau**:
heller Hintergrund, weiße Karten, dunkle **Slate-Sidebar**, **Teal**-Akzent, Ink-Text.

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--color-background` | `#EEF2F5` | Haupthintergrund (helles Blaugrau) |
| `--color-surface` | `#FFFFFF` | Karten, Panels (weiß) |
| `--color-foreground` | `#1B2733` | Haupttext (Tinte) |
| `--color-muted` | `#5E6B78` | Sekundärtext (blaugrau) |
| `--color-primary` | `#3AA7B5` | Teal — Aktionen, Links, CTAs |
| `--color-secondary` | `#2E4150` | Slate — Strukturflächen, Sidebar |
| `--color-border` | `#DCE3E9` | Blaugraue Trennlinien |
| `--color-success` | `#2E8B57` | Erfolg (grün) |
| `--color-warning` | `#C4883A` | Warnung (warm orange) |
| `--color-error` | `#B84A3C` | Fehler (gedecktes rot) |
| `--color-info` | `#2E4150` | Info (slate) |

### Tech-Tokens (Slate · Teal · Tinte)

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--color-ink` | `#1B2733` | Tinte — Text auf hellen Flächen |
| `--color-slate` | `#2E4150` | Blaugrau — Sidebar, sekundäre Oberflächen |
| `--color-slate-hover` | `#243444` | Slate Hover |
| `--color-teal` | `#3AA7B5` | Teal-Akzent — Highlights, CTAs |
| `--color-teal-hover` | `#2E8F9C` | Teal Hover |

> **Hinweis:** Primary-Buttons nutzen das tiefere Teal `--color-primary-hover`
> (`#2E8F9C`) als Basis, damit weißer Text ausreichend Kontrast hat; hellere
> Teal-Akzente (Links, aktiver Nav-Punkt) bleiben `#3AA7B5`.

## Typografie

- **Headlines**: Cormorant Garamond (serif)
- **Body**: System sans-serif
- **Mono**: JetBrains Mono
- **Scale**: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60px
- **Headline Tracking**: -0.02em

## Spacing

4px Base-Grid: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80

## Radius

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px

## Shadows

- Cards: `0 1px 3px rgba(0,0,0,0.05)`
- Hover: `0 4px 12px rgba(0,0,0,0.08)`

## Anti-Patterns

- KEINE gradients (nur für Text-Highlights erlaubt)
- KEIN glassmorphism
- KEINE Emoji als Icons
- KEINE rounded pill-Buttons überall
- KEINE übertriebenen Schatten
- KEINE lila/blauen Tech-Gradienten

## Workflow

1. Token ändern → neu berechnen
2. Komponente bauen → Review
3. Review bestanden → Commit
4. Chunking: max 3 Dateien pro PR

## Referenz

Tokens: `tokens/`
Brand: `brand/`
Komponenten: `components/`
