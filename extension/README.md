# Proplytic.ai Bulk-Import Chrome-Extension

Manifest-V3-Extension für clientseitiges Sammeln von ImmoScout24-Inseraten und Bulk-Upload an die Proplytic.ai Bulk-Import-API.

## Installation

```bash
cd extension
npm install
npm run build
```

Danach in Chrome:

1. `chrome://extensions` öffnen
2. Entwicklermodus aktivieren
3. "Entpackte Erweiterung laden"
4. Ordner `extension/dist` auswählen

## Mock-API starten

```bash
cd extension
npm run mock-api
```

Der Mock läuft auf `http://localhost:4317/v1`.

Demo-Token für die Extension-Einstellungen:

```text
mock-valid-token
```

Die Optionsseite der Extension nutzt standardmäßig:

- API-Basis-URL: `http://localhost:4317/v1`
- Plattform-URL: `https://app.proplytic.ai/imports`

Für den späteren Wechsel auf die echte API muss nur die API-Basis-URL geändert werden.

## Nutzung

1. Mock-API starten
2. Extension bauen und als unpacked extension laden
3. In den Extension-Einstellungen den Token `mock-valid-token` speichern und "Verbindung testen" klicken
4. Eine Seite auf `immobilienscout24.de` öffnen
5. Im Popup oder über den Overlay-Button "Bulk sammeln" sichtbare Inserate sammeln
6. Vor dem Versand einzelne Einträge in der Sammelliste entfernen
7. "Senden" klicken
8. Nach Abschluss erscheinen Treffer mit Score, Bewertungsdelta und Review-Aktionen

## Tests

```bash
cd extension
npm test
npm run typecheck
npm run build
```

Abgedeckt sind:

- DOM-Extraktion aus gespeicherten ImmoScout24-Fixtures
- API-Client gegen den lokalen Express-Mock
- Token-Verifikation, Import-Erstellung, Statusabruf, Ergebnisfilterung und Review-Patching

## Architektur

- `src/extractors/`: austauschbare Portal-Extraktoren
- `src/extension/contentScript.ts`: ImmoScout24 DOM-Extraktion und Seiten-Overlay
- `src/extension/background.ts`: API-Aufrufe, Storage, Batching und Polling
- `src/popup/`: Popup und Sidepanel für Queue, Upload und Treffer
- `src/options/`: Token, API-Basis-URL und Plattform-URL
- `mock-server/`: Express-Mock gemäß `../docs/api-spec-bulk-import.md`

## Bekannte Einschränkungen

- Die Extension extrahiert nur Inhalte, die im Browser des Nutzers sichtbar bzw. bereits geladen sind.
- Es gibt kein serverseitiges Scraping und keine automatisierten Portal-Anfragen außerhalb der normalen Nutzer-Session.
- Nachgeladene Suchergebnisse können gesammelt werden, sobald sie im DOM vorhanden sind; echte Pagination-Automation ist bewusst nicht enthalten.
- Die Plattform-Detailansicht für einzelne Bulk-Treffer existiert noch nicht, daher öffnet "In Proplytic.ai öffnen" aktuell die konfigurierte Platzhalter-URL.
- ImmoScout24-Selektoren sind defensiv angelegt, müssen bei größeren Portal-Layoutänderungen aber nachgepflegt werden.
