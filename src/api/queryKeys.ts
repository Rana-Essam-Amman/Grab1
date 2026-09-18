export const listingKeys = {
  all: ['listings'] as const,
  byMarket: (market: string) => [...listingKeys.all, { market }] as const,
  detail: (id: string) => [...listingKeys.all, 'detail', id] as const,
  wishlist: (market: string) => ['wishlist', { market }] as const,
};
