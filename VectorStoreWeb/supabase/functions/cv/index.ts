const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GROQ_API_KEY');
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured.');

    const { imageBase64 } = await request.json();
    if (!imageBase64) throw new Error('imageBase64 is required.');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
              { type: 'text', text: 'List all distinct inventory items visible in this image. Return only a JSON array: [{"name": string, "qty": number}]' },
            ],
          },
        ],
      }),
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      throw new Error(data?.error?.message || `Groq API error ${groqResponse.status}`);
    }

    const raw = data?.choices?.[0]?.message?.content || '';
    const match = raw.match(/\[[\s\S]*\]/);
    const items = JSON.parse(match ? match[0] : raw);

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error?.message || error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
