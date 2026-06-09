// Proxy auf den ML-Bewertungsservice (separater Python/FastAPI-Dienst).
// Die URL liegt serverseitig in ML_API_URL — so bleibt der Dienst hinter dem
// Next.js-Backend und ist nicht direkt aus dem Browser/CORS erreichbar.
// Ist ML_API_URL nicht gesetzt oder der Dienst nicht erreichbar, antwortet die
// Route mit 503; das Frontend fällt dann auf die JS-Engine zurück.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const base = process.env.ML_API_URL;
  if (!base) {
    return res.status(503).json({ error: "ML-Service nicht konfiguriert" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(`${base.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(502).json({ error: "ML-Service-Fehler", status: upstream.status });
    }
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(503).json({ error: "ML-Service nicht erreichbar" });
  }
}
