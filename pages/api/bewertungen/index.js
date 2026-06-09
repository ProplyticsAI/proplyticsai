const store = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(store.slice().reverse());
  }

  if (req.method === 'POST') {
    const { adresse, wert, methode, monte_carlo } = req.body ?? {};
    if (!adresse || wert == null) {
      return res.status(400).json({ error: 'adresse und wert erforderlich' });
    }
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      adresse,
      wert,
      methode: methode ?? 'ertragswert',
      monte_carlo: monte_carlo ?? null,
      created_at: new Date().toISOString(),
    };
    store.push(entry);
    return res.status(201).json(entry);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
