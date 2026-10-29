import type { PostDraft, Listing, UserProfile } from '@/types';
import { isOtherValue } from '@/data/locations';
import { normalizeValueToSlug } from '@/shared/lib/attrsTranslation';

export interface BuildListingParams {
  isAdmin: boolean;
  postDraft: PostDraft;
  user: UserProfile | null;
  browseCountryCode: string;
  activeCurrency: string;
}

export function buildNewListingPayload({
  postDraft,
  isAdmin,
  user,
  browseCountryCode,
  activeCurrency,
}: BuildListingParams) {
  const title = postDraft.title || postDraft.generated?.title || '';
  const price = postDraft.price || postDraft.generated?.price || '';
  const description = postDraft.description || postDraft.generated?.description || '';
  const targetMarket = isAdmin ? browseCountryCode : (user?.countryCode || browseCountryCode);

  const rawCity = (postDraft.city || '').trim();
  const rawNeighborhood = (postDraft.neighborhood || '').trim();
  if (!rawCity || !rawNeighborhood || isOtherValue(rawCity) || isOtherValue(rawNeighborhood)) {
    throw new Error(
      'buildNewListingPayload: city and neighborhood are required and must not be "Other"'
    );
  }
  if (!postDraft.citySlug) {
    throw new Error('Location slug missing: cannot publish listing without a valid city');
  }
  if (!postDraft.districtSlug && !postDraft.neighborhoodSlug) {
    throw new Error('Location slug missing: cannot publish listing without a valid area');
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
    citySlug: postDraft.citySlug,
    districtSlug: postDraft.districtSlug,
    neighborhoodSlug: postDraft.neighborhoodSlug,
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
        .map((f) => ({
          key: f.key,
          label: f.label,
          value: normalizeValueToSlug(
            f.key,
            String(f.value),
            postDraft.categorySlug,
            postDraft.subcategorySlug,
          ),
        })),
    ],
  };

  return { title, price, description, targetMarket, newListing };
}
