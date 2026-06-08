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
| Landingpage | 🔧 | `layouts/landing.html` (+ neues gemeinsames `layouts/marketing.css`-Layout) — Hero, Funktions-Grid (Bewertungsengine, Vergleich, Monte-Carlo, Portfolio, PDF-Export, Verlauf), „So funktioniert's"-Schritte, CTA-Band, Footer mit Produkt-/Unternehmens-/Rechtliches-Spalten |
| Feature-Seiten | 🔧 | `layouts/features.html` — konsolidierte Funktionsübersicht mit Detail-Abschnitten je Kernfunktion (Bewertungsengine, Vergleich, Monte-Carlo, Portfolio, Export/Verlauf) inkl. Vorteils-Listen und CTA-Band |
| Über uns | 🔧 | `layouts/ueber-uns.html` — Mission/Werte-Seite (Nachvollziehbarkeit, Sorgfalt, Zugänglichkeit, Datenschutz); bewusst ohne Gründer-/Team-/Historien-Angaben, um keine Fakten zu erfinden — kann vor Launch um echte Unternehmensdaten ergänzt werden |
| Kontakt | 🔧 | `layouts/kontakt.html` — Kontaktformular (Name/E-Mail/Betreff/Nachricht, Client-Validierung, Demo-Erfolgsmeldung) sowie Kontaktinfo-Karte mit E-Mail/Telefon/Anschrift; Telefon- und Adressangaben als „Platzhalter" markiert (analog `impressum.html`) und vor Launch zu ersetzen |
| FAQ / Hilfe | 🔧 | `layouts/faq.html` — Akkordeon mit nativen `<details>`/`<summary>`-Elementen, gruppiert nach Bewertung & Verfahren / Funktionen / Konto & Datenschutz, plus Kontakt-Hinweiskarte |

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
| 404 | 🔧 | `layouts/404.html` — Auth-Card-Layout mit Hinweistext und Schnellzugriffen (Dashboard/Objektübersicht), Support-Link |
| 500 | 🔧 | `layouts/500.html` — Hinweis auf unerwarteten Serverfehler, „Seite neu laden"-Button, Links zu Support und Systemstatus |
| Wartungsseite | 🔧 | `layouts/wartung.html` — Hinweis auf geplante Wartung mit ETA-Platzhalter („in Kürze“), Verweis auf Statusseite und Support |
| Status-Seite | 🔧 | `layouts/status.html` — Gesamtstatus-Banner, Dienste-Liste mit Badges, geplante Wartungen, Vorfallshistorie (Demo-Einträge) sowie Update-Abo (Demo-Flow) |
| Transaktionale E-Mail-Templates | 🔧 | `layouts/e-mail-templates.html` — Katalogseite im App-Layout mit Live-Vorschau für Willkommen-, Bestätigungs-, Passwort-Reset- und „Bewertung fertig"-E-Mail inkl. Metadaten (Auslöser/Von/Betreff); Versand folgt mit Backend-/E-Mail-Provider-Anbindung |
