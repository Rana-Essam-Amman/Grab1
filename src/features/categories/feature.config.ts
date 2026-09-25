import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'categories',
  screens: {
    'categories': {
      name: 'categories',
      component: () => import('./screens/CategoriesScreen').then((m) => ({ default: m.CategoriesScreen })),
      guard: 'public',
      tab: 'categories',
    },
    'sub-categories': {
      name: 'sub-categories',
      component: () => import('./screens/SubCategoriesScreen').then((m) => ({ default: m.SubCategoriesScreen })),
      guard: 'public',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
