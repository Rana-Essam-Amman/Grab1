import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { removeListingImages } from './storageService';

export interface SupabaseListingRow {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly currency: string;
  readonly country_code: string;
  readonly city: string;
  readonly neighborhood: string | null;
  readonly category_slug: string;
  readonly subcategory_slug: string | null;
  readonly images: string[];
  readonly attributes: unknown;
  readonly status: string;
  readonly views: number;
  readonly seller_name: string | null;
  readonly seller_phone: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly bumps_today?: number | null;
  readonly bumps_reset_date?: string | null;
}

function rowToListing(row: SupabaseListingRow): Listing {
  const attrs = Array.isArray(row.attributes) ? (row.attributes as Array<{ key?: string; label: string; value: string }>) : [];
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency as Listing['currency'],
    countryCode: row.country_code as Listing['countryCode'],
    city: row.city,
    neighborhood: row.neighborhood || '',
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug || '',
    imageUrl: row.images?.[0] || '',
    images: row.images || [],
    sellerPhone: row.seller_phone || '',
    sellerName: row.seller_name || '',
    createdAt: row.created_at.split('T')[0],
    views: row.views,
    status: row.status as Listing['status'],
    bumpsToday: row.bumps_today ?? 0,
    bumpsResetDate: row.bumps_reset_date ?? undefined,
    attributes: attrs as Listing['attributes'],
  };
}

export async function fetchListings(): Promise<{ data: Listing[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
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

export async function createListing(
  input: CreateListingInput
): Promise<{ data: Listing | null; error: string | null }> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('listings')
      .insert({
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
        attributes: input.attributes || [],
        seller_name: input.sellerName || null,
        seller_phone: input.sellerPhone || null,
      })
      .select('*')
      .single();

    if (error) return { data: null, error: error.message };
    return { data: rowToListing(data as SupabaseListingRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteListing(id: string): Promise<{ error: string | null }> {
  try {
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('images')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) return { error: fetchError.message };

    const images = Array.isArray(listing?.images) ? (listing.images as string[]) : [];
    if (images.length > 0) {
      await removeListingImages(images);
    }

    const { error } = await supabase.from('listings').delete().eq('id', id);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updateListingStatus(
  id: string,
  status: 'active' | 'sold' | 'archived'
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id);

    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Increment the server-side daily bump counter for a listing.
 * Server validates ownership via auth.uid(). Returns the new count,
 * or null if the RPC failed (unauthenticated, not owned, network).
 */
export async function bumpListing(listingId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('bump_listing', { p_listing_id: listingId });
    if (error) return null;
    return typeof data === 'number' ? data : null;
  } catch {
    return null;
  }
}
