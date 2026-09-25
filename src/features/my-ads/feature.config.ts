import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'my-ads',
  screens: {
    'my-ads': {
      name: 'my-ads',
      component: () => import('./screens/MyAdsScreen').then((m) => ({ default: m.MyAdsScreen })),
      guard: 'authenticated',
      tab: 'my-ads',
    },
  },
  menuEntry: {
    icon: 'Tag',
    label: { ar: 'إعلاناتي', en: 'My Ads' },
    order: 5,
    onClick: 'navigate',
    target: 'my-ads',
  },
});
