export interface BuildListingParams {
  postDraft: any;
  user: any;
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

  const newListing = {
    id: 'listing-' + Date.now(),
    title,
    description,
    price,
    currency: activeCurrency,
    countryCode: targetMarket,
    city: postDraft.city || '',
    neighborhood: postDraft.neighborhood || '',
    categorySlug: postDraft.categorySlug,
    subcategorySlug: postDraft.subcategorySlug,
    imageUrl: postDraft.photos?.[0] || '',
    images: postDraft.photos || [],
    sellerPhone: user?.phone || '',
    sellerName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Seller',
    createdAt: new Date().toISOString().split('T')[0],
    views: 1,
    attributes: [
      { label: 'Category', value: postDraft.categorySlug },
      { label: 'City', value: postDraft.city || '' },
    ],
  };

  return { title, price, description, targetMarket, newListing };
}
