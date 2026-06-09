const invitations = global._teamInvitations ?? (global._teamInvitations = [
  { id: 'inv_t001', email: 'kai@example.de', role: 'member', invited_at: '2026-06-05T10:00:00.000Z', expires_at: '2026-06-19T10:00:00.000Z', status: 'pending' },
  { id: 'inv_t002', email: 'anna@example.de', role: 'viewer', invited_at: '2026-06-07T14:30:00.000Z', expires_at: '2026-06-21T14:30:00.000Z', status: 'pending' },
]);

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(invitations);
  }

  if (req.method === 'POST') {
    const { email, role } = req.body ?? {};
    if (!email || !role) {
      return res.status(400).json({ error: 'email und role erforderlich' });
    }
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 14);
    const invitation = {
      id: 'inv_t' + Date.now().toString(36),
      email,
      role,
      invited_at: now.toISOString(),
      expires_at: expires.toISOString(),
      status: 'pending',
    };
    invitations.push(invitation);
    return res.status(201).json(invitation);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
