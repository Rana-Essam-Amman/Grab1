import { describe, it, expect } from 'vitest';
import { canPublishDraft } from '../rules/canPublishDraft';

describe('canPublishDraft', () => {
  const valid = {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: ['a.jpg'],
    city: 'Amman',
    neighborhood: 'Khalda',
    site: '',
    noteText: 'Toyota Camry 2018',
  };

  it('allows complete draft', () => {
    expect(canPublishDraft(valid).allowed).toBe(true);
  });

  it('rejects missing category', () => {
    const r = canPublishDraft({ ...valid, categorySlug: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('missing-category');
  });

  it('rejects missing subcategory', () => {
    const r = canPublishDraft({ ...valid, subcategorySlug: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('missing-subcategory');
  });

  it('rejects no photos', () => {
    const r = canPublishDraft({ ...valid, photos: [] });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('no-photos');
  });

  it('rejects missing location', () => {
    const r = canPublishDraft({ ...valid, city: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('missing-location');
  });

  it('rejects empty note', () => {
    const r = canPublishDraft({ ...valid, noteText: '   ' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-note');
  });
});
