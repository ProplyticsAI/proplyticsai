import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import t from '../components/brand';
import { Mark, Cap, Btn } from '../components/primitives';
import { AuthFrame } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

function Input({ label, type = 'text', value, onChange, placeholder, icon, action, onKeyDown }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <Cap t={t} color={t.muted}>{label}</Cap>
        {action}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 13px',
        height: 46, background: t.surface,
        border: `1px solid ${t.line}`, borderRadius: t.radius,
      }}>
        {icon && <Icon name={icon} size={17} color={t.faint} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{ border: 0, outline: 0, background: 'transparent', flex: 1, fontFamily: t.sans, fontSize: 14.5, color: t.ink }}
        />
      </div>
    </label>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, login, loginWithProvider, requestPasswordRecovery } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace('/dashboard');
  }, [ready, user, router]);

  async function submit() {
    if (!email || !password) { setError('Bitte E-Mail und Passwort eingeben.'); return; }
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Anmeldung fehlgeschlagen.');
      setLoading(false);
    }
  }

  async function forgotPassword() {
    if (!email) { setError('Bitte zuerst Ihre E-Mail-Adresse eingeben.'); return; }
    setError(null);
    setInfo(null);
    try {
      await requestPasswordRecovery(email);
      setInfo('Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen versendet.');
    } catch (err) {
      setError(err.message || 'Anfrage fehlgeschlagen.');
    }
  }

  return (
    <>
      <Head><title>Anmelden — proplytic.ai</title></Head>
      <AuthFrame t={t}>
        <div style={{ marginBottom: 30 }}>
          <Mark t={t} size={40} />
          <h1 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>
            Willkommen zurück
          </h1>
          <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>
            Anmelden, um Ihre Bewertungen synchron zu halten.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            icon="mail"
          />
          <Input
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="••••••••"
            icon="lock"
            action={
              <span onClick={forgotPassword} style={{ fontFamily: t.sans, fontSize: 12.5, color: t.highlight, fontWeight: 500, cursor: 'pointer' }}>
                Vergessen?
              </span>
            }
          />
          {error && <div style={{ fontFamily: t.sans, fontSize: 13, color: t.neg }}>{error}</div>}
          {info && <div style={{ fontFamily: t.sans, fontSize: 13, color: t.pos }}>{info}</div>}
          <Btn t={t} variant="primary" full style={{ marginTop: 6, height: 48 }} onClick={submit}>
            {loading ? 'Anmelden…' : 'Anmelden'}
          </Btn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0' }}>
            <span style={{ flex: 1, height: 1, background: t.line }} />
            <Cap t={t} color={t.faint}>oder</Cap>
            <span style={{ flex: 1, height: 1, background: t.line }} />
          </div>
          <Btn t={t} variant="outline" full style={{ height: 48 }} onClick={() => loginWithProvider('google')}>
            Mit Google fortfahren
          </Btn>
          <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 8 }}>
            Noch kein Konto?{' '}
            <Link href="/register" style={{ color: t.highlight, fontWeight: 600 }}>Jetzt erstellen</Link>
          </p>
        </div>
      </AuthFrame>
    </>
  );
}
