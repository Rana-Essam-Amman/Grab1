
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
const PAGE_SIZE = 500;
const DELETE_BATCH_SIZE = 100;

async function listAllUserObjects(
  adminClient: ReturnType<typeof createClient>,
  bucket: string,
  userId: string,
): Promise<string[]> {
  const paths: string[] = [];
  const queue: string[] = [userId];

  while (queue.length > 0) {
    const prefix = queue.shift()!;
    let offset = 0;

    while (true) {
      const { data, error } = await adminClient.storage
        .from(bucket)
        .list(prefix, {
          limit: 100,
          offset,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        throw new Error(`Storage listing failed for ${bucket}`);
      }

      if (!data || data.length === 0) break;

      for (const item of data) {
        const fullPath = `${prefix}/${item.name}`;

        if (item.id === null || item.metadata === null) {
          queue.push(fullPath);
        } else if (fullPath.startsWith(`${userId}/`)) {
          paths.push(fullPath);
        }
      }

      if (data.length < 100) break;
      offset += 100;
    }
  }

  return paths;
}

async function deleteUserStorage(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<void> {
  for (const bucket of BUCKETS) {
    const paths = await listAllUserObjects(adminClient, bucket, userId);

    for (let i = 0; i < paths.length; i += DELETE_BATCH_SIZE) {
      const batch = paths.slice(i, i + DELETE_BATCH_SIZE);
      const { error } = await adminClient.storage.from(bucket).remove(batch);

      if (error) {
        throw new Error(`Storage deletion failed for ${bucket}`);
      }
    }
  }
}

async function deleteUserResidualRecords(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<void> {
  // These production tables do not have effective auth.users
  // cascading foreign keys. Delete their user-owned rows explicitly.

  const { error: commentsError } = await adminClient
    .from("post_comments")
    .delete()
    .eq("user_id", userId);

  if (commentsError) {
    throw new Error("User comments cleanup failed");
  }

  const { error: likesError } = await adminClient
    .from("post_likes")
    .delete()
    .eq("user_id", userId);

  if (likesError) {
    throw new Error("User likes cleanup failed");
  }

  // Remove comments and likes attached to listings being deleted.
  // Pagination avoids relying on the PostgREST default row limit.
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await adminClient
      .from("listings")
      .select("id")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error("Owned listings lookup failed");
    }

    const listingIds = (data ?? []).map((listing) => listing.id);

    for (let i = 0; i < listingIds.length; i += DELETE_BATCH_SIZE) {
      const batch = listingIds.slice(i, i + DELETE_BATCH_SIZE);

      const { error: listingCommentsError } = await adminClient
        .from("post_comments")
        .delete()
        .in("listing_id", batch);

      if (listingCommentsError) {
        throw new Error("Listing comments cleanup failed");
      }

      const { error: listingLikesError } = await adminClient
        .from("post_likes")
        .delete()
        .in("listing_id", batch);

      if (listingLikesError) {
        throw new Error("Listing likes cleanup failed");
      }
    }

    if (listingIds.length < PAGE_SIZE) break;
  }

  // error_logs has no effective FK in the inspected production schema.
  const { error: logsError } = await adminClient
    .from("error_logs")
    .delete()
    .eq("user_id", userId);

  if (logsError) {
    throw new Error("User error-log cleanup failed");
  }

  // Remove stored orphan-path records belonging to this user's folders.
  const { error: orphanError } = await adminClient
    .from("storage_orphans")
    .delete()
    .like("path", `${userId}/%`);

  if (orphanError) {
    throw new Error("Storage orphan metadata cleanup failed");
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return jsonResponse({ error: "Missing or invalid Authorization header" }, 401);
  }

  const accessToken = authHeader.slice(7).trim();

  if (!accessToken) {
    return jsonResponse({ error: "Malformed token" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    console.error("Missing required environment variables");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });

  const { data: userData, error: userError } =
    await userClient.auth.getUser(accessToken);

  if (userError || !userData.user) {
    return jsonResponse({ error: "Invalid or expired token" }, 401);
  }

  const verifiedUserId = userData.user.id;

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 1. Remove all user-owned Storage objects.
    await deleteUserStorage(adminClient, verifiedUserId);

    // 2. Remove user records not covered by database cascades.
    await deleteUserResidualRecords(adminClient, verifiedUserId);

    // 3. Permanently delete the Auth user.
    // Database foreign keys with ON DELETE CASCADE handle
    // the remaining linked records.
    const { error: deleteError } =
      await adminClient.auth.admin.deleteUser(verifiedUserId, false);

    if (deleteError) {
      console.error("Auth deletion failed after cleanup");
      return jsonResponse({
        error: "Account deletion could not be completed. Contact support.",
      }, 500);
    }

    return jsonResponse({ success: true });
  } catch {
    console.error("Account deletion aborted before Auth deletion");

    return jsonResponse({
      error: "Account cleanup failed. The account has not been deleted.",
    }, 500);
  }
});
