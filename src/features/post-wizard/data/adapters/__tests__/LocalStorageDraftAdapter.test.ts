import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageDraftAdapter } from '../LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../../../domain';
import { scopedKey } from '@/data/markets/storage';

describe('LocalStorageDraftAdapter', () => {
  const TEST_MARKET = 'JO';
  const SCOPED_KEY = scopedKey(TEST_MARKET, 'post_draft_v1');
  const LB_KEY = scopedKey('LB', 'post_draft_v1');

  let market = TEST_MARKET;
  let adapter: LocalStorageDraftAdapter;
  const validDraft: PostDraftWithMeta = {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: ['blob:1', 'blob:2'],
    city: 'Amman',
    neighborhood: 'Abdoun',
    site: '',
    noteText: 'Toyota Camry 2019',
    step: 'review',
    lastUpdatedAt: '2026-09-27T00:00:00.000Z',
  };

  const validDraftWithSlugs: PostDraftWithMeta = {
    ...validDraft,
    citySlug: 'amman',
    districtSlug: 'amman-city',
    neighborhoodSlug: 'dabouq',
  };

  const generatedDraft: PostDraftWithMeta = {
    ...validDraft,
    generated: {
      title: 'Camry',
      description: 'Clean',
      price: '5000',
      categorySlug: 'motors',
      subcategorySlug: 'cars',
      missing: ['year'],
    },
  };

  beforeEach(() => {
    localStorage.clear();
    market = TEST_MARKET;
    adapter = new LocalStorageDraftAdapter(() => market);
    vi.clearAllMocks();
  });

  describe('getCurrent', () => {
    it('returns null when no draft exists', async () => {
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns the saved draft after save', async () => {
      await adapter.save(validDraft);
      expect(await adapter.getCurrent()).toEqual(validDraft);
    });

    it('returns null when stored data is malformed JSON', async () => {
      localStorage.setItem(SCOPED_KEY, 'not-json{');
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns null when stored data fails schema validation', async () => {
      localStorage.setItem(SCOPED_KEY, JSON.stringify({ categorySlug: 123 }));
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns null when step is invalid enum value', async () => {
      localStorage.setItem(SCOPED_KEY, JSON.stringify({ ...validDraft, step: 'bogus' }));
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns null when photos is not an array', async () => {
      localStorage.setItem(SCOPED_KEY, JSON.stringify({ ...validDraft, photos: 'not-array' }));
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns null when localStorage read throws', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('read failed');
      });
      expect(await adapter.getCurrent()).toBeNull();
    });
  });

  describe('save', () => {
    it('persists a valid draft', async () => {
      await adapter.save(validDraft);
      expect(JSON.parse(localStorage.getItem(SCOPED_KEY) || '{}')).toEqual(validDraft);
    });

    it('overwrites an existing draft', async () => {
      await adapter.save(validDraft);
      const updated = { ...validDraft, noteText: 'Updated note' };
      await adapter.save(updated);
      expect(await adapter.getCurrent()).toEqual(updated);
    });

    it('does not write when draft fails schema', async () => {
      const bad = { ...validDraft };
      Object.assign(bad, { step: 'invalid-step' });
      await adapter.save(bad);
      expect(localStorage.getItem(SCOPED_KEY)).toBeNull();
    });

    it('handles empty photos array', async () => {
      const emptyPhotos = { ...validDraft, photos: [] };
      await adapter.save(emptyPhotos);
      expect(await adapter.getCurrent()).toEqual(emptyPhotos);
    });

    it('handles empty strings in text fields', async () => {
      const emptyText = { ...validDraft, noteText: '', city: '', neighborhood: '' };
      await adapter.save(emptyText);
      expect(await adapter.getCurrent()).toEqual(emptyText);
    });

    it('rejects when a valid draft cannot be persisted', async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('write failed');
      });
      await expect(adapter.save(validDraft)).rejects.toThrow('[Draft] Failed to persist draft.');
    });

    it('rejects on quota failure and does not delete chat_conversations', async () => {
      localStorage.setItem('chat_conversations', 'keep');
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const err = new Error('quota');
        err.name = 'QuotaExceededError';
        throw err;
      });
      await expect(adapter.save(validDraft)).rejects.toThrow('[Draft] Failed to persist draft.');
      expect(localStorage.getItem('chat_conversations')).toBe('keep');
    });

    it('validates generated draft data', async () => {
      await adapter.save(generatedDraft);
      expect(await adapter.getCurrent()).toEqual(generatedDraft);
    });
  });

  describe('clear', () => {
    it('removes the draft from storage', async () => {
      await adapter.save(validDraft);
      await adapter.clear();
      expect(await adapter.getCurrent()).toBeNull();
      expect(localStorage.getItem(SCOPED_KEY)).toBeNull();
    });

    it('is a no-op when no draft exists', async () => {
      await expect(adapter.clear()).resolves.not.toThrow();
      expect(localStorage.getItem(SCOPED_KEY)).toBeNull();
    });

    it('rejects when removal fails', async () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('remove failed');
      });
      await expect(adapter.clear()).rejects.toThrow('[Draft] Failed to remove draft.');
    });
  });

  describe('market isolation', () => {
    it('keeps JO and LB drafts isolated', async () => {
      await adapter.save(validDraft);
      const lb = new LocalStorageDraftAdapter(() => 'LB');
      expect(await lb.getCurrent()).toBeNull();
      await lb.save({ ...validDraft, noteText: 'LB draft' });
      expect(await adapter.getCurrent()).toEqual(validDraft);
      expect((await lb.getCurrent())?.noteText).toBe('LB draft');
      expect(localStorage.getItem(SCOPED_KEY)).not.toBeNull();
      expect(localStorage.getItem(LB_KEY)).not.toBeNull();
    });

    it('follows a resolver that changes from JO to LB at runtime', async () => {
      await adapter.save(validDraft);
      market = 'LB';
      expect(await adapter.getCurrent()).toBeNull();
      await adapter.save({ ...validDraft, noteText: 'now LB' });
      expect((await adapter.getCurrent())?.noteText).toBe('now LB');
      expect(JSON.parse(localStorage.getItem(SCOPED_KEY) || '{}').noteText).toBe(validDraft.noteText);
    });

    it('rejects operations when the market is missing', async () => {
      const missing = new LocalStorageDraftAdapter(() => undefined);
      await expect(missing.getCurrent()).rejects.toThrow('[Draft] Invalid or missing market');
      await expect(missing.save(validDraft)).rejects.toThrow('[Draft] Invalid or missing market');
      await expect(missing.clear()).rejects.toThrow('[Draft] Invalid or missing market');
    });

    it('rejects operations when the market is invalid', async () => {
      const invalid = new LocalStorageDraftAdapter(() => 'XX');
      await expect(invalid.getCurrent()).rejects.toThrow('[Draft] Invalid or missing market');
      await expect(invalid.save(validDraft)).rejects.toThrow('[Draft] Invalid or missing market');
      await expect(invalid.clear()).rejects.toThrow('[Draft] Invalid or missing market');
    });
  });

  describe('round-trip', () => {
    it('save → getCurrent → clear works in sequence', async () => {
      expect(await adapter.getCurrent()).toBeNull();
      await adapter.save(validDraft);
      expect(await adapter.getCurrent()).toEqual(validDraft);
      await adapter.clear();
      expect(await adapter.getCurrent()).toBeNull();
    });
  });

  describe('location slugs persistence', () => {
    it('preserves citySlug, districtSlug, neighborhoodSlug through save → getCurrent', async () => {
      await adapter.save(validDraftWithSlugs);
      const result = await adapter.getCurrent();
      expect(result?.citySlug).toBe('amman');
      expect(result?.districtSlug).toBe('amman-city');
      expect(result?.neighborhoodSlug).toBe('dabouq');
    });

    it('loads legacy drafts without slugs without errors (backward compat)', async () => {
      localStorage.setItem(SCOPED_KEY, JSON.stringify(validDraft));
      const result = await adapter.getCurrent();
      expect(result?.city).toBe('Amman');
      expect(result?.citySlug).toBeUndefined();
      expect(result?.districtSlug).toBeUndefined();
      expect(result?.neighborhoodSlug).toBeUndefined();
    });

    it('partial slugs survive (city + neighborhood set, district undefined)', async () => {
      const partialSlugs: PostDraftWithMeta = {
        ...validDraft,
        citySlug: 'amman',
        neighborhoodSlug: 'dabouq',
      };
      await adapter.save(partialSlugs);
      const result = await adapter.getCurrent();
      expect(result?.citySlug).toBe('amman');
      expect(result?.districtSlug).toBeUndefined();
      expect(result?.neighborhoodSlug).toBe('dabouq');
    });
  });
});
