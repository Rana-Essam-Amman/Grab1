import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'post-wizard',
  screens: {
    'post-category': {
      name: 'post-category',
      component: () => import('./screens/ChooseCategoryScreen').then((m) => ({ default: m.ChooseCategoryScreen })),
      guard: 'public',
    },
    'post-subcategory': {
      name: 'post-subcategory',
      component: () => import('./screens/ChooseSubcategoryScreen').then((m) => ({ default: m.ChooseSubcategoryScreen })),
      guard: 'public',
    },
    'post-photos': {
      name: 'post-photos',
      component: () => import('./screens/PhotoUploadScreen').then((m) => ({ default: m.PhotoUploadScreen })),
      guard: 'public',
    },
    'post-location': {
      name: 'post-location',
      component: () => import('./screens/LocationPickScreen').then((m) => ({ default: m.LocationPickScreen })),
      guard: 'public',
    },
    'post-details': {
      name: 'post-details',
      component: () => import('./screens/PostDetailsScreen').then((m) => ({ default: m.PostDetailsScreen })),
      guard: 'public',
    },
    'edit-post': {
      name: 'edit-post',
      component: () => import('./screens/EditListingScreen').then((m) => ({ default: m.EditListingScreen })),
      guard: 'public',
    },
    'post-ai-draft': {
      name: 'post-ai-draft',
      component: () => import('./screens/AiDraftScreen').then((m) => ({ default: m.AiDraftScreen })),
      guard: 'public',
    },
    'post-ai-review': {
      name: 'post-ai-review',
      component: () => import('./screens/AiReviewScreen').then((m) => ({ default: m.AiReviewScreen })),
      guard: 'public',
    },
    'post-ad-entry': {
      name: 'post-ad-entry',
      component: () => import('./screens/PostAdEntryScreen').then((m) => ({ default: m.PostAdEntryScreen })),
      guard: 'public',
    },
    'post-ai-capture': {
      name: 'post-ai-capture',
      component: () => import('./screens/AiCaptureScreen').then((m) => ({ default: m.AiCaptureScreen })),
      guard: 'public',
    },
    'post-category-pick': {
      name: 'post-category-pick',
      component: () => import('./screens/CategoryPickScreen').then((m) => ({ default: m.CategoryPickScreen })),
      guard: 'public',
    },
    'post-publish-success': {
      name: 'post-publish-success',
      component: () => import('./screens/PublishSuccessScreen').then((m) => ({ default: m.PublishSuccessScreen })),
      guard: 'public',
    },
  },
});
