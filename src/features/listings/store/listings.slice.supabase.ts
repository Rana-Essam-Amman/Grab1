import type { Listing } from '@/types';
import { fetchListings, createListing } from '../services/listingsService';
import { uploadListingImages } from '../services/storageService';
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
      // No Supabase session (demo mode, E2E, offline) → local-only fallback.
      // Real visitors are blocked at the UI level BEFORE reaching this function.
      return { remoteListing: null, error: null, fallbackToLocal: true };
    }

    const sanitized = sanitizeListingData(listing, activeCountry, isArabic);

    // If user picked photos but none uploaded → block publish.
    const hadPhotos = sanitized.images.length > 0;
    const { urls: uploadedImages, failedCount } = await uploadListingImages(
      sanitized.images,
      userData.user.id
    );
    if (hadPhotos && uploadedImages.length === 0) {
      return { remoteListing: null, error: 'فشل رفع الصور — جرب مرة ثانية' };
    }
    if (failedCount > 0) {
      // Partial failure — publish with what we have, log silently.
      // eslint-disable-next-line no-console
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
