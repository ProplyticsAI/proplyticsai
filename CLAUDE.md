# Proplytic.ai Design System — CLAUDE.md

## Marke

- **Präzise** Immobilien-KI
- **Beige** als Hauptfarbe (warm,vertrauenswürdig)
- **Dunkelgrün + Dunkelblau** als Highlight-Akzente
- **Outfit** als Font (modern, vielseitig)
- **Kein Dark Mode**

## Farben

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--color-background` | `#F5F0E8` | Haupthintergrund (warm Beige) |
| `--color-surface` | `#FDFBF7` | Karten, Panels (helleres Beige) |
| `--color-foreground` | `#1C1C1C` | Haupttext |
| `--color-muted` | `#7A7A7A` | Sekundärtext |
| `--color-primary` | `#2D5A3D` | Dunkelgrün — Aktionen, Links |
| `--color-secondary` | `#2C4A6E` | Dunkelblau — Highlights, Akzente |
| `--color-border` | `#E5E0D5` | Beige-graue Trennlinien |
| `--color-success` | `#2D5A3D` | Erfolg (grün) |
| `--color-warning` | `#C4883A` | Warnung (warm orange) |
| `--color-error` | `#B84A3C` | Fehler (gedecktes rot) |

## Typografie

- **Font**: Outfit (Google Fonts)
- **Fallback**: system-ui, sans-serif
- **Scale**: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60px
- **Line Height**: tight (1.1) · normal (1.5) · relaxed (1.7)
- **Letter Spacing**: headlines -0.02em, body 0

## Spacing

4px Base-Grid: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80

## Radius

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px

## Shadows

- Cards: `0 1px 3px rgba(0,0,0,0.05)`
- Hover: `0 4px 12px rgba(0,0,0,0.08)`
- Kein Glow by default

## Anti-Patterns

- KEINE gradients (nur für Text-Highlights erlaubt)
- KEIN glassmorphism
- KEINE Emoji als Icons
- KEINE rounded pill-Buttons überall
- KEINE übertriebenen Schatten
- KEINE lila/blauen Tech-Gradienten

## Workflow

1. Token ändern → NEU berechnen
2. Komponente bauen → Review
3. Review bestanden → Commit
4. Chunking: max 3 Dateien pro PR

## Referenz

Tokens: `tokens/`
Komponenten: `components/`
