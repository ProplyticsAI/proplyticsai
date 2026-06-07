# Proplytic.ai — Release-Roadmap

Zentrale Checkliste für den Release. Status-Legende:

- ✅ vorhanden
- 🔧 vorhanden, muss angepasst werden
- ⬜ fehlt komplett

> Hinweis: Status-Spalten bitte fortlaufend von Hermes/Claude pflegen lassen, sobald der jeweilige Codebestand geprüft wurde.

## Kernziele

1. Eigene Bewertungsengine
2. Vergleichsfunktion
3. Monte-Carlo × MiroFish Enterprise-Risikosimulation
4. Vollständiges Seiten-Set inkl. Auth & Legal

---

## Auth & Account

| Seite | Status | Notiz |
|---|---|---|
| Login | ⬜ | |
| Registrierung | ⬜ | |
| Logout | ⬜ | |
| Passwort vergessen / zurücksetzen | ⬜ | |
| E-Mail-Verifizierung | ⬜ | |
| Onboarding / Welcome-Flow | ⬜ | |
| Profil / Account-Einstellungen | ⬜ | |
| Team-/Nutzerverwaltung (Rollen & Einladungen) | ⬜ | Enterprise |
| 2FA / SSO | ⬜ | Enterprise |

## Kernprodukt

| Seite/Feature | Status | Notiz |
|---|---|---|
| Dashboard | ✅ | `layouts/dashboard.html` |
| Bewertungsengine (Eingabe + Ergebnis) | 🔧 | `layouts/bewertung.html`, `components/valuation-procedures.js` — Ertragswert-/Sachwertverfahren + Chat-Wizard implementiert (PR #4) |
| Vergleichsfunktion | ⬜ | |
| Monte-Carlo × MiroFish-Risikosimulation | 🔧 | Monte-Carlo-Phase-1 implementiert (`components/monte-carlo.js`, PR #4); MiroFish-Agentensimulation (Enterprise-Vollausbau) noch offen |
| Objekt-/Portfolio-Verwaltung | 🔧 | `layouts/detail.html` (Objekt-Detailseite) vorhanden, Portfolio-Übersicht offen |
| Gespeicherte Bewertungen / Verlauf | ⬜ | |
| PDF-/Gutachten-Export | ✅ | `layouts/bewertung-pdf.html`, `bewertung-pdf.css` |

## Billing

| Seite | Status | Notiz |
|---|---|---|
| Preise / Pläne | ⬜ | |
| Checkout | ⬜ | |
| Abo-/Rechnungsverwaltung | ⬜ | |
| Enterprise-Sales-Kontakt | ⬜ | |

## Public / Marketing

| Seite | Status | Notiz |
|---|---|---|
| Landingpage | ⬜ | |
| Feature-Seiten | ⬜ | |
| Über uns | ⬜ | |
| Kontakt | ⬜ | |
| FAQ / Hilfe | ⬜ | |

## Legal (DE-Pflicht — release-kritisch)

| Seite | Status | Notiz |
|---|---|---|
| Impressum (§5 TMG) | ⬜ | |
| Datenschutzerklärung (DSGVO) | ⬜ | |
| AGB | ⬜ | |
| Widerrufsbelehrung | ⬜ | |
| Cookie-Consent + Cookie-Richtlinie | ⬜ | |
| AVV / DPA (Auftragsverarbeitung) | ⬜ | Enterprise/B2B |
| SLA | ⬜ | Enterprise |
| Leistungsbeschreibung | ⬜ | |
| Bewertungs-Disclaimer | 🔧 | Disclaimer-Text bereits in `bewertung.html`-Ergebnisrendering vorhanden („ersetzt kein Verkehrswertgutachten nach § 194 BauGB") — eigenständige Legal-Seite mit vollständigem Datenquellen-Hinweis (Gutachterausschuss/Bodenrichtwerte) noch offen |

## System / Operativ

| Seite | Status | Notiz |
|---|---|---|
| 404 | ⬜ | |
| 500 | ⬜ | |
| Wartungsseite | ⬜ | |
| Status-Seite | ⬜ | |
| Transaktionale E-Mail-Templates | ⬜ | |
