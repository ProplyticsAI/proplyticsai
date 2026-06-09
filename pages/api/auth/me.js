export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  return res.status(200).json({
    user: { id: 'demo', name: 'Alex Klein', email: 'demo@proplytic.ai', plan: 'pro' },
  });
}
