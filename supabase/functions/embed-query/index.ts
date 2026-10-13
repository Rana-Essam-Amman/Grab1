import { createClient } from "npm:@supabase/supabase-js@2";
import {
  MODEL,
  parseVector,
  vectorLiteral,
  createEmbedding,
} from "./embed-query.helpers.ts";

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
