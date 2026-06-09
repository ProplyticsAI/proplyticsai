export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { plan, billing_period = 'monthly', payment_method } = req.body ?? {};

  if (!plan) {
    return res.status(400).json({ error: 'plan erforderlich' });
  }

  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);

  return res.status(200).json({
    subscription: {
      id: 'sub_' + Date.now().toString(36),
      plan,
      billing_period,
      next_billing: nextBilling.toISOString(),
      status: 'active',
    },
  });
}
