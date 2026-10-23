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
    'motors-landing': {
      name: 'motors-landing',
      component: () => import('./screens/MotorsLandingScreen').then((m) => ({ default: m.MotorsLandingScreen })),
      guard: 'public',
    },
    'projects-landing': {
      name: 'projects-landing',
      component: () => import('./screens/ProjectsLandingScreen').then((m) => ({ default: m.ProjectsLandingScreen })),
      guard: 'public',
    },
    'mobiles-landing': { name: 'mobiles-landing', component: () => import('./screens/MobilesLandingScreen').then((m) => ({ default: m.MobilesLandingScreen })), guard: 'public' },
    'electronics-landing': { name: 'electronics-landing', component: () => import('./screens/ElectronicsLandingScreen').then((m) => ({ default: m.ElectronicsLandingScreen })), guard: 'public' },
    'computers-landing': { name: 'computers-landing', component: () => import('./screens/ComputersLandingScreen').then((m) => ({ default: m.ComputersLandingScreen })), guard: 'public' },
    'watches-landing': { name: 'watches-landing', component: () => import('./screens/WatchesLandingScreen').then((m) => ({ default: m.WatchesLandingScreen })), guard: 'public' },
    'sports-landing': { name: 'sports-landing', component: () => import('./screens/SportsLandingScreen').then((m) => ({ default: m.SportsLandingScreen })), guard: 'public' },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
