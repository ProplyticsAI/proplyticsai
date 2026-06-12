import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import t from '../components/brand';
import { Mark, Cap, Btn } from '../components/primitives';
import { AuthFrame } from '../components/layout';
import Icon from '../components/icons';
import { useAuth } from '../lib/useAuth';

function Input({ label, type = 'text', value, onChange, placeholder, icon }) {
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
          placeholder={placeholder}
          style={{ border: 0, outline: 0, background: 'transparent', flex: 1, fontFamily: t.sans, fontSize: 14.5, color: t.ink }}
        />
      </div>
    </label>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, ready, signup } = useAuth();
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agb, setAgb] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace('/dashboard');
  }, [ready, user, router]);

  async function submit() {
    if (!email || !password) { setError('Bitte E-Mail und Passwort eingeben.'); return; }
    if (!agb) { setError('Bitte stimmen Sie den AGB und der Datenschutzerklärung zu.'); return; }
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const fullName = `${vorname} ${nachname}`.trim();
      const result = await signup(email, password, fullName ? { full_name: fullName } : undefined);
      if (result?.confirmedAt) {
        router.push('/dashboard');
      } else {
        setInfo('Konto erstellt. Bitte bestätigen Sie Ihre E-Mail-Adresse über den zugesendeten Link.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Registrierung fehlgeschlagen.');
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Konto erstellen — proplytic.ai</title></Head>
      <AuthFrame t={t}>
        <div style={{ marginBottom: 26 }}>
          <Mark t={t} size={40} />
          <h1 style={{ fontFamily: t.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>
            Konto erstellen
          </h1>
          <p style={{ fontFamily: t.sans, fontSize: 15, color: t.muted, margin: 0 }}>
            Kostenlos starten — bis zu 10 gespeicherte Bewertungen.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Vorname" value={vorname} onChange={(e) => setVorname(e.target.value)} icon="user" />
            <Input label="Nachname" value={nachname} onChange={(e) => setNachname(e.target.value)} />
          </div>
          <Input label="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de" icon="mail" />
          <Input label="Passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort wählen" icon="lock" />
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 2, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agb}
              onChange={(e) => setAgb(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, accentColor: t.accent }}
            />
            <span style={{ fontFamily: t.sans, fontSize: 12.5, lineHeight: 1.5, color: t.muted }}>
              Ich stimme den AGB und der Datenschutzerklärung zu.
            </span>
          </label>
          {error && <div style={{ fontFamily: t.sans, fontSize: 13, color: t.neg }}>{error}</div>}
          {info && <div style={{ fontFamily: t.sans, fontSize: 13, color: t.pos }}>{info}</div>}
          <Btn
            t={t}
            variant="primary"
            full
            style={{ marginTop: 4, height: 48, opacity: agb ? 1 : 0.5, cursor: agb ? 'pointer' : 'not-allowed' }}
            onClick={submit}
          >
            {loading ? 'Wird erstellt…' : 'Konto erstellen'}
          </Btn>
          <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 4 }}>
            Bereits registriert?{' '}
            <Link href="/login" style={{ color: t.highlight, fontWeight: 600 }}>Anmelden</Link>
          </p>
        </div>
      </AuthFrame>
    </>
  );
}
