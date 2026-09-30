import type { Listing } from '@/types';
import { fetchListings, createListing } from '../services/listingsService';
import { sanitizeListingData } from './listings.slice.helpers';

export interface SupabasePublishResult {
  readonly remoteListing: Listing | null;
  readonly error: string | null;
}

export async function performSupabasePublish(
  listing: Listing,
  activeCountry: string,
  isArabic: boolean
): Promise<SupabasePublishResult> {
  try {
    const sanitized = sanitizeListingData(listing, activeCountry, isArabic);
    const { data, error } = await createListing({
      title: sanitized.title,
      description: sanitized.description,
      price: sanitized.price,
      currency: sanitized.currency,
      countryCode: sanitized.countryCode,
      city: sanitized.city,
      neighborhood: sanitized.neighborhood,
      categorySlug: sanitized.categorySlug,
      subcategorySlug: sanitized.subcategorySlug,
      images: sanitized.images,
      attributes: sanitized.attributes,
      sellerName: sanitized.sellerName,
      sellerPhone: sanitized.sellerPhone,
    });
    if (error || !data) return { remoteListing: null, error: error || 'فشل النشر' };
    return { remoteListing: data, error: null };
  } catch (err) {
    return { remoteListing: null, error: err instanceof Error ? err.message : 'خطأ غير معروف' };
  }
}

export interface SupabaseSyncResult {
  readonly listings: Listing[] | null;
  readonly error: string | null;
}

export async function performSupabaseSync(): Promise<SupabaseSyncResult> {
  const { data, error } = await fetchListings();
  if (error || !data) return { listings: null, error: error || 'fetch failed' };
  return { listings: data, error: null };
}
