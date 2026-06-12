import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, consumeAuthRedirect, hasAuthCallbackError } from '../lib/useAuth';

// Netlify-Identity-Links (E-Mail-Bestätigung, OAuth, Passwort-Recovery)
// leiten auf die Startseite mit einem Token im URL-Hash. Dieser Handler
// verarbeitet den Callback auf jeder Seite und leitet passend weiter.
function AuthCallbackRedirect() {
  const router = useRouter();
  const { ready, recovery, user } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (hasAuthCallbackError()) {
      if (router.pathname !== '/login') router.replace('/login');
      return;
    }
    if (recovery) {
      if (router.pathname !== '/reset-password') router.replace('/reset-password');
      return;
    }
    if (user && consumeAuthRedirect()) router.replace('/dashboard');
  }, [ready, recovery, user, router]);

  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthCallbackRedirect />
      <Component {...pageProps} />
    </>
  );
}
