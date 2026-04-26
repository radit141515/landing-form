export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(
      "https://viking-mandatory-jacksonville-gif.trycloudflare.com/webhook/lead-capture",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();
    return res.status(response.status).send(text);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
