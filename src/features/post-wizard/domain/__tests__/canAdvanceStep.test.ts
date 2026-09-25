import { describe, it, expect } from 'vitest';
import { canAdvanceStep } from '../rules/canAdvanceStep';
import type { PostDraft } from '../entities/PostDraft';

const emptyDraft: PostDraft = {
  categorySlug: '',
  subcategorySlug: '',
  photos: [],
  city: '',
  neighborhood: '',
  site: '',
  noteText: '',
};

describe('canAdvanceStep', () => {
  it('blocks category step without category', () => {
    const r = canAdvanceStep('category', emptyDraft);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('no-category');
  });

  it('allows category step with category', () => {
    const r = canAdvanceStep('category', { ...emptyDraft, categorySlug: 'motors' });
    expect(r.allowed).toBe(true);
  });

  it('blocks photos step without photos', () => {
    const r = canAdvanceStep('photos', emptyDraft);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('no-photos');
  });

  it('allows photos step with at least 1 photo', () => {
    const r = canAdvanceStep('photos', { ...emptyDraft, photos: ['a.jpg'] });
    expect(r.allowed).toBe(true);
  });

  it('blocks location step without city', () => {
    const r = canAdvanceStep('location', emptyDraft);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('no-city');
  });

  it('blocks location step without neighborhood', () => {
    const r = canAdvanceStep('location', { ...emptyDraft, city: 'Amman' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('no-neighborhood');
  });

  it('allows location step with city + neighborhood', () => {
    const r = canAdvanceStep('location', { ...emptyDraft, city: 'Amman', neighborhood: 'Khalda' });
    expect(r.allowed).toBe(true);
  });

  it('allows review step always', () => {
    expect(canAdvanceStep('review', emptyDraft).allowed).toBe(true);
  });
});
