# Proplytics Design System — Claude Design Reference

## Brand Identity

**Produkt**: Proplytics — KI-gestützte Immobilienbewertung nach ImmoWertV 2024
**Marke**: Premium, professionell, vertrauenswürdig, editorial
**Plattform**: Next.js 14 (App Router), TypeScript strict, Tailwind CSS v4

---

## Farbpalette

### Light Mode

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--background` | `#F5F3EF` | Warm Cream — Seitenhintergrund |
| `--foreground` | `#1A1A1A` | Text |
| `--card` | `#FFFFFF` | Karten, Panels |
| `--primary` | `#2D5A3D` | Dark Green — CTA, Akzente, Selektion |
| `--primary-foreground` | `#FFFFFF` | Text auf Primary |
| `--secondary` | `#F0EEE9` | Light Cream — Muted-Bereiche |
| `--muted` | `#F0EEE9` | Muted-Hintergrund |
| `--muted-foreground` | `#666666` | Muted-Text |
| `--accent` | `#2D5A3D` | Akzent (identisch mit Primary) |
| `--destructive` | `#C45B4A` | Fehler, Löschen |
| `--border` | `#E5E3DF` | Warm Grey — Trennlinien |
| `--input` | `#E5E3DF` | Input-Hintergrund |
| `--ring` | `#2D5A3D` | Fokus-Ring |

**Charts**: `#2D5A3D`, `#4A6FA5`, `#E8D5A3`, `#C45B4A`, `#666666`
**Success**: `#2D5A3D`, **Warning**: `#D97706`, **Info**: `#4A6FA5`

### Dark Mode

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--background` | `#121212` | Dunkler Hintergrund |
| `--foreground` | `#E8E6E1` | Helles Text |
| `--card` | `#1C1C1C` | Karten |
| `--primary` | `#4A8C64` | Helleres Grün für Dark Mode |
| `--secondary` | `#2A2A2A` | Dunkles Grau |
| `--muted` | `#2A2A2A` | Muted-Bereiche |
| `--muted-foreground` | `#999999` | Muted-Text |
| `--border` | `#333333` | Dunkle Trennlinie |

---

## Typografie

**Font-Family:**
- `--font-body`: `var(--font-inter)` — Inter, system-ui (Body, UI, Buttons)
- `--font-headline`: `var(--font-cormorant)` — Cormorant Garamond, Georgia, serif (Headlines h1–h6)

**Google Fonts importiert via next/font/google:**
- `Inter` subsets: latin, weights: 400/500/600/700, display: swap
- `Cormorant_Garamond` subsets: latin, weights: 400/500/600/700, italic styles, display: swap

**Typografische Scale (globals.css):**
```
h1: 3.5rem, line-height 1.1
h2: 2.5rem, line-height 1.2
h3: 2rem, line-height 1.2
```
**Alle Headlines**: `font-weight: 500`, `letter-spacing: -0.02em`, serif font-family

**Body**: `antialiased`, Inter

---

## Spacing & Layout

- **Border Radius**: `--radius: 0.75rem` (12px)
- **Sidebar**: 240px (lg), Mobile: Fullscreen mit Bottom-Navigation
- **Content max-width**: prose / container nach Bedarf
- **Grid**: Tailwind responsive: `grid-cols-2` (mobile) / `grid-cols-4` (lg)

---

## UI-Komponenten

### Buttons
- **Primary**: `bg-primary text-primary-foreground` — Dark Green
- **Secondary**: `bg-secondary text-secondary-foreground` — Light Cream
- **Ghost**: Transparent, hover `bg-muted`
- **Destructive**: `bg-destructive text-destructive-foreground` — Rot
- **Effekt**: `.btn-lift` → `translateY(-1px)` + Shadow auf Hover

### Cards
```tsx
// Premium Card
className="bg-card border border-border rounded-xl"
box-shadow: 0 1px 3px rgba(0,0,0,0.04)

// Card mit Glow (hover/select)
className="glow" → box-shadow: 0 0 40px -10px rgba(45,90,61,0.1)
className="glow-strong" → box-shadow: 0 0 60px -10px rgba(45,90,61,0.15)
```

### Inputs
- Background: `--input: #E5E3DF` / Dark: `#333333`
- Focus: `.input-clean` → `outline-none ring-2 ring-primary/20 border-primary`
- Placeholder: `--muted-foreground`

### Navigation
- Sidebar: Warm Cream (`#F5F3EF`), Links mit Icons + Text
- Header: Fixed, Glassmorphism (`backdrop-blur`)
- Tabs: `rounded-none`, `border-b`, `h-11`

---

## Benutzerdefinierte CSS-Klassen (globals.css)

```css
/* Gradient Text */
.text-gradient {
  background: linear-gradient(135deg, #2D5A3D 0%, #4A7C59 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glass Effect */
.glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.05); }
.dark .glass { background: rgba(28,28,28,0.8); border: 1px solid rgba(255,255,255,0.08); }

/* Premium Card */
.card-premium { @apply bg-card border border-border rounded-xl; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }

/* Glow Effect */
.glow { box-shadow: 0 0 40px -10px rgba(45,90,61,0.1); }
.glow-strong { box-shadow: 0 0 60px -10px rgba(45,90,61,0.15); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
```

---

## Animations

- **Page Transitions**: Framer Motion `AnimatePresence` mit `opacity` + `y/x` slides
- **Button Hover**: `transform: translateY(-1px)` + `box-shadow`
- **Focus Ring**: `ring-2 ring-primary/20 ring-offset-2`
- **Tab Transitions**: Fade + Slide (`y: 20 → 0`)

---

## Icon-Bibliothek

`lucide-react` — konsistente Stroke-Icons, `h-5 w-5` Standardgröße

**Key Icons**:
- `Zap` — Schnell-Analyse
- `Wand2` — Detaillierte Analyse
- `Link` — ImmoScout-Import
- `FileText` — PDF-Upload
- `PanelLeft` / `PanelLeftClose` — Sidebar Toggle
- `BarChart3` — Ergebnisse
- `MessageSquare` — Chat/Wizard
- `Map` — Karte

---

## Key Pages & Components

### Portal Shell (`/portal`)
- Sidebar: PORTFOLIO, WERKZEUGE (Bewertung, Vergleich, Grundriss, Energieausweis, Mieterlisten, Sanierung), MEHR (Academy, Marktplatz)
- Header: Logo links, Neue Analyse Button rechts
- Dark Mode Toggle in Header

### Analyse Page (`/analyse`)
- **Zustand**: 4 Modi (Schnell, Detailliert, Link, PDF)
- **Modus-Auswahl**: Vollflächig im Main-Content-Bereich (NICHT in der Sidebar), 4 Karten-Grid
- **Chat-Wizard**: In der linken 360–420px Sidebar
- **Ergebnisse**: Im mittleren Main-Bereich
- **Karte**: Rechts, xl+ only, 380px
- **Sidebar Toggle**: Button in Header (PanelLeftClose / PanelLeft)

### Komponenten-Verzeichnis
```
components/
├── modules/
│   ├── analyse/
│   │   ├── analysis-mode-selector.tsx  — 4 Karten-Grid für Modus-Auswahl
│   │   ├── chat-wizard-integrated.tsx  — Modus-abhängiger Wizard
│   │   ├── analyse-header.tsx          — Top-Bar mit Aktionen
│   │   ├── analyse-draft.ts            — Draft-Persistenz
│   │   └── (panels/)
│   ├── portal/
│   │   └── portal-shell.tsx           — Sidebar + Toggle-Logik
│   └── ...
├── ui/
│   ├── button.ts
│   ├── card.ts
│   ├── input.ts
│   ├── tabs.tsx
│   └── ...
```

---

## Tailwind Version & Config

- **Tailwind CSS v4** (nicht v3!)
- Keine separate `tailwind.config.js` — Design-Tokens in `globals.css` via `@theme inline`
- Custom Variants: `dark (&:is(.dark *))`
- Tailwind Plugins: `tailwindcss-animate`

---

## Dark Mode

`next-themes` mit `attribute="class"`, `defaultTheme="light"`, `disableTransitionOnChange`

Toggle: `button[data-theme-toggle]` in Header

---

## Responsive Breakpoints

| Breakpoint | Breite |典型 Nutzung |
|-----------|--------|------------|
| Mobile | < 640px | 1 Spalte, Bottom Nav |
| Tablet | 640–1024px | 2 Spalten, keine Sidebar |
| Desktop | > 1024px | Volle Sidebar, 3-Spalten-Layout |
| XL | > 1280px | Karte rechts sichtbar |

---

## Interaktive Muster

### Framer Motion Page-Übergänge
```tsx
<AnimatePresence mode="wait">
  {condition ? <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} /> : null}
</AnimatePresence>
```

### Toast Notifications
`sonner` mit `richColors position="top-right" closeButton`

### Error Boundaries
`AnalysisPanelBoundary` um alle Async-Panels für graceful Error-Handling

---

## To Avoid

- Keine harten Farben ausserhalb des Design-Systems
- Keine Standard-Tailwind-Farben wie `bg-blue-500` in UI-Komponenten
- Keine Pixel-Fonts oder nicht-Glass-UI Fonts
- Keine Tailwind v3 Config (`tailwind.config.js` existiert NICHT)
- Keine `console.log` im Produktiv-Code
- Keine Magic Numbers — CSS-Variablen aus `--radius`, `--primary` etc.
