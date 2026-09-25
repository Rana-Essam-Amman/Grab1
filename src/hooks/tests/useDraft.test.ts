import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDraft } from '../useDraft';
import { useDraftStore } from '@/features/post-wizard/store/draft.slice';

const EMPTY_DRAFT = {
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  photos: [] as string[],
  city: 'عمّان',
  neighborhood: 'خلدا',
  site: '',
  noteText: '',
};

describe('useDraft', () => {
  beforeEach(() => {
    useDraftStore.setState({ postDraft: { ...EMPTY_DRAFT } });
  });

  it('exposes the current postDraft', () => {
    const { result } = renderHook(() => useDraft());
    expect(result.current.postDraft.categorySlug).toBe('motors');
    expect(result.current.postDraft.city).toBe('عمّان');
  });

  it('updatePostDraft merges partial fields', () => {
    const { result } = renderHook(() => useDraft());
    act(() => {
      result.current.updatePostDraft({ title: 'Test Car', price: '1000' });
    });
    expect(result.current.postDraft.title).toBe('Test Car');
    expect(result.current.postDraft.price).toBe('1000');
    expect(result.current.postDraft.categorySlug).toBe('motors');
  });

  it('updatePostDraft overwrites the same key', () => {
    const { result } = renderHook(() => useDraft());
    act(() => {
      result.current.updatePostDraft({ title: 'First' });
    });
    act(() => {
      result.current.updatePostDraft({ title: 'Second' });
    });
    expect(result.current.postDraft.title).toBe('Second');
  });

  it('resetPostDraft clears user content', () => {
    useDraftStore.setState({
      postDraft: { ...EMPTY_DRAFT, title: 'Something', price: '999' },
    });
    const { result } = renderHook(() => useDraft());
    act(() => {
      result.current.resetPostDraft();
    });
    expect(result.current.postDraft.title).toBeUndefined();
    expect(result.current.postDraft.price).toBeUndefined();
  });

  it('photos array updates preserve other fields', () => {
    const { result } = renderHook(() => useDraft());
    act(() => {
      result.current.updatePostDraft({ photos: ['a.jpg', 'b.jpg'] });
    });
    expect(result.current.postDraft.photos).toEqual(['a.jpg', 'b.jpg']);
    expect(result.current.postDraft.city).toBe('عمّان');
  });
});
