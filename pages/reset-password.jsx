import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import t from '../components/brand';
import { Mark, Cap, Btn } from '../components/primitives';
import { AuthFrame } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

function Input({ label, type = 'text', value, onChange, placeholder, icon, onKeyDown }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ marginBottom: 7 }}><Cap t={t} color={t.muted}>{label}</Cap></div>}
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { ready, recovery, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !recovery) router.replace('/login');
  }, [ready, recovery, router]);

  async function submit() {
    if (!password || password.length < 8) { setError('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    if (password !== password2) { setError('Die Passwörter stimmen nicht überein.'); return; }
    setError(null);
    setLoading(true);
    try {
      await updatePassword(password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Passwort konnte nicht geändert werden.');
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Passwort zurücksetzen — proplytic.ai</title></Head>
      <AuthFrame t={t}>
        <div style={{ marginBottom: 30 }}>
          <Mark t={t} size={40} />
          <h1 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>
            Neues Passwort
          </h1>
          <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>
            Wählen Sie ein neues Passwort für Ihr Konto.
          </p>
        </div>
        {!ready ? (
          <Cap t={t} color={t.faint}>Lädt…</Cap>
        ) : !recovery ? (
          <Cap t={t} color={t.faint}>Weiterleitung…</Cap>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Neues Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              icon="lock"
            />
            <Input
              label="Passwort bestätigen"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="••••••••"
              icon="lock"
            />
            {error && <div style={{ fontFamily: t.sans, fontSize: 13, color: t.neg }}>{error}</div>}
            <Btn t={t} variant="primary" full style={{ marginTop: 6, height: 48 }} onClick={submit}>
              {loading ? 'Wird gespeichert…' : 'Passwort speichern'}
            </Btn>
            <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 8 }}>
              <Link href="/login" style={{ color: t.highlight, fontWeight: 600 }}>Zurück zur Anmeldung</Link>
            </p>
          </div>
        )}
      </AuthFrame>
    </>
  );
}
