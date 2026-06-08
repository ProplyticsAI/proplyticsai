# Proplytic.ai — Bulk-Import-API (Spezifikation v1, Entwurf)

Vertrag zwischen der **Proplytic.ai-Plattform** (Server-Seite) und externen Clients —
in erster Linie der geplanten **Chrome-Extension**, die Immobilieninserate im
Bulk-Modus extrahiert, strukturiert an die Plattform überträgt und dort automatisiert
bewerten lässt ("Human Review nur bei interessanten Treffern").

> Status: Entwurf / Vertragsgrundlage für die Extension-Entwicklung. Beschreibt das
> Soll-Verhalten der Plattform-API — die serverseitige Implementierung folgt mit der
> Backend-Anbindung.

---

## 1. Grundprinzipien

- **Auth**: Personal-Access-Token (PAT), erzeugt vom Nutzer in den Konto-Einstellungen
- **Format**: JSON über HTTPS, REST-artig
- **Versionierung**: über URL-Pfad (`/v1/…`)
- **Basis-URL**: `https://api.proplytic.ai/v1`
- **Asynchrone Verarbeitung**: Bulk-Importe laufen als Job — Client erstellt den Job,
  pollt den Status (oder nutzt optional Webhooks) und ruft die Ergebnisse ab

---

## 2. Authentifizierung

```
Authorization: Bearer <personal_access_token>
```

- Token wird in `Konto-Einstellungen → API-Zugriff` erzeugt (UI folgt als eigenes
  Gewerk; Pendant zur bestehenden `account-einstellungen.html`)
- Scopes (minimal, erweiterbar):
  - `imports:write` — Bulk-Importe erstellen
  - `imports:read` — Status & Ergebnisse abrufen
- Ungültiger/fehlender Token → `401 Unauthorized`
- Gültiger Token ohne nötigen Scope → `403 Forbidden`

### `GET /v1/me`

Verifiziert den Token und liefert Profil-Kontext — die Extension nutzt dies u. a.
für die "Verbunden als …"-Anzeige und um Uploads dem richtigen Profil zuzuordnen.

```json
{
  "userId": "usr_3f7a1c",
  "name": "Umer Isaev",
  "email": "umarisaev@proplytics.de",
  "plan": "pro",
  "scopes": ["imports:write", "imports:read"]
}
```

---

## 3. Datenmodelle

### 3.1 `Listing` (Eingabe — von der Extension extrahiert)

Felder orientieren sich an den Daten, die die Bewertungsengine bereits aus dem
ImmoScout24-Demo-Import übernimmt (`layouts/bewertung.html`, `applyImportData`).

```json
{
  "sourceUrl": "https://www.immobilienscout24.de/expose/123456789",
  "sourcePortal": "immobilienscout24",
  "externalId": "123456789",
  "title": "Modernes Büro in zentraler Lage",
  "address": {
    "street": "Friedrichstraße 120",
    "zip": "10117",
    "city": "Berlin"
  },
  "propertyType": "office",
  "livingSpace": 188,
  "constructionYear": 2012,
  "condition": "neuwertig",
  "floor": "3. OG",
  "rooms": 8,
  "askingPrice": 2050000,
  "annualRent": null,
  "features": ["Aufzug", "Tiefgarage", "Klimaanlage", "Glasfaser"],
  "description": "Freitext-Beschreibung aus dem Exposé …",
  "images": ["https://picsum.photos/…"],
  "extractedAt": "2026-06-08T10:15:00Z"
}
```

| Feld | Typ | Pflicht | Hinweis |
|---|---|---|---|
| `sourceUrl` | string (URL) | ✓ | Eindeutige Inserats-URL — Basis für Duplikatserkennung |
| `sourcePortal` | enum string | ✓ | `immobilienscout24` (Phase 1); weitere Portale später |
| `externalId` | string | ✓ | Portal-interne Inserats-ID |
| `title` | string | ✓ | |
| `address.street`/`zip`/`city` | string | ✓ | |
| `propertyType` | enum string | ✓ | `office` \| `retail` \| `residential` \| `logistics` \| `other` |
| `livingSpace` | number (m²) | ✓ | |
| `constructionYear` | number | – | |
| `condition` | enum string | – | `neuwertig` \| `sehr_gut` \| `gut` \| `gepflegt` \| `renovierungsbeduerftig` |
| `askingPrice` | number (EUR) | ✓ | |
| `annualRent` | number (EUR) \| `null` | – | nötig für Ertragswertverfahren, falls vorhanden |
| `features` | string[] | – | |
| `description` | string | – | Freitext — Grundlage für ggf. spätere LLM-gestützte Anreicherung |
| `images` | string[] (URLs) | – | |
| `extractedAt` | string (ISO 8601) | ✓ | Zeitpunkt der Extraktion durch die Extension |

### 3.2 `ImportJob`

```json
{
  "id": "imp_8f2a91c3",
  "label": "ImmoScout-Suche Berlin Büro · KW23",
  "status": "queued",
  "createdAt": "2026-06-08T10:16:02Z",
  "updatedAt": "2026-06-08T10:16:02Z",
  "totalItems": 42,
  "processedItems": 0,
  "failedItems": 0
}
```

`status` ∈ `queued` \| `processing` \| `completed` \| `partial` \| `failed`

- `partial` = Job abgeschlossen, aber einzelne Listings konnten nicht bewertet werden
  (siehe `failedItems` und `GET /v1/imports/{id}/results?status=failed`)

### 3.3 `ValuationResultItem`

```json
{
  "listingId": "lst_4a9c01",
  "sourceUrl": "https://www.immobilienscout24.de/expose/123456789",
  "status": "completed",
  "valuation": {
    "verfahren": "ertragswert",
    "ergebnis": 2150000,
    "ergebnisProQm": 11436,
    "konfidenzband": { "min": 1980000, "max": 2320000 }
  },
  "monteCarlo": {
    "szenarienAnzahl": 2000,
    "medianErgebnis": 2140000,
    "perzentile": { "p10": 1990000, "p50": 2140000, "p90": 2310000 }
  },
  "vsAskingPrice": {
    "absolut": 100000,
    "prozent": 4.9,
    "richtung": "unter_marktwert"
  },
  "score": 78,
  "scoreReason": "Angebotspreis 4,9 % unter berechnetem Marktwert; enge Streuung in der Monte-Carlo-Simulation",
  "reviewStatus": "pending"
}
```

- `score` (0–100): Priorisierungs-Kennzahl für die Human-Review-Filterung — kombiniert
  z. B. Abweichung Angebotspreis↔Bewertung, Konfidenzbreite und Datenvollständigkeit.
  Die genaue Formel ist Teil der Bewertungsengine und nicht dieser API-Spezifikation.
- `reviewStatus` ∈ `pending` \| `reviewed` \| `shortlisted` \| `dismissed`
- `valuation.verfahren` ∈ `ertragswert` \| `sachwert` (siehe `components/valuation-procedures.js`)

---

## 4. Endpunkte

### `POST /v1/imports`

Erstellt einen neuen Bulk-Import-Job und reiht die enthaltenen Listings zur
Bewertung ein.

**Request**
```json
{
  "label": "ImmoScout-Suche Berlin Büro · KW23",
  "listings": [ /* Listing[], max. 200 pro Request */ ]
}
```

**Response — `202 Accepted`**
```json
{ "id": "imp_8f2a91c3", "status": "queued", "totalItems": 42, "processedItems": 0, "failedItems": 0, "createdAt": "…", "updatedAt": "…" }
```

- Limit: max. **200 Listings pro Request** — größere Mengen über mehrere Requests
  (jeweils eigener Job) oder client-seitiges Batching in der Extension
- Duplikate (gleiche `sourceUrl` in bestehendem offenen/kürzlichem Job desselben
  Nutzers) werden übersprungen und unter `failedItems`/`status: skipped` geführt

### `GET /v1/imports/{importId}`

Statusabfrage für Polling durch die Extension.

**Response — `200 OK`** → `ImportJob`-Objekt (siehe 3.2)

### `GET /v1/imports`

Liste aller Importe des Nutzers (für eine evtl. Übersicht in der Extension/Plattform).

**Query-Parameter**: `?page=1&pageSize=20&status=completed`

**Response**
```json
{ "items": [ /* ImportJob[] */ ], "page": 1, "pageSize": 20, "total": 7 }
```

### `GET /v1/imports/{importId}/results`

Liefert die Bewertungsergebnisse eines Jobs — paginiert, filter- und sortierbar,
damit die Extension/Plattform direkt die "interessanten" Treffer für die
Human-Review anzeigen kann.

**Query-Parameter**
| Parameter | Beispiel | Bedeutung |
|---|---|---|
| `sort` | `score_desc` \| `score_asc` \| `vsAskingPrice_desc` | Sortierung |
| `minScore` | `70` | Nur Treffer mit `score ≥ minScore` |
| `reviewStatus` | `pending` | Filter nach Review-Status |
| `page`, `pageSize` | `1`, `50` | Pagination (Default `pageSize=50`, max. `200`) |

**Response**
```json
{ "items": [ /* ValuationResultItem[] */ ], "page": 1, "pageSize": 50, "total": 42 }
```

### `PATCH /v1/imports/{importId}/results/{listingId}`

Aktualisiert den Review-Status eines einzelnen Treffers (Human-Review-Aktion,
z. B. "als interessant markieren").

**Request**
```json
{ "reviewStatus": "shortlisted" }
```

**Response — `200 OK`** → aktualisiertes `ValuationResultItem`

### `DELETE /v1/imports/{importId}`

Löscht einen Job inkl. zugehöriger Ergebnisse (z. B. Fehlimport rückgängig machen).

**Response — `204 No Content`**

---

## 5. Fehlerformat

Einheitliches Fehler-Envelope für alle Endpunkte:

```json
{
  "error": {
    "code": "invalid_listing_data",
    "message": "Feld 'address.zip' fehlt oder ungültig bei Listing-Index 4",
    "details": [
      { "index": 4, "field": "address.zip", "issue": "required" }
    ]
  }
}
```

| HTTP-Status | Bedeutung |
|---|---|
| `400 Bad Request` | Anfrage strukturell ungültig (z. B. fehlerhaftes JSON, leeres `listings`-Array) |
| `401 Unauthorized` | Token fehlt oder ungültig |
| `403 Forbidden` | Token gültig, aber Scope fehlt |
| `404 Not Found` | Job/Listing existiert nicht oder gehört nicht zum Token-Inhaber |
| `422 Unprocessable Entity` | Einzelne Listings im Bulk-Request fehlerhaft (siehe `details[]`) — gültige Listings werden trotzdem verarbeitet |
| `429 Too Many Requests` | Rate-Limit überschritten (siehe Abschnitt 6) |
| `500 Internal Server Error` | Serverseitiger Fehler |

---

## 6. Rate-Limits

Vorschlag für den Start (anpassbar je nach Tarif/Plan):

- **60 Requests/Minute** pro Token
- **1.000 Listings/Tag** pro Token (Bulk-Imports zählen pro enthaltenem Listing)

Response-Header bei jedem Request:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1717840260
```

---

## 7. Webhooks (Phase 2 — optional)

Statt Polling kann der Nutzer in den Konto-Einstellungen eine Callback-URL
hinterlegen. Die Plattform sendet bei Statuswechsel eines Jobs (insb. `completed`
und `partial`) einen signierten POST-Request:

```json
{
  "event": "import.completed",
  "importId": "imp_8f2a91c3",
  "occurredAt": "2026-06-08T10:21:40Z"
}
```

Signatur via `X-Proplytic-Signature`-Header (HMAC-SHA256 über den Body, Secret aus
den Konto-Einstellungen) — analog zu gängigen Webhook-Konventionen (z. B. Stripe).

---

## 8. End-to-End-Ablauf (Referenz für die Extension-Logik)

1. Nutzer hinterlegt seinen **Personal-Access-Token** einmalig in der Extension
2. Extension verifiziert den Token via `GET /v1/me` → zeigt "Verbunden als …"
3. Im Bulk-Modus sammelt die Extension Listings beim Browsen (DOM-Extraktion)
4. Extension batcht die gesammelten Listings (≤ 200) und ruft `POST /v1/imports` auf
5. Extension pollt `GET /v1/imports/{id}` (oder nutzt Webhook) bis `status` ∈
   `completed`/`partial`
6. Extension ruft `GET /v1/imports/{id}/results?sort=score_desc&minScore=70` ab und
   zeigt die priorisierten Treffer zur Human-Review an (z. B. als Badge/Popup direkt
   im Browser oder per Link zur Plattform-Detailansicht)
7. Nutzer markiert interessante Treffer über `PATCH …/results/{listingId}`
   (`reviewStatus: shortlisted`) — landet damit auch in der Plattform-Ansicht
   (Portfolio/Verlauf) zur Weiterverarbeitung

---

## 9. Offene Punkte / Annahmen (für Codex transparent zu machen)

- **Noch nicht implementiert**: Diese API existiert serverseitig noch nicht —
  Codex sollte die Extension gegen einen lokalen Mock/Stub dieser Spezifikation
  entwickeln und testen (z. B. simpler Express-Mock-Server oder Mock-Service-Worker),
  bis die echte Plattform-API verfügbar ist
- **Score-Formel**: bewusst nicht spezifiziert — liegt in der Verantwortung der
  Bewertungsengine, nicht der API/Extension
- **Property-Type- und Condition-Enums**: an die bestehende Bewertungsengine
  (`components/valuation-procedures.js`, `IS24_MOCK` in `layouts/bewertung.html`)
  angelehnt; bei Erweiterung um neue Portale ggf. zu erweitern
- **Mehrsprachigkeit**: API-Feldnamen englisch, fachliche Enum-Werte und
  Anzeige-/Fehlertexte deutsch (konsistent mit dem bestehenden Produkt)
