import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'explore',
  screens: {
    'explore': {
      name: 'explore',
      component: () => import('./screens/ExploreScreen').then((m) => ({ default: m.ExploreScreen })),
      guard: 'public',
      tab: 'explore',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
