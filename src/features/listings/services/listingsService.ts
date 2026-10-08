import { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { rowToListing } from './listingsMapper';

export const LISTINGS_PAGE_SIZE = 20;

export interface FetchListingsParams {
  readonly market?: string;
  readonly offset?: number;
  readonly limit?: number;
}

export async function fetchListings(params: FetchListingsParams = {}): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { market, offset = 0, limit = LISTINGS_PAGE_SIZE } = params;
    let q = supabase.from('listings').select('*').eq('status', 'active');
    if (market) q = q.eq('country_code', market);
    const { data, error } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(rowToListing), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export interface CreateListingInput {
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly currency: string;
  readonly countryCode: "JO" | "LB" | "PS" | "SY" | "SA";
  readonly city: string;
  readonly neighborhood?: string;
  readonly categorySlug: string;
  readonly subcategorySlug?: string;
  readonly images: string[];
  readonly attributes?: Array<{ key?: string; label: string; value: string }>;
  readonly sellerName?: string;
  readonly sellerPhone?: string;
}

export async function createListing(input: CreateListingInput): Promise<{ data: Listing | null; error: string | null }> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { data: null, error: 'Unauthorized' };
    const payload = {
      user_id: userData.user.id,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: input.currency,
      country_code: input.countryCode,
      city: input.city,
      neighborhood: input.neighborhood || null,
      category_slug: input.categorySlug,
      subcategory_slug: input.subcategorySlug || null,
      images: input.images,
      attributes: input.attributes || {},
      seller_name: input.sellerName || null,
      seller_phone: input.sellerPhone || null,
      status: 'active',
    };
    const { data, error } = await supabase.from('listings').insert(payload).select().single();
    if (error) return { data: null, error: error.message };
    return { data: rowToListing(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteListing(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updateListingStatus(id: string, status: 'active' | 'sold' | 'archived'): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('listings').update({ status }).eq('id', id);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function bumpListing(listingId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('bump_listing', { p_listing_id: listingId });
    if (error) return null;
    return typeof data === 'number' ? data : null;
  } catch {
    return null;
  }
}

export interface SearchListingsParams {
  readonly query: string;
  readonly market?: string;
  readonly offset?: number;
  readonly limit?: number;
}

export async function searchListings(params: SearchListingsParams): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { query, market, offset = 0, limit = LISTINGS_PAGE_SIZE } = params;
    const trimmed = query.trim();
    if (trimmed.length === 0) return { data: [], error: null };
    const { data, error } = await supabase.rpc('search_listings', {
      p_query: trimmed,
      p_market: market ?? null,
      p_limit: limit,
      p_offset: offset,
    });
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map(rowToListing), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
