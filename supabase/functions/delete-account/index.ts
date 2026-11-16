import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const BUCKETS = ["listing-images", "avatars"] as const;

async function listAllUserObjects(adminClient: ReturnType<typeof createClient>, bucket: string, userId: string): Promise<string[]> {
  const paths: string[] = [];
  const queue: string[] = [userId];
  while (queue.length > 0) {
    const prefix = queue.shift()!;
    let offset = 0;
    const limit = 100;
    while (true) {
      const { data, error } = await adminClient.storage.from(bucket).list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });
      if (error) throw new Error(`Storage list failed for ${bucket}/${prefix}: ${error.message}`);
      if (!data || data.length === 0) break;
      for (const item of data) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.id === null || item.metadata === null) {
          queue.push(fullPath);
        } else if (fullPath.startsWith(`${userId}/`) || fullPath === userId) {
          paths.push(fullPath);
        }
      }
      if (data.length < limit) break;
      offset += limit;
    }
  }
  return paths;
}

async function deleteUserStorage(adminClient: ReturnType<typeof createClient>, userId: string): Promise<void> {
  for (const bucket of BUCKETS) {
    const paths = await listAllUserObjects(adminClient, bucket, userId);
    if (paths.length === 0) continue;
    for (let i = 0; i < paths.length; i += 100) {
      const batch = paths.slice(i, i + 100);
      const { error } = await adminClient.storage.from(bucket).remove(batch);
      if (error) throw new Error(`Storage delete failed for ${bucket}: ${error.message}`);
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return jsonResponse({ error: "Missing or invalid Authorization header" }, 401);
  const accessToken = authHeader.slice(7).trim();
  if (!accessToken) return jsonResponse({ error: "Malformed token" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    console.error("Missing required environment variables");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${accessToken}` } } });
  const { data: userData, error: userError } = await userClient.auth.getUser(accessToken);
  if (userError || !userData.user) return jsonResponse({ error: "Invalid or expired token" }, 401);
  const verifiedUserId = userData.user.id;

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  try {
    await deleteUserStorage(adminClient, verifiedUserId);
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(verifiedUserId, false);
    if (deleteError) {
      console.error("Auth deletion failed after storage cleanup", { userId: verifiedUserId });
      return jsonResponse({ error: "Account deletion failed after storage cleanup. Please retry." }, 500);
    }
    return jsonResponse({ success: true });
  } catch {
    console.error("Account deletion aborted", { userId: verifiedUserId });
    return jsonResponse({ error: "Failed to clean up user data. Account preserved. Please retry." }, 500);
  }
});
