import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';

export const RELATED_EMPTY_LABEL = 'ما في نتائج مطابقة تمامًا';
export const RELATED_HEADER_LABEL = 'نتائج قريبة قد تهمك';

export interface SearchV4Result {
  readonly data: Listing[] | null;
  readonly error: string | null;
  readonly matchKind: 'exact' | 'related' | 'none';
  readonly banner: string | null;
  readonly relatedHeader: string | null;
}

interface V4Row {
  readonly match_kind?: string;
}

export async function searchListingsV4(
  trimmed: string,
  market: string | null | undefined,
  limit: number,
  offset: number,
  filterArgs: Record<string, unknown>,
): Promise<SearchV4Result | null> {
  const { data, error } = await supabase.rpc('search_listings_v4_exact', {
    p_query: trimmed,
    p_market: market ?? null,
    p_limit: limit,
    p_offset: offset,
    ...filterArgs,
  });

  if (error) return null;

  const rows = (data || []) as V4Row[];
  const exactRows = rows.filter((row) => row.match_kind === 'exact');
  const relatedRows = rows.filter((row) => row.match_kind === 'related');

  if (exactRows.length > 0) {
    return {
      data: exactRows.map((row) => rowToListing(row as never)),
      error: null,
      matchKind: 'exact',
      banner: null,
      relatedHeader: null,
    };
  }

  if (relatedRows.length > 0) {
    return {
      data: relatedRows.map((row) => rowToListing(row as never)),
      error: null,
      matchKind: 'related',
      banner: RELATED_EMPTY_LABEL,
      relatedHeader: RELATED_HEADER_LABEL,
    };
  }

  return {
    data: [],
    error: null,
    matchKind: 'none',
    banner: null,
    relatedHeader: null,
  };
}
