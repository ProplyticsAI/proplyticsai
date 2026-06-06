import Head from 'next/head';
import Link from 'next/link';
import t from '../components/brand';
import { Mark, Cap, Btn, Field } from '../components/primitives';
import { AuthFrame } from '../components/layout';
import Icon from '../components/icons';

export default function RegisterPage() {
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
            <Field t={t} label="Vorname" value="Alex" icon="user" />
            <Field t={t} label="Nachname" value="Kessler" />
          </div>
          <Field t={t} label="E-Mail" value="alex@kessler.de" icon="mail" />
          <Field t={t} label="Passwort" value="" placeholder="Passwort wählen" icon="lock" type="password" />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 2 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 4, border: `1px solid ${t.lineStrong}`,
              background: t.accent, color: t.onAccent, display: 'grid', placeItems: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <Icon name="check" size={12} stroke={3} />
            </span>
            <span style={{ fontFamily: t.sans, fontSize: 12.5, lineHeight: 1.5, color: t.muted }}>
              Ich stimme den AGB und der Datenschutzerklärung zu.
            </span>
          </div>
          <Btn t={t} variant="primary" full style={{ marginTop: 4, height: 48 }}>Konto erstellen</Btn>
          <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 4 }}>
            Bereits registriert?{' '}
            <Link href="/login" style={{ color: t.highlight, fontWeight: 600 }}>Anmelden</Link>
          </p>
        </div>
      </AuthFrame>
    </>
  );
}
