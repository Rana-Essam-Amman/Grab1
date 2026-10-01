interface GeminiEnv {
  readonly GEMINI_API_KEY?: string;
}

interface GeminiContext {
  readonly request: Request;
  readonly env: GeminiEnv;
}

const GOOGLE_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function onRequestPost(context: GeminiContext): Promise<Response> {
  // Cloudflare Pages Functions access secrets via context.env.
  // This is the correct way for serverless runtime. `VITE_` prefix is for client-side only.
  const apiKey = (context.env as { GEMINI_API_KEY?: string }).GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError('Server key not configured', 500);
  }

  const url = new URL(context.request.url);
  const model = url.searchParams.get('model') || 'gemini-flash-latest';
  const target = `${GOOGLE_BASE}/${model}:generateContent?key=${apiKey}`;

  const body = await context.request.text();

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Upstream fetch failed', 502);
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
