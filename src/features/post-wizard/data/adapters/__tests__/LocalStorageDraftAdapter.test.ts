import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageDraftAdapter } from '../LocalStorageDraftAdapter';
import type { PostDraftWithMeta } from '../../../domain';

describe('LocalStorageDraftAdapter', () => {
  let adapter: LocalStorageDraftAdapter;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { storage[key] = value; },
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete storage[key]; },
    );
    adapter = new LocalStorageDraftAdapter();
  });

  const sampleDraft: PostDraftWithMeta = {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: ['photo1.jpg'],
    city: 'Amman',
    neighborhood: 'Khalda',
    site: '',
    noteText: 'Toyota Camry 2018',
    step: 'review',
    lastUpdatedAt: '2026-09-16T12:00:00Z',
  };

  it('returns null when no draft exists', async () => {
    const result = await adapter.getCurrent();
    expect(result).toBeNull();
  });

  it('saves and retrieves a draft', async () => {
    await adapter.save(sampleDraft);
    const retrieved = await adapter.getCurrent();
    expect(retrieved?.categorySlug).toBe('motors');
    expect(retrieved?.step).toBe('review');
  });

  it('overwrites existing draft on save', async () => {
    await adapter.save(sampleDraft);
    await adapter.save({ ...sampleDraft, city: 'Zarqa' });
    const retrieved = await adapter.getCurrent();
    expect(retrieved?.city).toBe('Zarqa');
  });

  it('clears the draft', async () => {
    await adapter.save(sampleDraft);
    await adapter.clear();
    const result = await adapter.getCurrent();
    expect(result).toBeNull();
  });

  it('handles corrupt JSON gracefully', async () => {
    storage['post_draft_v1'] = 'invalid json {';
    const result = await adapter.getCurrent();
    expect(result).toBeNull();
  });

  it('handles empty string gracefully', async () => {
    storage['post_draft_v1'] = '';
    const result = await adapter.getCurrent();
    expect(result).toBeNull();
  });
});
