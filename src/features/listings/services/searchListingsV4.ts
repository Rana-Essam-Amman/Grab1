import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';

export const RELATED_EMPTY_LABEL = 'ما في نتائج مطابقة تمامًا';
export const RELATED_HEADER_LABEL = 'نتائج قريبة قد تهمك';

interface SearchV4TieredV2Row {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  country_code: string;
  city: string;
  neighborhood: string | null;
  category_slug: string;
  subcategory_slug: string | null;
  images: string[];
  attributes: unknown;
  status: string;
  views: number;
  seller_name: string | null;
  seller_phone: string | null;
  created_at: string;
  updated_at: string;
  is_demo: boolean;
  match_kind: string | null;
  matched_tokens: string[] | null;
  total_matched_tokens: number;
  tier: 1 | 2;
  tier_reason: string;
  rank_in_tier: number;
}

export interface SearchV4Result {
  readonly data: Listing[];
  readonly tier1Data: Listing[];
  readonly tier2Data: Listing[];
  readonly error: string | null;
  readonly matchKind: 'exact' | 'related' | 'none';
  readonly banner: string | null;
  readonly relatedHeader: string | null;
}

export async function searchListingsV4(
  trimmed: string,
  market: string | null | undefined,
  limit: number,
  offset: number,
  filterArgs: Record<string, unknown>,
): Promise<SearchV4Result | null> {
  const { data, error } = await supabase.rpc('search_listings_v4_tiered_v2', {
    p_query: trimmed,
    p_market: market ?? null,
    p_limit: limit,
    p_offset: offset,
    ...filterArgs,
  });

  if (error) return null;

  const rows = (data || []) as SearchV4TieredV2Row[];

  const tier1Rows = rows
    .filter((row) => row.tier === 1)
    .sort((a, b) => a.rank_in_tier - b.rank_in_tier);
  const tier2Rows = rows
    .filter((row) => row.tier === 2)
    .sort((a, b) => a.rank_in_tier - b.rank_in_tier)
    .slice(0, 5);

  const tier1Data = tier1Rows.map((row) => rowToListing(row as never));
  const tier2Data = tier2Rows.map((row) => rowToListing(row as never));

  const matchKind: SearchV4Result['matchKind'] =
    tier1Data.length > 0 ? 'exact' : tier2Data.length > 0 ? 'related' : 'none';

  return {
    data: tier1Data,
    tier1Data,
    tier2Data,
    error: null,
    matchKind,
    banner: null,
    relatedHeader: null,
  };
}
