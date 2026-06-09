const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price_monthly: 0,
    price_yearly: 0,
    features: ['3 Bewertungen/Monat', 'Ertragswert- & Sachwertverfahren', 'PDF-Export'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 4900,
    price_yearly: 3900,
    features: [
      'Unbegrenzte Bewertungen',
      'Alle 3 Verfahren',
      'Monte-Carlo-Simulation',
      'Vergleichsfunktion',
      'Portfolio-Verwaltung',
      'E-Mail-Support',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price_monthly: null,
    price_yearly: null,
    features: [
      'Alles aus Pro',
      'Team-Verwaltung',
      'SSO/SAML',
      'API-Zugang',
      'SLA',
      'Dedizierter Support',
    ],
  },
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  return res.status(200).json(plans);
}
