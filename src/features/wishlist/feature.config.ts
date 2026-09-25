import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'wishlist',
  screens: {
    'wishlist': {
      name: 'wishlist',
      component: () => import('./screens/WishlistScreen').then((m) => ({ default: m.WishlistScreen })),
      guard: 'authenticated',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
  menuEntry: {
    icon: 'Heart',
    label: { ar: 'المفضلة', en: 'Wishlist' },
    order: 3,
    onClick: 'navigate',
    target: 'wishlist',
  },
});
