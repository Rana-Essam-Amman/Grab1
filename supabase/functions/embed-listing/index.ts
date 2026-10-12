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

type ListingRow = {
  id: string;
  title: string;
  description: string;
  attributes: Record<string, unknown> | null;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, " ").trim();
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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
  text: string,
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
      input: [text],
      dimensions: DIMENSIONS,
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

function retryDelaySeconds(attempts: number): number {
  return Math.min(3600, 30 * 2 ** Math.min(attempts, 7));
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

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let listingId = "";

  try {
    const body = await request.json();
    listingId = typeof body?.listing_id === "string"
      ? body.listing_id.trim()
      : "";

    if (!listingId) {
      return jsonResponse({ error: "listing_id is required" }, 400);
    }

    const { data: listing, error: listingError } = await admin
      .from("listings")
      .select("id,title,description,attributes")
      .eq("id", listingId)
      .maybeSingle();

    if (listingError) throw listingError;

    if (!listing) {
      await admin
        .from("search_embedding_jobs")
        .update({
          status: "done",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_error: "Listing no longer exists; nothing to embed",
        })
        .eq("listing_id", listingId)
        .in("status", ["pending", "processing"]);

      return jsonResponse({
        ok: true,
        skipped: true,
        reason: "listing_not_found",
      });
    }

    const row = listing as ListingRow;
    const attributesText = JSON.stringify(row.attributes ?? {});
    const normalizedText = normalizeText(
      `${row.title ?? ""} ${row.description ?? ""} ${attributesText}`,
    );

    if (!normalizedText) {
      throw new Error("Listing has no searchable text");
    }

    const sourceHash = await sha256Hex(normalizedText);

    const { data: existing, error: existingError } = await admin
      .from("listing_search_embeddings")
      .select("source_hash,model_name")
      .eq("listing_id", listingId)
      .maybeSingle();

    if (existingError) throw existingError;

    if (
      existing?.source_hash === sourceHash &&
      existing?.model_name === MODEL
    ) {
      await admin
        .from("search_embedding_jobs")
        .update({
          status: "done",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("listing_id", listingId)
        .in("status", ["pending", "processing"]);

      return jsonResponse({
        ok: true,
        skipped: true,
        reason: "source_unchanged",
      });
    }

    const embedding = await createEmbedding(normalizedText, jinaApiKey);

    const { error: upsertError } = await admin
      .from("listing_search_embeddings")
      .upsert({
        listing_id: listingId,
        model_name: MODEL,
        source_hash: sourceHash,
        embedding: vectorLiteral(embedding),
        updated_at: new Date().toISOString(),
      }, { onConflict: "listing_id" });

    if (upsertError) throw upsertError;

    const { data: updated, error: jobError } = await admin
      .from("search_embedding_jobs")
      .update({
        status: "done",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("listing_id", listingId)
      .in("status", ["pending", "processing"])
      .select("job_key");

    if (jobError) throw jobError;

    return jsonResponse({
      ok: true,
      listing_id: listingId,
      model: MODEL,
      dimensions: embedding.length,
      jobs_updated: updated?.length ?? 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (listingId) {
      const { data: jobs } = await admin
        .from("search_embedding_jobs")
        .select("job_key,attempts")
        .eq("listing_id", listingId)
        .in("status", ["pending", "processing"]);

      for (const job of jobs ?? []) {
        const attempts = Number(job.attempts ?? 0) + 1;
        await admin
          .from("search_embedding_jobs")
          .update({
            status: "pending",
            attempts,
            next_attempt_at: new Date(
              Date.now() + retryDelaySeconds(attempts) * 1000,
            ).toISOString(),
            updated_at: new Date().toISOString(),
            last_error: message.slice(0, 1000),
            request_id: null,
            dispatched_at: null,
          })
          .eq("job_key", job.job_key);
      }
    }

    return jsonResponse({
      error: "Embedding failed",
      details: message,
    }, 500);
  }
});
