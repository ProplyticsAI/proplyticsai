# proplytic.ai

KI-gestützte Immobilienbewertung nach ImmoWertV 2024.

## Repo-Struktur

```
proplytic-ai/
├── pages/          # Next.js App (7 Seiten)
├── components/     # React-Komponenten (brand, primitives, layout)
├── public/         # Statische Assets (Logo, Gebäude-Render)
├── styles/         # Globale CSS
├── tokens/         # Design Tokens (CSS Variablen, JSON)
├── layouts/        # HTML/CSS Layout-Templates
├── ml/             # ML-Pipeline (Training, Prediction, Feedback)
├── brand/          # SVG Logos
├── dist/           # Build-Ausgabe (proplytic.css, tokens.json)
└── scripts/        # Build/Export Scripts
```

## Next.js App starten

```bash
npm install
npm run dev   # http://localhost:3000
```

## Design-System bauen

```bash
npm run design:build
npm run design:tokens
npm run design:catalog
```

## Seiten

| Route | Beschreibung |
|-------|-------------|
| `/` | Landing Page |
| `/login` | Anmelden |
| `/register` | Registrieren |
| `/dashboard` | Portfolio-Übersicht |
| `/analyse` | Kern-Bewertungstool |
| `/comparison` | Objekt-Vergleich |
| `/valuations` | Alle Bewertungen |

## Design

**Ledger/Nebel Theme** — Slate-Blau `#2E4150`, Teal `#3AA7B5`, DM Sans + Geist.

## Chrome-Extension: Bulk-Import

Die Chrome-Extension liegt als eigenständiges TypeScript/Vite-Paket in `extension/`.
Sie sammelt ImmoScout24-Inserate clientseitig im Browser, speichert eine lokale Queue
in `chrome.storage.local`, sendet Listings in Batches an die Bulk-Import-API und zeigt
priorisierte Treffer für Human Review.

```bash
cd extension
npm install
npm run mock-api   # http://localhost:4317/v1, Demo-PAT: mock-valid-token
npm run build      # danach extension/dist als unpacked extension laden
```

Details: siehe `extension/README.md`.
