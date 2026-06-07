/*!
 * CookieConsent — Proplytic.ai
 * Granulares Einwilligungs-Banner (Notwendig · Funktional · Analyse)
 * gemäß § 25 TTDSG / Art. 7 DSGVO. Speichert die Auswahl in localStorage
 * und stellt sie über `CookieConsent.get()` plattformweit bereit.
 *
 * Einbindung (vor </body>):
 *   <link rel="stylesheet" href="../components/cookie-consent.css">
 *   <script src="../components/cookie-consent.js"></script>
 *   <script>CookieConsent.init();</script>
 *
 * API:
 *   CookieConsent.init(opts?)         — rendert das Banner, falls noch keine Auswahl gespeichert ist
 *   CookieConsent.get()               — { necessary, functional, analytics } | null
 *   CookieConsent.openSettings()      — öffnet das Banner erneut (z. B. via Footer-Link „Cookie-Einstellungen")
 *   CookieConsent.onChange(callback)  — Callback bei jeder gespeicherten Änderung
 */
const CookieConsent = (() => {
  'use strict';

  const STORAGE_KEY = 'proplytic_cookie_consent_v1';
  const listeners = [];
  let bannerEl = null;

  const CATEGORIES = [
    {
      key: 'necessary',
      label: 'Notwendig',
      desc: 'Erforderlich für Login, Sicherheit und die Speicherung Ihrer Cookie-Einstellungen. Kann nicht deaktiviert werden.',
      locked: true,
    },
    {
      key: 'functional',
      label: 'Funktional',
      desc: 'Speichert Komfort-Einstellungen, z. B. den zuletzt genutzten Bewertungsmodus.',
      locked: false,
    },
    {
      key: 'analytics',
      label: 'Analyse',
      desc: 'Anonymisierte Nutzungsstatistiken zur Verbesserung der Plattform.',
      locked: false,
    },
  ];

  function readStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) { /* localStorage evtl. blockiert — Auswahl gilt nur für diese Sitzung */ }
    listeners.forEach(fn => fn(consent));
  }

  function get() {
    return readStoredConsent();
  }

  function onChange(callback) {
    if (typeof callback === 'function') listeners.push(callback);
  }

  function buildBanner(policyHref) {
    const wrap = document.createElement('div');
    wrap.className = 'cookie-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Cookie-Einstellungen');

    const options = CATEGORIES.map(c => `
      <label class="cookie-consent-option">
        <input type="checkbox" data-key="${c.key}" ${c.locked ? 'checked disabled' : ''}>
        <span class="cookie-consent-option-body">
          <span class="cookie-consent-option-label">${c.label}${c.locked ? ' (immer aktiv)' : ''}</span>
          <span class="cookie-consent-option-desc">${c.desc}</span>
        </span>
      </label>`).join('');

    wrap.innerHTML = `
      <div class="cookie-consent-card">
        <div class="cookie-consent-title">Ihre Cookie-Einstellungen</div>
        <p class="cookie-consent-text">
          Wir nutzen Cookies, um Proplytic.ai bereitzustellen, abzusichern und zu verbessern.
          Notwendige Cookies sind immer aktiv; für funktionale und analytische Cookies
          benötigen wir Ihre Einwilligung. Details finden Sie in unserer
          <a href="${policyHref}">Cookie-Richtlinie</a>.
        </p>
        <div class="cookie-consent-options">${options}</div>
        <div class="cookie-consent-actions">
          <button type="button" class="btn btn-outline" data-action="reject">Nur Notwendige</button>
          <button type="button" class="btn btn-secondary" data-action="save">Auswahl speichern</button>
          <button type="button" class="btn btn-primary" data-action="accept-all">Alle akzeptieren</button>
        </div>
      </div>`;

    wrap.querySelector('[data-action="accept-all"]').addEventListener('click', () => {
      applyAndClose({ necessary: true, functional: true, analytics: true });
    });
    wrap.querySelector('[data-action="reject"]').addEventListener('click', () => {
      applyAndClose({ necessary: true, functional: false, analytics: false });
    });
    wrap.querySelector('[data-action="save"]').addEventListener('click', () => {
      const consent = { necessary: true };
      wrap.querySelectorAll('input[type="checkbox"]:not([disabled])').forEach(input => {
        consent[input.dataset.key] = input.checked;
      });
      applyAndClose(consent);
    });

    return wrap;
  }

  function applyAndClose(consent) {
    writeConsent({ ...consent, decidedAt: new Date().toISOString() });
    if (bannerEl) bannerEl.setAttribute('hidden', '');
  }

  function openSettings() {
    if (!bannerEl) return;
    const stored = readStoredConsent() || {};
    bannerEl.querySelectorAll('input[type="checkbox"]:not([disabled])').forEach(input => {
      input.checked = !!stored[input.dataset.key];
    });
    bannerEl.removeAttribute('hidden');
  }

  function init(opts = {}) {
    const policyHref = opts.policyHref || './cookie-richtlinie.html';
    if (bannerEl) return;

    bannerEl = buildBanner(policyHref);
    document.body.appendChild(bannerEl);

    if (readStoredConsent()) {
      bannerEl.setAttribute('hidden', '');
    }
  }

  return { init, get, onChange, openSettings };
})();
