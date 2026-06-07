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
| Login | 🔧 | `layouts/login.html` — E-Mail/Passwort-Form (Client-Validierung), „Angemeldet bleiben", Link zu Passwort-Reset, Google-/Microsoft-SSO-Buttons (Enterprise-Hinweis); Demo-Flow leitet auf `dashboard.html` weiter, echte Authentifizierung folgt mit Backend-Anbindung |
| Registrierung | 🔧 | `layouts/registrieren.html` — Name/Unternehmen (optional)/E-Mail/Passwort, AGB- & Datenschutz-Zustimmung; Demo-Flow leitet mit E-Mail-Parameter auf `e-mail-verifizierung.html` weiter |
| Logout | 🔧 | Als Bestätigungsdialog in `layouts/account-einstellungen.html` (§ Konto) umgesetzt — kein eigenständiger Screen, Demo-Flow leitet auf `login.html` weiter; echtes Session-Ende folgt mit Backend-Anbindung |
| Passwort vergessen / zurücksetzen | 🔧 | `layouts/passwort-vergessen.html` (Anfrage-Flow mit Bestätigungs-Card + Resend) und `layouts/passwort-zuruecksetzen.html` (Formular für neues Passwort inkl. Token-Prüfung und „Link ungültig"-Zustand) |
| E-Mail-Verifizierung | 🔧 | `layouts/e-mail-verifizierung.html` — Wartezustand mit Resend-Option + Demo-Bestätigungsbutton, der den verifizierten Zustand zeigt |
| Onboarding / Welcome-Flow | 🔧 | `layouts/willkommen.html` — 3-stufiger Einrichtungs-Flow (Begrüßung → Nutzungsart wählen → Abschluss mit Direktlink zur ersten Bewertung), inkl. „Überspringen"-Option; Auswahl wird mit Backend-Anbindung im Nutzerprofil gespeichert |
| Profil / Account-Einstellungen | 🔧 | `layouts/account-einstellungen.html` — Tab-Layout (Profil, Sicherheit inkl. Passwort-Änderung & 2FA-Hinweis, Benachrichtigungen, Konto inkl. Logout & Konto-löschen) im App-Layout (Sidebar/Header wie Dashboard) |
| Team-/Nutzerverwaltung (Rollen & Einladungen) | ⬜ | Enterprise |
| 2FA / SSO | ⬜ | Enterprise — Hinweis-Karte bereits in `account-einstellungen.html` (§ Sicherheit) verankert |

## Kernprodukt

| Seite/Feature | Status | Notiz |
|---|---|---|
| Dashboard | ✅ | `layouts/dashboard.html` |
| Bewertungsengine (Eingabe + Ergebnis) | 🔧 | `layouts/bewertung.html`, `components/valuation-procedures.js` — Ertragswert-/Sachwertverfahren + Chat-Wizard implementiert (PR #4) |
| Vergleichsfunktion | 🔧 | `layouts/vergleich.html` — Objekt-Picker (bis zu 4 Objekte, auch per `?objekte=`-URL-Parameter vorbelegbar), Kennzahlenvergleichstabelle mit Best-Wert-Hervorhebung, Rendite-Chart (PropChart.Bar), Entfernen einzelner Objekte aus dem Vergleich |
| Monte-Carlo × MiroFish-Risikosimulation | 🔧 | Monte-Carlo-Phase-1 implementiert (`components/monte-carlo.js`, PR #4); MiroFish-Agentensimulation (Enterprise-Vollausbau) noch offen |
| Objekt-/Portfolio-Verwaltung | 🔧 | `layouts/detail.html` (Objekt-Detailseite) sowie `layouts/portfolio.html` (Portfolio-Übersicht: Filter, Suche, Sortierung, Mehrfachauswahl mit Sammel-Aktionsleiste inkl. Direktsprung in die Vergleichsfunktion) vorhanden |
| Gespeicherte Bewertungen / Verlauf | 🔧 | `layouts/verlauf.html` — Statusfilter (Abgeschlossen/Entwurf/Archiviert), Verfahrensfilter, Suche, Leerzustand sowie Aktionen (Öffnen/Export/Löschen als Demo-Flow) |
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
| Impressum (§5 TMG) | 🔧 | `layouts/impressum.html` — strukturelle Vorlage mit § 5 TMG-Pflichtangaben steht; enthält markierte Platzhalter (Firma, Register, USt-ID, Vertretung), die vor Launch durch echte Unternehmensdaten ersetzt und juristisch geprüft werden müssen |
| Datenschutzerklärung (DSGVO) | 🔧 | `layouts/datenschutz.html` — Vorlage mit allen Pflichtabschnitten (Verantwortlicher, Zwecke/Rechtsgrundlagen inkl. Bewertungsengine & Exposé-Upload, Auftragsverarbeiter, Speicherdauer, Betroffenenrechte); Platzhalter für Auftragsverarbeiter/Fristen/Aufsichtsbehörde offen |
| AGB | 🔧 | `layouts/agb.html` — Vorlage mit Leistungsbeschreibung, Haftung (inkl. Disclaimer „kein Verkehrswertgutachten nach § 194 BauGB"), Kündigung, Datenschutz-Verweis; Platzhalter für Vertragspartner/Laufzeiten/Gerichtsstand offen |
| Widerrufsbelehrung | 🔧 | `layouts/widerruf.html` — gesetzliches Muster (Art. 246a § 1 Abs. 2 EGBGB) inkl. Muster-Widerrufsformular umgesetzt; Kontakt-Platzhalter offen |
| Cookie-Consent + Cookie-Richtlinie | 🔧 | `layouts/cookie-richtlinie.html` (Policy-Seite) + `components/cookie-consent.{js,css}` (granularer Consent-Banner: Notwendig/Funktional/Analyse, persistiert in localStorage, über „Cookie-Einstellungen" erneut öffenbar) — getestet via Playwright; konkrete Cookie-Tabelle/Anbieter noch zu ergänzen |
| AVV / DPA (Auftragsverarbeitung) | ⬜ | Enterprise/B2B |
| SLA | ⬜ | Enterprise |
| Leistungsbeschreibung | ⬜ | |
| Bewertungs-Disclaimer | 🔧 | Disclaimer-Text in `bewertung.html`-Ergebnisrendering und nun zusätzlich in den AGB (`agb.html` § 7) verankert („ersetzt kein Verkehrswertgutachten nach § 194 BauGB"); eigenständige Datenquellen-Hinweis-Seite (Gutachterausschuss/Bodenrichtwerte) noch offen |

## System / Operativ

| Seite | Status | Notiz |
|---|---|---|
| 404 | ⬜ | |
| 500 | ⬜ | |
| Wartungsseite | ⬜ | |
| Status-Seite | ⬜ | |
| Transaktionale E-Mail-Templates | ⬜ | |
