
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

    // If user picked photos but none uploaded → block publish.
    const hadPhotos = sanitized.images.length > 0;
    const { urls: uploadedImages, failedCount, lastError } = await uploadListingImages(
      sanitized.images,
      userData.user.id
    );

    if (hadPhotos && uploadedImages.length === 0) {
      return { remoteListing: null, error: 'فشل رفع الصور — جرب مرة تانية' };
    }

    if (failedCount > 0) {
      console.warn(`[publish] ${failedCount} image(s) failed to upload. Last error: ${lastError}`);
    }

    const { data, error } = await createListing({
      title: sanitized.title,
      description: sanitized.description,
      price: sanitized.price,
      currency: sanitized.currency,
      countryCode: sanitized.countryCode,
      city: sanitized.city,
      neighborhood: sanitized.neighborhood,
      neighborhoodName: sanitized.neighborhoodName,
      citySlug: sanitized.citySlug,
      districtSlug: sanitized.districtSlug,
      neighborhoodSlug: sanitized.neighborhoodSlug,
      categorySlug: sanitized.categorySlug,
      subcategorySlug: sanitized.subcategorySlug,
      images: uploadedImages,
      attributes: sanitized.attributes,
      sellerName: sanitized.sellerName,
      sellerPhone: sanitized.sellerPhone,
    });

    if (error || !data) {
      // Roll back uploaded images — the listing was never persisted.
      if (uploadedImages.length > 0) {
        await removeListingImages(uploadedImages);
      }
      return { remoteListing: null, error: error || 'فشل النشر' };
    }

    return { remoteListing: data, error: null };
  } catch (err) {
    return {
      remoteListing: null,
      error: err instanceof Error ? err.message : 'خطأ غير معروف',
    };
  }
}
