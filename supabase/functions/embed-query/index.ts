import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "jina-embeddings-v3";
const DIMENSIONS = 384;
const JINA_URL = "https://api.jina.ai/v1/embeddings";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseVector(value: unknown): number[] | null {
  let parsed: unknown = value;

  if (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;

    try {
      parsed = trimmed.slice(1, -1).split(",").map(Number);
    } catch {
      return null;
    }
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length !== DIMENSIONS ||
    parsed.some((item) =>
      typeof item !== "number" || !Number.isFinite(item)
    )
  ) {
    return null;
  }

  return parsed as number[];
}

function vectorLiteral(values: number[]): string {
  if (
    values.length !== DIMENSIONS ||
    values.some((value) => !Number.isFinite(value))
  ) {
    throw new Error(`Expected ${DIMENSIONS} finite embedding values`);
  }

  return `[${values.join(",")}]`;
}

async function createEmbedding(
  query: string,
  apiKey: string,
): Promise<number[]> {
  const response = await fetch(JINA_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: [query],
      dimensions: DIMENSIONS,
      task: "retrieval.query",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Jina embedding request failed (${response.status}): ${details.slice(0, 500)}`,
    );
  }

  const payload = await response.json();
  const embedding = payload?.data?.[0]?.embedding;

  if (
    !Array.isArray(embedding) ||
    embedding.length !== DIMENSIONS ||
    embedding.some((value: unknown) =>
      typeof value !== "number" || !Number.isFinite(value)
    )
  ) {
    throw new Error("Jina returned an invalid 384-dimensional embedding");
  }

  return embedding as number[];
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const jinaApiKey = Deno.env.get("JINA_API_KEY");

  if (!supabaseUrl || !serviceRoleKey || !jinaApiKey) {
    return jsonResponse({ error: "Required server configuration is missing" }, 500);
  }

  let body: { query?: unknown };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON" }, 400);
  }

  if (typeof body.query !== "string") {
    return jsonResponse({ error: "query must be a string" }, 400);
  }

  if (body.query.length > 2000) {
    return jsonResponse({ error: "query is too long" }, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: normalizedQuery, error: normalizeError } = await admin
    .rpc("normalize_search_query", { p_query: body.query });

  if (normalizeError) {
    return jsonResponse(
      { error: "query normalization failed", details: normalizeError.message },
      500,
    );
  }

  if (typeof normalizedQuery !== "string" || !normalizedQuery) {
    return jsonResponse({ error: "query must not be empty" }, 400);
  }

  try {
    const { data: cached, error: cacheError } = await admin
      .from("search_query_embeddings")
      .select("embedding,model_name")
      .eq("normalized_query", normalizedQuery)
      .maybeSingle();

    if (cacheError) throw cacheError;

    if (cached?.model_name === MODEL) {
      const cachedEmbedding = parseVector(cached.embedding);
      if (cachedEmbedding) {
        return jsonResponse({ embedding: cachedEmbedding });
      }
    }

    const embedding = await createEmbedding(normalizedQuery, jinaApiKey);

    const { error: upsertError } = await admin
      .from("search_query_embeddings")
      .upsert({
        normalized_query: normalizedQuery,
        model_name: MODEL,
        embedding: vectorLiteral(embedding),
        updated_at: new Date().toISOString(),
      }, { onConflict: "normalized_query" });

    if (upsertError) throw upsertError;

    return jsonResponse({ embedding });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({
      error: "Query embedding failed",
      details: message,
    }, 500);
  }
});
