# Proplytic.ai — Datenmodell & API: Bewertungen inkl. Monte-Carlo-Ergebnisse (Entwurf v1)

> Status: Entwurf / Vertragsgrundlage für die Backend-Anbindung. Beschreibt das
> Soll-Datenmodell und die API-Verträge, über die `layouts/bewertung.html`
> (Button „Bewertung speichern", aktuell `disabled` ohne Handler, s. Zeile 1513)
> sowie `layouts/verlauf.html` und `layouts/vergleich.html` künftig persistente
> Bewertungen inkl. Monte-Carlo-Risikoverteilung lesen/schreiben. Folgt dem
> gleichen Spezifikations-Pattern wie `docs/api-spec-bulk-import.md`.

---

## 1. Ausgangslage

Aktuell ist die Bewertungs-Engine vollständig clientseitig (siehe
`components/valuation-procedures.js`, `components/monte-carlo.js`,
`layouts/bewertung.html`):

- Ergebnisse leben nur im Chat-State (`procState.lastCalc`, `procState.lastInputs`,
  `procState.lastMonteCarlo`)
- Der PDF-Export reicht Daten kurzlebig über `sessionStorage` durch
  (`bewertung-report`, Zeile 1510)
- „Bewertung speichern" ist ein UI-Stub ohne Persistenz
- `layouts/verlauf.html` und `layouts/vergleich.html` zeigen statische Mock-Arrays

Ziel dieses Entwurfs: ein Datenmodell + REST-Vertrag, der diese drei Stellen
konsistent bedient — inkl. der Monte-Carlo-Risikoverteilung als fester
Bestandteil einer gespeicherten Bewertung (nicht als Add-on).

---

## 2. Datenmodell

### 2.1 `bewertung`

Eine abgeschlossene oder als Entwurf gespeicherte Verfahrensbewertung.

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | `string` (z. B. `bw_8f3a1c`) | Primärschlüssel |
| `userId` | `string` | Eigentümer der Bewertung |
| `objektName` | `string` | z. B. „Leopoldstr. 142" — Anzeige in Verlauf/Vergleich |
| `ort` | `string` | z. B. „München · Schwabing" |
| `verfahren` | `enum('ertragswert','sachwert')` | gewähltes Verfahren |
| `status` | `enum('entwurf','abgeschlossen','archiviert')` | analog Statusfilter in `verlauf.html` |
| `inputs` | `json` | vollständiger Eingabe-Datensatz (= `procState.lastInputs`), Basis für Reproduzierbarkeit & Re-Simulation |
| `ergebnis` | `json` | deterministisches Verfahrensergebnis (= `calc` aus `ValuationProcedures`: `ergebnis`, `kennzahlen`, `schritte`, `titel`, `rechtsgrundlage`) |
| `monteCarlo` | `json \| null` | siehe 2.2 — `null`, falls Nutzer die Simulation abgelehnt hat |
| `createdAt` / `updatedAt` | `timestamp` | Verlaufs-Sortierung |

> Hinweis: `inputs` und `ergebnis` werden bewusst als JSON-Blobs modelliert
> (nicht normalisiert), weil sich die Feldstruktur je nach Verfahren/Objekttyp
> unterscheidet — analog zur bestehenden `ValuationProcedures`-Rückgabe. Für
> Filter/Sortierung in `verlauf.html` reichen die o.g. flachen Spalten
> (`status`, `verfahren`, `objektName`, `updatedAt`).

### 2.2 `monteCarlo` (eingebettetes JSON-Objekt, kein eigenes Aggregat)

Persistierte Form des `MonteCarloSimulation.runSimulation()`-Rückgabewerts —
**ohne** das vollständige `samples`-Array (2.000 Floats sind für Anzeige &
Vergleich unnötig; das Histogramm wird aus den Bins rekonstruiert):

```json
{
  "n": 2000,
  "mean": 1480000,
  "stdDev": 96400,
  "percentiles": { "p10": 1352000, "p25": 1417000, "p50": 1478000, "p75": 1541000, "p90": 1612000 },
  "sensitivity": [
    { "label": "Bodenrichtwert", "low": 1390000, "high": 1570000, "spread": 180000 },
    { "label": "Liegenschaftszinssatz", "low": 1410000, "high": 1545000, "spread": 135000 }
  ],
  "histogram": [{ "label": "1352k", "value": 42 }],
  "simulatedAt": "2026-06-08T14:32:00Z"
}
```

- `histogram`: Ergebnis von `MonteCarloSimulation.buildHistogram(samples, 22)` —
  wird beim Speichern einmalig berechnet und abgelegt, damit die Verteilungs-
  grafik in Verlauf/Vergleich ohne Re-Simulation gerendert werden kann
- Re-Simulation („Szenarien aktualisieren") bleibt jederzeit über `inputs` +
  `verfahren` möglich, falls sich Marktparameter (Bodenrichtwert-Tabellen etc.)
  geändert haben

---

## 3. API-Endpunkte (Next.js API Routes unter `pages/api/bewertungen/`)

Folgt dem REST-Muster aus `docs/api-spec-bulk-import.md`. Auth über bestehende
Session (kein separates PAT nötig — interner Plattform-Endpunkt, keine
Drittanbieter-Anbindung wie beim Bulk-Import).

### `POST /api/bewertungen`

Speichert eine neue Bewertung (Klick auf „Bewertung speichern"). Request-Body
entspricht 2.1 ohne `id`/`userId`/Timestamps. Response: `201` + vollständiges
Objekt inkl. generierter `id`.

### `GET /api/bewertungen?status=&verfahren=&q=`

Liste für `verlauf.html` — bedient die bestehenden Filter (Status, Verfahren,
Suche). Response: Array gekürzter Objekte (ohne `inputs`/vollständige
`ergebnis.schritte`, dafür inkl. `monteCarlo.percentiles` + `mean` für
Vorschau-Badges).

### `GET /api/bewertungen/:id`

Vollständiger Datensatz inkl. `inputs`, `ergebnis.schritte`, `monteCarlo`
(inkl. `histogram`, `sensitivity`) — für Detail-/Re-Render in `bewertung.html`
oder `bewertung-pdf.html` (ersetzt den `sessionStorage`-Umweg).

### `PATCH /api/bewertungen/:id`

Statusänderung (`entwurf → abgeschlossen → archiviert`) sowie nachträgliches
Anhängen/Aktualisieren von `monteCarlo` (Nutzer simuliert die Risikoverteilung
nachträglich zu einer bereits gespeicherten Bewertung).

### `DELETE /api/bewertungen/:id`

Entspricht der „Löschen"-Aktion in `verlauf.html`.

### `POST /api/bewertungen/compare`

Body: `{ "ids": ["bw_1", "bw_2", "bw_3", "bw_4"] }` (max. 4, analog
Objekt-Picker in `vergleich.html`). Response liefert je Objekt die in 3.2 von
`vergleich.html` benötigten Kennzahlen **plus** `monteCarlo.percentiles`, sodass
die Vergleichsansicht Risikobandbreiten (P10–P90) statt nur Punktwerte
gegenüberstellen kann (siehe separates Vergleichs-Konzept).

---

## 4. Migrationspfad (Mock → Backend)

1. **Phase A (jetzt → kurzfristig)**: API-Routen unter `pages/api/bewertungen/`
   gegen einen In-Memory-/Datei-Mock implementieren (gleiche Response-Verträge
   wie oben), `btn-save` aktivieren und an `POST` anbinden — UI-seitig bereits
   produktionsnah, ohne auf reale DB-Anbindung zu warten
2. **Phase B**: reale DB (Schema 1:1 aus Abschnitt 2 ableitbar — z. B. Postgres
   mit `jsonb`-Spalten für `inputs`/`ergebnis`/`monteCarlo`) hinter denselben
   Routen-Verträgen austauschen — kein Frontend-Refactor nötig
3. **`verlauf.html`/`vergleich.html`** von statischen `OBJECTS`-Arrays auf
   `GET /api/bewertungen` bzw. `POST /api/bewertungen/compare` umstellen

---

## 5. Offene Punkte

- Mehrbenutzer-/Mandantenfähigkeit (`userId`-Scoping) hängt von der noch
  ausstehenden Auth-Anbindung ab (`pages/login.jsx`, `pages/register.jsx` sind
  aktuell ebenfalls Demo-Flows)
- Aufbewahrungsfristen / DSGVO-Löschkonzept für gespeicherte Eingabedaten
  (enthalten ggf. objektbezogene Adress-/Mietdaten) — analog Hinweise in
  `layouts/ueber-uns.html` zu Datenschutz
- Soll `monteCarlo.samples` für Power-User exportierbar sein (z. B. CSV-Download
  der 2.000 Szenarien)? Aktuell bewusst nicht persistiert (siehe 2.2)
