import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: 'chat',
  screens: {
    'messages': {
      name: 'messages',
      component: () => import('./screens/MessagesScreen').then((m) => ({ default: m.MessagesScreen })),
      guard: 'authenticated',
      tab: 'messages',
    },
    'thread': {
      name: 'thread',
      component: () => import('./screens/ThreadScreen').then((m) => ({ default: m.ThreadScreen })),
      guard: 'authenticated',
    },
  },
});
