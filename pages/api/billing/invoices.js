const invoices = [
  { id: 'inv_001', date: '2026-06-09', amount: 4900, status: 'paid', pdf_url: '#' },
  { id: 'inv_002', date: '2026-05-09', amount: 4900, status: 'paid', pdf_url: '#' },
  { id: 'inv_003', date: '2026-04-09', amount: 4900, status: 'paid', pdf_url: '#' },
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  return res.status(200).json(invoices);
}
