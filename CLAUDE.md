# Proplytic.ai Design System — CLAUDE.md

## Marke

- **Präzise** Immobilien-KI
- **Beige** als Hauptfarbe (warm,vertrauenswürdig)
- **Dunkelgrün + Dunkelblau** als Highlight-Akzente
- **Cormorant Garamond** für Headlines (Serif, elegant)
- **System-Sans** für Body
- **Kein Dark Mode**

## Logo

| Datei | Verwendung |
|-------|------------|
| `brand/logo-lockup.svg` | Hauptschriftzug + Icon |
| `brand/logo-pin.svg` | Icon allein (dunkel) |
| `brand/logo-pin-light.svg` | Icon allein (hell/dunkel Kontext) |

## Farben

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--color-background` | `#F5F0E8` | Haupthintergrund (warm Beige) |
| `--color-surface` | `#FDFBF7` | Karten, Panels (helleres Beige) |
| `--color-foreground` | `#1A1A1A` | Haupttext |
| `--color-muted` | `#7A7A7A` | Sekundärtext |
| `--color-primary` | `#2D5A3D` | Dunkelgrün — Aktionen, Links |
| `--color-secondary` | `#2C4A6E` | Dunkelblau — Highlights, Akzente |
| `--color-border` | `#E5E0D5` | Beige-graue Trennlinien |
| `--color-success` | `#2D5A3D` | Erfolg (grün) |
| `--color-warning` | `#C4883A` | Warnung (warm orange) |
| `--color-error` | `#B84A3C` | Fehler (gedecktes rot) |

### Tech-Palette (Slate · Teal · Tinte)

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--color-ink` | `#1B2733` | Tinte — Text auf hellen Tech-Flächen |
| `--color-slate` | `#2E4150` | Blaugrau — Sekundäre Oberflächen, Panels |
| `--color-slate-hover` | `#243444` | Slate Hover |
| `--color-teal` | `#3AA7B5` | Teal-Akzent — Highlights, CTAs |
| `--color-teal-hover` | `#2E8F9C` | Teal Hover |

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
