const https = require('https');
const url = require('url');

const N8N_URL = "https://viking-mandatory-jacksonville-gif.trycloudflare.com/webhook/lead-capture";

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const parsed = url.parse(N8N_URL);
  const body = JSON.stringify(req.body);

  const options = {
    hostname: parsed.hostname,
    path: parsed.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve) => {
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        res.status(response.statusCode).send(data);
        resolve();
      });
    });
    request.on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
    request.write(body);
    request.end();
  });
};
