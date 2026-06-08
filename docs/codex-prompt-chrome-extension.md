# Codex-Prompt: Proplytic.ai Bulk-Scraper Chrome-Extension

> Diesen Prompt 1:1 an Codex übergeben. Die referenzierte API-Spezifikation
> (`docs/api-spec-bulk-import.md`) liegt im selben Repository und sollte mit
> übergeben bzw. verlinkt werden.

---

## Aufgabe

Baue eine **Chrome-Extension (Manifest V3)** für die Immobilien-Analyseplattform
**Proplytic.ai**. Die Extension soll es Nutzern ermöglichen, beim Browsen von
Immobilienportalen (Start: ImmobilienScout24) Inserate im **Bulk-Modus** zu
sammeln, strukturiert zu extrahieren und gebündelt an die Proplytic.ai-Plattform
zu übertragen, wo sie automatisiert bewertet werden ("Human Review nur bei
interessanten Treffern").

Die Plattform-API ist in `docs/api-spec-bulk-import.md` spezifiziert (REST/JSON,
Token-Auth). **Wichtig: Diese API existiert serverseitig noch nicht** — baue einen
lokalen Mock-Server exakt nach dieser Spezifikation (z. B. mit Express oder
`json-server` + Custom-Routen) und entwickle/teste die Extension dagegen. Achte
darauf, dass der echte Wechsel später nur eine Konfigurationsänderung der
Basis-URL ist (keine Code-Anpassungen in der Extension nötig).

## Kernfunktionen

1. **Bulk-Erkennung & -Extraktion**
   - Auf Such-/Trefferlisten-Seiten von immobilienscout24.de erkennt die Extension
     automatisch mehrere Inserate und bietet einen "Bulk-Modus" an (z. B. Toggle
     im Popup oder Overlay-Button auf der Seite)
   - Im Bulk-Modus werden alle sichtbaren (und ggf. nachgeladenen/paginierten)
     Inserate per DOM-Parsing extrahiert und in das `Listing`-Schema aus der
     API-Spezifikation überführt (siehe Abschnitt 3.1 dort)
   - Einzel-Inserat-Extraktion (eine Detailseite → ein Listing) soll ebenfalls
     möglich sein

2. **Sammlung & Vorschau**
   - Gesammelte Listings werden in einer Extension-internen Liste/Queue gehalten
     (lokal persistiert, z. B. `chrome.storage.local`)
   - Popup/Sidepanel zeigt die gesammelte Liste mit Basis-Infos (Titel, Adresse,
     Preis, Quelle) und erlaubt das Entfernen einzelner Einträge vor dem Versand

3. **Authentifizierung**
   - Einstellungsseite der Extension: Eingabefeld für den **Personal-Access-Token**
     aus den Proplytic.ai-Konto-Einstellungen
   - Nach Eingabe: Verifikation via `GET /v1/me` → Anzeige "Verbunden als {name}"
     bzw. Fehlermeldung bei ungültigem Token
   - Token sicher in `chrome.storage.local` speichern (nicht im Code, nicht
     synchronisiert über `chrome.storage.sync`, um Account-übergreifendes Leaken
     zu vermeiden)

4. **Bulk-Upload & Status**
   - "Senden"-Aktion batcht die gesammelte Liste (max. 200 Listings pro Request
     gemäß Spezifikation, bei Bedarf automatisches Aufteilen in mehrere Jobs)
     und ruft `POST /v1/imports` auf
   - Anschließend Status-Polling via `GET /v1/imports/{id}` (z. B. alle 5 Sekunden,
     mit Backoff) bis `status` ∈ `completed`/`partial`/`failed`
   - Fortschrittsanzeige im Popup (verarbeitete/gesamt/fehlgeschlagene Items)

5. **Ergebnis-Ansicht & Human Review**
   - Nach Abschluss: Abruf der priorisierten Treffer via
     `GET /v1/imports/{id}/results?sort=score_desc&minScore=70`
   - Darstellung im Popup/Sidepanel als sortierte Liste mit `score`,
     `scoreReason`, Bewertungsergebnis vs. Angebotspreis (`vsAskingPrice`)
   - Pro Treffer: Aktionen "Als interessant markieren" (`shortlisted`) /
     "Verwerfen" (`dismissed`) → `PATCH /v1/imports/{id}/results/{listingId}`
   - Link "In Proplytic.ai öffnen" → öffnet die Plattform in neuem Tab
     (Ziel-URL als Konfigurationswert, da die Plattform-Detailansicht für
     einzelne Bulk-Treffer noch nicht existiert — Platzhalter-Link genügt)

## Technische Vorgaben

- **Manifest V3**, TypeScript bevorzugt
- Architektur: Background-Service-Worker (API-Calls, Polling, Storage),
  Content-Scripts (DOM-Extraktion auf immobilienscout24.de), Popup/Sidepanel-UI
- Die DOM-Extraktion soll **robust gegen kleinere Layout-Änderungen** sein
  (mehrere Selektor-Fallbacks, defensive Null-Checks) — kommentiere im Code klar,
  welche Selektoren wo greifen, damit spätere Wartung einfach ist
- Kein Server-seitiges Scraping — alle Extraktion läuft client-seitig im Browser
  des angemeldeten Nutzers (rechtlich/technisch bewusste Design-Entscheidung,
  siehe unten)
- API-Client als eigenes Modul mit der Basis-URL als konfigurierbarer Konstante
  (Mock vs. Produktiv-Endpunkt austauschbar)
- Tests: Unit-Tests für die DOM-Extraktions-Mapper (gegen gespeicherte HTML-Fixtures)
  und für den API-Client (gegen den Mock-Server)

## Design / UX

- Schlicht und funktional halten — keine aufwendige Marken-Gestaltung nötig,
  aber: **Beige als Grundton, Dunkelgrün (`#2D5A3D`) als Akzentfarbe**, passend
  zur Proplytic.ai-Markenwelt (siehe `CLAUDE.md` im Repo für das volle Farbschema,
  falls eine Annäherung gewünscht ist — muss aber nicht pixelgenau sein)
- Deutsche UI-Texte (Produktsprache ist Deutsch)

## Wichtiger Kontext (rechtlich/architektonisch)

- Es existiert **keine offizielle ImmoScout24-API**. Die Extension liest daher
  bewusst nur Inhalte aus, die der angemeldete Nutzer ohnehin in seinem eigenen
  Browser ansieht (kein serverseitiges Massen-Scraping, keine automatisierten
  Anfragen außerhalb der normalen Nutzer-Session) — das ist eine bewusste
  Design-Entscheidung, an der sich die Architektur orientieren soll
- Halte die Extraktionslogik **austauschbar/erweiterbar** für weitere Portale
  (Struktur so anlegen, dass z. B. ein zweiter Extraktor für ein anderes Portal
  ergänzt werden kann, ohne die Kernlogik anzufassen)

## Lieferumfang

1. Lauffähige Chrome-Extension (Manifest V3) mit den oben beschriebenen Funktionen
2. Lokaler Mock-API-Server gemäß `docs/api-spec-bulk-import.md`
3. Kurze README: Installation (unpacked load), Token-Einrichtung, Mock-Server-Start,
   bekannte Einschränkungen
4. Tests für DOM-Extraktion und API-Client

Bei Unklarheiten zur API-Spezifikation: an `docs/api-spec-bulk-import.md` halten —
dort ist auch der End-to-End-Ablauf (Abschnitt 8) beschrieben, der die erwartete
Interaktionsreihenfolge der Extension zeigt.
