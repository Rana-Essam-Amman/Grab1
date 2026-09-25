import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostWizard } from '../usePostWizard';
import { useDraftStore } from '../../store/draft.slice';
import { useUIStore } from '@/store/ui.slice';

describe('usePostWizard', () => {
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
    useUIStore.setState({ activeTab: 'explore', currentScreen: 'main', screenHistory: ['main'] });
  });

  it('exposes the current postDraft', () => {
    const { result } = renderHook(() => usePostWizard());
    expect(result.current.postDraft.categorySlug).toBe('motors');
    expect(result.current.postDraft.city).toBe('عمّان');
  });

  it('updatePostDraft merges partial fields', () => {
    const { result } = renderHook(() => usePostWizard());
    act(() => {
      result.current.updatePostDraft({ title: 'Test', price: '100' });
    });
    expect(result.current.postDraft.title).toBe('Test');
    expect(result.current.postDraft.price).toBe('100');
    expect(result.current.postDraft.categorySlug).toBe('motors');
  });

  it('resetDraft navigates to main with explore tab', () => {
    const { result } = renderHook(() => usePostWizard());
    act(() => {
      result.current.resetDraft();
    });
    expect(useUIStore.getState().activeTab).toBe('explore');
    expect(useUIStore.getState().currentScreen).toBe('main');
  });
});
