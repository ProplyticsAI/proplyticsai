/*!
 * ProplyticAuth — Browser-Wrapper um Netlify Identity (@netlify/identity)
 *
 * Die statischen HTML-Layouts haben keinen Bundler, daher wird das ESM-Paket
 * zur Laufzeit per CDN dynamisch geladen und als `window.ProplyticAuth`
 * bereitgestellt. Verwendung:
 *
 *   <script type="module" src="../components/auth.js"></script>
 *   ProplyticAuth.ready.then(() => { ... ProplyticAuth.login(email, pw) ... })
 *
 * API:
 *   ready            — Promise, das auflöst, sobald Identity geladen ist
 *   login(email,pw)  — meldet an, gibt user zurück (wirft bei Fehler)
 *   signup(email,pw,name,company?) — Registrierung
 *   logout()         — meldet ab
 *   getUser()        — aktueller User | null
 *   getToken()       — gültiges Zugriffstoken (für Authorization-Header) | null
 *   requireAuth(redirect='./login.html') — leitet um, wenn nicht eingeloggt
 *   handleCallback() — verarbeitet Bestätigungs-/Recovery-Links im URL-Hash
 *   fetchWithAuth(url, opts) — fetch mit Bearer-Token, falls vorhanden
 */
const CDN = "https://esm.sh/@netlify/identity@1";

let identity = null;

const ready = (async () => {
  try {
    identity = await import(/* @vite-ignore */ CDN);
    return true;
  } catch (e) {
    console.warn("[auth] Netlify Identity konnte nicht geladen werden:", e);
    return false;
  }
})();

async function login(email, password) {
  await ready;
  return identity.login(email, password);
}

async function signup(email, password, name, company) {
  await ready;
  const data = {};
  if (name) data.full_name = name;
  if (company) data.company = company;
  return identity.signup(email, password, data);
}

async function logout() {
  await ready;
  if (identity) await identity.logout();
}

async function getUser() {
  await ready;
  return identity ? identity.getUser() : null;
}

async function getToken() {
  const user = await getUser();
  // @netlify/identity hängt das Token an das User-Objekt; Feldname defensiv lesen
  return user?.token?.access_token || user?.access_token || null;
}

async function requireAuth(redirect = "./login.html") {
  const user = await getUser();
  if (!user) {
    window.location.href = redirect;
    return null;
  }
  return user;
}

async function handleCallback() {
  await ready;
  if (!identity || !identity.handleAuthCallback) return null;
  try {
    return await identity.handleAuthCallback();
  } catch {
    return null;
  }
}

async function fetchWithAuth(url, opts = {}) {
  const token = await getToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url, { ...opts, headers });
}

window.ProplyticAuth = {
  ready,
  login,
  signup,
  logout,
  getUser,
  getToken,
  requireAuth,
  handleCallback,
  fetchWithAuth,
};
