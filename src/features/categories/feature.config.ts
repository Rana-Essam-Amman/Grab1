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
    'handymen-landing': {
      name: 'handymen-landing',
      component: () => import('./screens/HandymenLandingScreen').then((m) => ({ default: m.HandymenLandingScreen })),
      guard: 'public',
    },
    'real-estate-landing': {
      name: 'real-estate-landing',
      component: () => import('./screens/RealEstateLandingScreen').then((m) => ({ default: m.RealEstateLandingScreen })),
      guard: 'public',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
