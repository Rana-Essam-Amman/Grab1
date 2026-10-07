export interface Env {
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

export interface ListingRow {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly currency: string;
  readonly country_code: string;
  readonly city: string;
  readonly category_slug: string;
  readonly images: string[] | null;
  readonly status: string;
  readonly seller_name: string | null;
  readonly created_at: string;
  readonly attributes: unknown;
}

export function pickEnv(env: Env): { url: string; key: string } | null {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function fetchListingById(
  id: string,
  env: Env
): Promise<ListingRow | null> {
  const cfg = pickEnv(env);
  if (!cfg) return null;

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/listings?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
      {
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as ListingRow[];
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}
