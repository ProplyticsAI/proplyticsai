const members = global._teamMembers ?? (global._teamMembers = [
  { id: 'mbr_001', name: 'Alex Klein', email: 'demo@proplytic.ai', role: 'owner', joined_at: '2026-01-01T00:00:00.000Z', avatar: null },
  { id: 'mbr_002', name: 'Maria Hoffmann', email: 'maria@proplytic.ai', role: 'admin', joined_at: '2026-02-15T00:00:00.000Z', avatar: null },
  { id: 'mbr_003', name: 'Tom Fischer', email: 'tom@proplytic.ai', role: 'member', joined_at: '2026-03-01T00:00:00.000Z', avatar: null },
  { id: 'mbr_004', name: 'Jana Berger', email: 'jana@proplytic.ai', role: 'member', joined_at: '2026-03-20T00:00:00.000Z', avatar: null },
  { id: 'mbr_005', name: 'Lukas Werner', email: 'lukas@proplytic.ai', role: 'member', joined_at: '2026-04-05T00:00:00.000Z', avatar: null },
  { id: 'mbr_006', name: 'Sophie Müller', email: 'sophie@proplytic.ai', role: 'viewer', joined_at: '2026-05-10T00:00:00.000Z', avatar: null },
]);

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(members);
  }

  if (req.method === 'POST') {
    const { email, role } = req.body ?? {};
    if (!email || !role) {
      return res.status(400).json({ error: 'email und role erforderlich' });
    }
    const member = {
      id: 'mbr_' + Date.now().toString(36),
      name: email.split('@')[0],
      email,
      role,
      joined_at: new Date().toISOString(),
      avatar: null,
    };
    members.push(member);
    return res.status(201).json(member);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
