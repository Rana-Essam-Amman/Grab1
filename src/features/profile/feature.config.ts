import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'profile',
  screens: {
    'profile': {
      name: 'profile',
      component: () => import('./screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })),
      guard: 'authenticated',
    },
    'settings': {
      name: 'settings',
      component: () => import('./screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })),
      guard: 'public',
    },
    'edit-profile': {
      name: 'edit-profile',
      component: () => import('./screens/EditProfileScreen').then((m) => ({ default: m.EditProfileScreen })),
      guard: 'authenticated',
    },
    'notifications': {
      name: 'notifications',
      component: () => import('./screens/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })),
      guard: 'authenticated',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
