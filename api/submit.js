export const config = { runtime: 'edge' };

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.text();

    const n8nRes = await fetch(
      "https://viking-mandatory-jacksonville-gif.trycloudflare.com/webhook/lead-capture",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }
    );

    const text = await n8nRes.text();

    return new Response(text, {
      status: n8nRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
