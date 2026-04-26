// Vercel Serverless Function — proxies form POST to n8n
// This runs server-side so there is no CORS issue

const N8N_WEBHOOK = "https://swing-snow-definitely-christmas.trycloudflare.com/webhook/lead-capture";

export default async function handler(req, res) {
  // Allow requests from your Vercel domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }

    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to reach n8n', detail: error.message });
  }
}
