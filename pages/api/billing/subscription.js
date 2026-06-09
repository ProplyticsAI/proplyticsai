export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  return res.status(200).json({
    id: 'sub_demo',
    plan: 'pro',
    billing_period: 'monthly',
    price: 4900,
    next_billing: '2026-07-09T00:00:00.000Z',
    status: 'active',
    payment_method: { brand: 'visa', last4: '4242', expires: '08/28' },
  });
}
