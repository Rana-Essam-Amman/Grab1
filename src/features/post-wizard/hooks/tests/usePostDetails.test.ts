import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostDetails } from '../usePostDetails';
import { useDraftStore } from '../../store/draft.slice';
import { useUIStore } from '@/store/ui.slice';

describe('usePostDetails', () => {
  beforeEach(() => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors',
        subcategorySlug: 'cars',
        photos: [],
        city: 'عمّان',
        neighborhood: 'خلدا',
        site: '',
        noteText: '',
      },
    });
    useUIStore.setState({ locale: 'ar', isArabic: true, browseCountryCode: 'JO' });
  });

  it('initializes title/price/description from draft', () => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: 'عمّان', neighborhood: 'خلدا', site: '', noteText: '',
        title: 'Initial', price: '500', description: 'Existing description here',
      },
    });
    const { result } = renderHook(() => usePostDetails());
    expect(result.current.title).toBe('Initial');
    expect(result.current.price).toBe('500');
    expect(result.current.description).toBe('Existing description here');
  });

  it('canContinue is false when title/price/description missing', () => {
    const { result } = renderHook(() => usePostDetails());
    expect(result.current.canContinue).toBe(false);
  });

  it('setField updates values map', () => {
    const { result } = renderHook(() => usePostDetails());
    act(() => {
      result.current.setField('color', 'أبيض');
    });
    expect(result.current.values.color).toBe('أبيض');
  });
});
