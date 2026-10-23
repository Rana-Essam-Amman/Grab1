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
    'furniture-landing': { name: 'furniture-landing', component: () => import('./screens/FurnitureLandingScreen').then((m) => ({ default: m.FurnitureLandingScreen })), guard: 'public' },
    'fashion-landing': { name: 'fashion-landing', component: () => import('./screens/FashionLandingScreen').then((m) => ({ default: m.FashionLandingScreen })), guard: 'public' },
    'beauty-landing': { name: 'beauty-landing', component: () => import('./screens/BeautyLandingScreen').then((m) => ({ default: m.BeautyLandingScreen })), guard: 'public' },
    'cleaning-landing': { name: 'cleaning-landing', component: () => import('./screens/CleaningLandingScreen').then((m) => ({ default: m.CleaningLandingScreen })), guard: 'public' },
    'home-garden-landing': { name: 'home-garden-landing', component: () => import('./screens/HomeGardenLandingScreen').then((m) => ({ default: m.HomeGardenLandingScreen })), guard: 'public' },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
