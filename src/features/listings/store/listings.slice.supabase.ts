import type { Listing } from '@/types';
import { fetchListings, createListing, searchListings } from '../services/listingsService';
import { uploadListingImages, removeListingImages } from '../services/storageService';
import { sanitizeListingData } from './listings.slice.helpers';
import { supabase } from '@/shared/lib/supabase';

export interface SupabasePublishResult {
  readonly remoteListing: Listing | null;
  readonly error: string | null;
  readonly fallbackToLocal?: boolean;
}

export async function performSupabasePublish(
  listing: Listing,
  activeCountry: string,
  isArabic: boolean
): Promise<SupabasePublishResult> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { remoteListing: null, error: null, fallbackToLocal: true };
    }
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('country_code')
      .eq('id', userData.user.id)
      .maybeSingle();
    const publishCountry =
      (profileRow?.country_code as string | undefined) || activeCountry;
    const sanitized = sanitizeListingData(listing, publishCountry, isArabic);
    const hadPhotos = sanitized.images.length > 0;
    const { urls: uploadedImages, failedCount } = await uploadListingImages(
      sanitized.images,
      userData.user.id
    );
    if (hadPhotos && uploadedImages.length === 0) {
      return { remoteListing: null, error: 'فشل رفع الصور — جرب مرة ثانية' };
    }
    if (failedCount > 0) {
      console.warn(`[publish] ${failedCount} image(s) failed to upload`);
    }
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
      images: uploadedImages,
      attributes: sanitized.attributes,
      sellerName: sanitized.sellerName,
      sellerPhone: sanitized.sellerPhone,
    });
    if (error || !data) {
      if (uploadedImages.length > 0) {
        await removeListingImages(uploadedImages);
      }
      return { remoteListing: null, error: error || 'فشل النشر' };
    }
    return { remoteListing: data, error: null };
  } catch (err) {
    return { remoteListing: null, error: err instanceof Error ? err.message : 'خطأ غير معروف' };
  }
}

export interface SupabaseSyncResult {
  readonly listings: Listing[] | null;
  readonly error: string | null;
}

export interface SupabaseSyncParams {
  readonly market?: string;
  readonly offset?: number;
  readonly limit?: number;
}

export async function performSupabaseSync(params: SupabaseSyncParams = {}): Promise<SupabaseSyncResult> {
  const { data, error } = await fetchListings(params);
  if (error || !data) return { listings: null, error: error || 'fetch failed' };
  return { listings: data, error: null };
}

export interface SupabaseSearchParams {
  readonly query: string;
  readonly market?: string;
  readonly offset?: number;
  readonly limit?: number;
}

export async function performSupabaseSearch(
  params: SupabaseSearchParams
): Promise<SupabaseSyncResult> {
  const { data, error } = await searchListings(params);
  if (error || !data) return { listings: null, error: error || 'search failed' };
  return { listings: data, error: null };
}
