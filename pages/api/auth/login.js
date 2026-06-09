const users = global._users ?? (global._users = [
  { id: 'demo', name: 'Alex Klein', email: 'demo@proplytic.ai', password: 'demo1234', company: 'Proplytic', plan: 'pro', createdAt: '2026-01-01T00:00:00.000Z' },
]);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email und password erforderlich' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
  }

  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    token,
  });
}
