import type { Listing } from '@/types';
import { supabase } from '@/shared/lib/supabase';
import { removeListingImages } from './storageService';
import { rowToListing, type SupabaseListingRow } from './listingsMapper';

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
