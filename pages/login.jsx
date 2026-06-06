import Head from 'next/head';
import Link from 'next/link';
import t from '../components/brand';
import { Mark, Cap, Btn, Field } from '../components/primitives';
import { AuthFrame } from '../components/layout';

export default function LoginPage() {
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
          <Field t={t} label="E-Mail" value="alex@kessler.de" icon="mail" />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <Cap t={t} color={t.muted}>Passwort</Cap>
              <span style={{ fontFamily: t.sans, fontSize: 12.5, color: t.highlight, fontWeight: 500, cursor: 'pointer' }}>Vergessen?</span>
            </div>
            <Field t={t} value="" placeholder="••••••••" icon="lock" type="password" />
          </div>
          <Btn t={t} variant="primary" full style={{ marginTop: 6, height: 48 }}>Anmelden</Btn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0' }}>
            <span style={{ flex: 1, height: 1, background: t.line }} />
            <Cap t={t} color={t.faint}>oder</Cap>
            <span style={{ flex: 1, height: 1, background: t.line }} />
          </div>
          <Btn t={t} variant="outline" full style={{ height: 48 }}>Mit Google fortfahren</Btn>
          <p style={{ fontFamily: t.sans, fontSize: 13.5, color: t.muted, textAlign: 'center', marginTop: 8 }}>
            Noch kein Konto?{' '}
            <Link href="/register" style={{ color: t.highlight, fontWeight: 600 }}>Jetzt erstellen</Link>
          </p>
        </div>
      </AuthFrame>
    </>
  );
}
