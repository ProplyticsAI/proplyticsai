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

export function useAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe;
    import('@netlify/identity').then(async ({ getUser, hydrateSession, onAuthChange }) => {
      await hydrateSession();
      const current = await getUser();
      if (!mounted) return;
      setUser(current);
      setReady(true);
      unsubscribe = onAuthChange((_event, u) => setUser(u));
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
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    const { logout: doLogout } = await import('@netlify/identity');
    await doLogout();
    setUser(null);
  }, []);

  const fetchWithAuth = useCallback((url, opts = {}) => {
    const token = getJwtCookie();
    const headers = { ...(opts.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { ...opts, headers });
  }, []);

  return { user, ready, login, signup, logout, fetchWithAuth };
}
