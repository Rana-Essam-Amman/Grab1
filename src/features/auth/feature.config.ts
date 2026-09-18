import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'auth',
  screens: {
    'login': {
      name: 'login',
      component: () => import('./screens/LoginScreen').then((m) => ({ default: m.LoginScreen })),
      guard: 'guest',
    },
    'register': {
      name: 'register',
      component: () => import('./screens/RegisterScreen').then((m) => ({ default: m.RegisterScreen })),
      guard: 'guest',
    },
    'confirm': {
      name: 'confirm',
      component: () => import('./screens/ConfirmScreen').then((m) => ({ default: m.ConfirmScreen })),
      guard: 'guest',
    },
    'terms': {
      name: 'terms',
      component: () => import('./screens/TermsScreen').then((m) => ({ default: m.TermsScreen })),
      guard: 'public',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
