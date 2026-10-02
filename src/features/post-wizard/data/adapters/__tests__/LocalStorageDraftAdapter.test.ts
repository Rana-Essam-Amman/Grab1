import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageDraftAdapter } from '../LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../../../domain';
import { scopedKey } from '@/data/markets/storage';

describe('LocalStorageDraftAdapter', () => {
  // Adapter is market-scoped. Tests assume JO by default.
  const TEST_MARKET = 'JO';
  const SCOPED_KEY = scopedKey(TEST_MARKET, 'post_draft_v1');

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

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageDraftAdapter(() => TEST_MARKET);
    vi.clearAllMocks();
  });

  describe('getCurrent', () => {
    it('returns null when no draft exists', async () => {
      expect(await adapter.getCurrent()).toBeNull();
    });

    it('returns the saved draft after save', async () => {
      await adapter.save(validDraft);
      const result = await adapter.getCurrent();
      expect(result).toEqual(validDraft);
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
  });

  describe('save', () => {
    it('persists a valid draft', async () => {
      await adapter.save(validDraft);
      const raw = localStorage.getItem(SCOPED_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual(validDraft);
    });

    it('overwrites an existing draft', async () => {
      await adapter.save(validDraft);
      const updated = { ...validDraft, noteText: 'Updated note' };
      await adapter.save(updated);
      expect(await adapter.getCurrent()).toEqual(updated);
    });

    it('does not write when draft fails schema', async () => {
      const bad = { ...validDraft, step: 'invalid-step' } as unknown as PostDraftWithMeta;
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
});
