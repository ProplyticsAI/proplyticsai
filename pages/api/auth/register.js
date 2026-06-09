const users = global._users ?? (global._users = [
  { id: 'demo', name: 'Alex Klein', email: 'demo@proplytic.ai', password: 'demo1234', company: 'Proplytic', plan: 'pro', createdAt: '2026-01-01T00:00:00.000Z' },
]);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { name, email, password, company } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email und password erforderlich' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Ungültiges E-Mail-Format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'E-Mail bereits registriert' });
  }

  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    email,
    password,
    company: company ?? null,
    plan: 'starter',
    createdAt: new Date().toISOString(),
  };
  users.push(user);

  const { password: _pw, ...safeUser } = user;
  return res.status(201).json({ user: { id: safeUser.id, name: safeUser.name, email: safeUser.email, plan: safeUser.plan } });
}
