// Verifiziert ein Netlify-Identity-Bearer-Token per GoTrue-Introspection:
// GET {site-url}/.netlify/identity/user mit dem Token prüft Signatur + Ablauf
// serverseitig und liefert bei Erfolg den User (inkl. id/sub) zurück.
// Kein eigenes Secret nötig — funktioniert auf jedem Netlify-Plan.
export async function getUserId(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);

  const base = process.env.URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base}/.netlify/identity/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user.id || user.sub || null;
  } catch {
    return null;
  }
}

export async function requireUserId(req, res) {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return null;
  }
  return userId;
}
