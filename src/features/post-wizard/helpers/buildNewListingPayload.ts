import type { PostDraft, Listing, UserProfile } from '@/types';
import { isOtherValue } from '@/data/locations';

export interface BuildListingParams {
  postDraft: PostDraft;
  user: UserProfile | null;
  browseCountryCode: string;
  activeCurrency: string;
}

export function buildNewListingPayload({
  postDraft,
  user,
  browseCountryCode,
  activeCurrency,
}: BuildListingParams) {
  const title = postDraft.title || postDraft.generated?.title || '';
  const price = postDraft.price || postDraft.generated?.price || '';
  const description = postDraft.description || postDraft.generated?.description || '';
  const targetMarket = user?.countryCode || browseCountryCode;

  const rawCity = (postDraft.city || '').trim();
  const rawNeighborhood = (postDraft.neighborhood || '').trim();
  if (!rawCity || !rawNeighborhood || isOtherValue(rawCity) || isOtherValue(rawNeighborhood)) {
    throw new Error(
      'buildNewListingPayload: city and neighborhood are required and must not be "Other"'
    );
  }

  const newListing: Listing = {
    id: `listing-${crypto.randomUUID()}`,
    title,
    description,
    price,
    currency: activeCurrency as Listing['currency'],
    countryCode: targetMarket as Listing['countryCode'],
    city: rawCity,
    neighborhood: rawNeighborhood,
    categorySlug: postDraft.categorySlug,
    subcategorySlug: postDraft.subcategorySlug,
    imageUrl: postDraft.photos?.[0] || '',
    images: postDraft.photos || [],
    sellerPhone: user?.phone || '',
    sellerName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Seller',
    createdAt: new Date().toISOString().split('T')[0],
    views: 1,
    status: 'active',
    attributes: [
      { key: 'city', label: 'City', value: rawCity },
      ...(postDraft.generated?.fields || [])
        .filter((f) => f.value && String(f.value).trim().length > 0)
        .map((f) => ({ key: f.key, label: f.label, value: String(f.value) })),
    ] as unknown as Listing['attributes'],
  };

  return { title, price, description, targetMarket, newListing };
}
