interface GeminiEnv {
  readonly GEMINI_API_KEY?: string;
  readonly GROQ_API_KEY?: string;
}

interface GeminiContext {
  readonly request: Request;
  readonly env: GeminiEnv;
}

const GOOGLE_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';

export async function onRequestPost(context: GeminiContext): Promise<Response> {
  const geminiKey = (context.env as { GEMINI_API_KEY?: string }).GEMINI_API_KEY;
  if (!geminiKey) {
    return jsonError('Server key not configured', 500);
  }

  const url = new URL(context.request.url);
  const model = url.searchParams.get('model') || 'gemini-flash-latest';
  const target = `${GOOGLE_BASE}/${model}:generateContent?key=${geminiKey}`;

  const bodyText = await context.request.text();

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upstream fetch failed';
    return jsonError(`Upstream fetch failed: ${msg}`, 502);
  }

  // Gemini succeeded (or non-429 error) → return as-is.
  if (upstream.status !== 429) {
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Gemini quota exhausted (429) → try Groq fallback.
  const groqKey = (context.env as { GROQ_API_KEY?: string }).GROQ_API_KEY;
  if (!groqKey) {
    const text = await upstream.text();
    return new Response(text, {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const groqResult = await callGroq(bodyText, groqKey);
    return new Response(JSON.stringify(groqResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Groq fallback failed';
    return jsonError(`Both providers failed. Gemini: 429, Groq: ${msg}`, 502);
  }
}

/**
 * Translate Gemini-format request → OpenAI-compatible Groq request.
 * Translate Groq response → Gemini-format response so the client sees the
 * exact same shape it expects from Gemini.
 */
async function callGroq(geminiBody: string, apiKey: string): Promise<unknown> {
  const parsed = JSON.parse(geminiBody) as {
    systemInstruction?: { parts?: Array<{ text?: string }> };
    contents?: Array<{ role?: string; parts?: Array<{ text?: string }> }>;
    generationConfig?: {
      temperature?: number;
      maxOutputTokens?: number;
    };
  };

  const systemText = parsed.systemInstruction?.parts?.[0]?.text || '';
  const userText = parsed.contents?.[0]?.parts?.[0]?.text || '';

  const groqPayload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemText },
      { role: 'user', content: userText },
    ],
    response_format: { type: 'json_object' },
    temperature: parsed.generationConfig?.temperature ?? 0.6,
    max_tokens: parsed.generationConfig?.maxOutputTokens ?? 2048,
  };

  const res = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(groqPayload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content || '';

  // Same shape as Gemini response — client reads candidates[0].content.parts[0].text.
  return {
    candidates: [
      {
        content: {
          parts: [{ text: content }],
        },
      },
    ],
  };
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
