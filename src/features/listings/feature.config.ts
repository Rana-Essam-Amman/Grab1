import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'listings',
  screens: {
    'listing-detail': {
      name: 'listing-detail',
      component: () => import('./screens/ListingDetailScreen').then((m) => ({ default: m.ListingDetailScreen })),
      guard: 'public',
    },
    'seller-profile': {
      name: 'seller-profile',
      component: () => import('./screens/SellerProfileScreen').then((m) => ({ default: m.SellerProfileScreen })),
      guard: 'public',
    },
    'search-results': {
      name: 'search-results',
      component: () => import('./screens/SearchResultsScreen').then((m) => ({ default: m.SearchResultsScreen })),
      guard: 'public',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
