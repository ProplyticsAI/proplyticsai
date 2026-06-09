// Ermittelt die userId für eine API-Anfrage.
//
// Phase 1 (jetzt): liest optional ein Bearer-Token und dekodiert dessen `sub`,
// fällt sonst auf den Demo-Nutzer zurück — damit der Datenfluss schon vor der
// Identity-Anbindung funktioniert.
// Phase 2 (Netlify Identity): hier wird das JWT kryptografisch verifiziert
// (Signatur/Ablauf) und bei Fehlen ein 401 erzwungen.
const DEMO_USER_ID = "demo";

function decodeJwtSub(token) {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims = JSON.parse(json);
    return claims.sub || null;
  } catch {
    return null;
  }
}

export function getUserId(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) {
    const sub = decodeJwtSub(auth.slice(7));
    if (sub) return sub;
  }
  return DEMO_USER_ID;
}
