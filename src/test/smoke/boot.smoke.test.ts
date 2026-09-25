import { describe, it, expect } from 'vitest';

describe('Boot Smoke Test — Critical Modules', () => {
  it('loads auth store', async () => {
    const m = await import('@/features/auth/store/auth.slice');
    expect(m.useAuthStore).toBeDefined();
  });

  it('loads listings store', async () => {
    const m = await import('@/features/listings/store/listings.slice');
    expect(m.useListingsStore).toBeDefined();
  });

  it('loads chat store', async () => {
    const m = await import('@/features/chat/store/chat.slice');
    expect(m.useChatStore).toBeDefined();
  });

  it('loads ui store', async () => {
    const m = await import('@/store/ui.slice');
    expect(m.useUIStore).toBeDefined();
  });

  it('loads post-wizard hooks', async () => {
    const mods = [
      '@/features/post-wizard/hooks/usePostWizard',
      '@/features/post-wizard/hooks/useAiDraft',
      '@/features/post-wizard/hooks/useAiReview',
      '@/features/post-wizard/hooks/usePhotoUpload',
      '@/features/post-wizard/hooks/useLocationPick'
    ];
    for (const path of mods) {
      const m = await import(/* @vite-ignore */ path);
      expect(Object.keys(m).length).toBeGreaterThan(0);
    }
  });

  it('loads all feature configs', async () => {
    const configs = import.meta.glob('@/features/*/feature.config.ts');
    for (const path in configs) {
      await expect(configs[path]()).resolves.toBeDefined();
    }
  });

  it('loads explore hooks', async () => {
    const m = await import('@/features/explore/hooks/useExploreListings');
    expect(m.useExploreListings).toBeDefined();
  });
});
