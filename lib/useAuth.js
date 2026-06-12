// React-Hook für Netlify Identity (@netlify/identity) in Next.js-Seiten.
// Hält den eingeloggten Nutzer im State und stellt fetchWithAuth() für
// authentifizierte API-Aufrufe bereit (Bearer-Token aus dem nf_jwt-Cookie,
// das @netlify/identity beim Login setzt).
import { useCallback, useEffect, useState } from 'react';

function getJwtCookie() {
  if (typeof document === 'undefined') return null;
  const match = /(?:^|; )nf_jwt=([^;]*)/.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : null;
}

// Der Hash-Callback (Bestätigung, OAuth, Recovery) wird nur von der ersten
// useAuth-Instanz eingelöst; das Ergebnis muss Seitenwechsel überleben.
let lastCallbackType = null;

// Liefert den Callback-Typ genau einmal, damit _app nach E-Mail-Bestätigung
// oder OAuth zum Dashboard weiterleiten kann. Recovery bleibt bestehen, bis
// das neue Passwort gesetzt ist.
export function consumeAuthRedirect() {
  if (!lastCallbackType || lastCallbackType === 'recovery') return null;
  const type = lastCallbackType;
  lastCallbackType = null;
  return type;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe;
    import('@netlify/identity').then(async ({ getUser, hydrateSession, onAuthChange, handleAuthCallback }) => {
      try {
        const result = await handleAuthCallback();
        if (result?.type) lastCallbackType = result.type;
      } catch {
        // ungültiger oder abgelaufener Bestätigungs-/Recovery-Link – ignorieren
      }
      await hydrateSession();
      const current = await getUser();
      if (!mounted) return;
      if (lastCallbackType === 'recovery') setRecovery(true);
      setUser(current);
      setReady(true);
      unsubscribe = onAuthChange((event, u) => {
        if (event === 'recovery') {
          lastCallbackType = 'recovery';
          setRecovery(true);
        }
        setUser(u);
      });
    });
    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { login: doLogin } = await import('@netlify/identity');
    const u = await doLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (email, password, data) => {
    const { signup: doSignup } = await import('@netlify/identity');
    const u = await doSignup(email, password, data);
    // Ohne Autoconfirm existiert nach dem Signup noch keine Session –
    // der Nutzer ist erst nach der E-Mail-Bestätigung eingeloggt.
    if (u?.confirmedAt) setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    const { logout: doLogout } = await import('@netlify/identity');
    await doLogout();
    setUser(null);
  }, []);

  const loginWithProvider = useCallback(async (provider) => {
    const { oauthLogin } = await import('@netlify/identity');
    oauthLogin(provider);
  }, []);

  const requestPasswordRecovery = useCallback(async (email) => {
    const { requestPasswordRecovery: doRecover } = await import('@netlify/identity');
    await doRecover(email);
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { updateUser } = await import('@netlify/identity');
    const u = await updateUser({ password });
    lastCallbackType = null;
    setUser(u);
    setRecovery(false);
    return u;
  }, []);

  const fetchWithAuth = useCallback((url, opts = {}) => {
    const token = getJwtCookie();
    const headers = { ...(opts.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { ...opts, headers });
  }, []);

  return { user, ready, recovery, login, signup, logout, loginWithProvider, requestPasswordRecovery, updatePassword, fetchWithAuth };
}
