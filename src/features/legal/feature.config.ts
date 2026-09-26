import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'legal',
  screens: {
    'privacy': {
      name: 'privacy',
      component: () => import('./screens/PrivacyScreen').then((m) => ({ default: m.PrivacyScreen })),
      guard: 'public',
    },
    'support': {
      name: 'support',
      component: () => import('./screens/SupportScreen').then((m) => ({ default: m.SupportScreen })),
      guard: 'public',
    },
    'safety': {
      name: 'safety',
      component: () => import('./screens/SafetyScreen').then((m) => ({ default: m.SafetyScreen })),
      guard: 'public',
    },
    'about': {
      name: 'about',
      component: () => import('./screens/AboutScreen').then((m) => ({ default: m.AboutScreen })),
      guard: 'public',
    },
  },
});
