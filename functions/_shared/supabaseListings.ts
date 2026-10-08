import { pickEnv, type Env } from './supabaseRest';

export interface ListingSitemapRow {
  readonly id: string;
  readonly title: string;
  readonly category_slug: string;
  readonly updated_at: string;
}

export interface CategoryListingRow {
  readonly id: string;
  readonly title: string;
  readonly price: string;
  readonly currency: string;
  readonly city: string;
  readonly category_slug: string;
  readonly images: string[] | null;
}

export async function fetchActiveListingsByMarket(
  market: string,
  env: Env,
  limit = 10000
): Promise<ListingSitemapRow[]> {
  const cfg = pickEnv(env);
  if (!cfg) return [];

  const q =
    `country_code=eq.${market.toUpperCase()}` +
    `&status=eq.active` +
    `&select=id,title,category_slug,updated_at` +
    `&order=updated_at.desc` +
    `&limit=${limit}`;

  try {
    const res = await fetch(`${cfg.url}/rest/v1/listings?${q}`, {
      headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as ListingSitemapRow[];
  } catch {
    return [];
  }
}

export async function fetchListingsByMarketCategory(
  market: string,
  category: string,
  env: Env,
  limit = 50
): Promise<CategoryListingRow[]> {
  const cfg = pickEnv(env);
  if (!cfg) return [];
  const q =
    `country_code=eq.${market.toUpperCase()}` +
    `&category_slug=eq.${encodeURIComponent(category)}` +
    `&status=eq.active` +
    `&select=id,title,price,currency,city,category_slug,images` +
    `&order=updated_at.desc` +
    `&limit=${limit}`;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/listings?${q}`, {
      headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as CategoryListingRow[];
  } catch {
    return [];
  }
}

