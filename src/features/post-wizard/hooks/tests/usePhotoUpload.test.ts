import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePhotoUpload } from '../usePhotoUpload';
import { useDraftStore } from '../../store/draft.slice';

describe('usePhotoUpload', () => {
  beforeEach(() => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: 'عمّان', neighborhood: 'خلدا', site: '', noteText: '',
      },
    });
  });

  it('starts with empty photos', () => {
    const { result } = renderHook(() => usePhotoUpload());
    expect(result.current.photos).toEqual([]);
  });

  it('handleRemove deletes photo at index', () => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars',
        photos: ['a.jpg', 'b.jpg', 'c.jpg'],
        city: 'عمّان', neighborhood: 'خلدا', site: '', noteText: '',
      },
    });
    const { result } = renderHook(() => usePhotoUpload());
    act(() => {
      result.current.handleRemove(1);
    });
    expect(result.current.photos).toEqual(['a.jpg', 'c.jpg']);
  });

  it('handleUseSample sets sample photos for motors', () => {
    const { result } = renderHook(() => usePhotoUpload());
    act(() => {
      result.current.handleUseSample('motors');
    });
    expect(result.current.photos.length).toBeGreaterThan(0);
  });
});
