interface GroqEnv {
  readonly GROQ_API_KEY?: string;
}

interface GroqContext {
  readonly env: GroqEnv;
}

/**
 * Diagnostic endpoint: lists models available to the configured Groq key.
 * GET /api/groq-models
 */
export async function onRequestGet(context: GroqContext): Promise<Response> {
  const apiKey = context.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.groq.com/openai/v1/models', {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
