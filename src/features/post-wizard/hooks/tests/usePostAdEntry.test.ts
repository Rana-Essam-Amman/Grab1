import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostAdEntry } from '../usePostAdEntry';
import { useUIStore } from '@/store/ui.slice';

const mockStartPostFlow = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({ startPostFlow: mockStartPostFlow }),
}));

describe('usePostAdEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({
      isArabic: true,
      activeTab: 'explore',
      currentScreen: 'main',
      screenHistory: ['main', 'post-ad-entry'],
    });
  });

  it('handleBack sets explore tab and pops history', () => {
    const { result } = renderHook(() => usePostAdEntry());
    act(() => {
      result.current.handleBack();
    });
    expect(useUIStore.getState().activeTab).toBe('explore');
    expect(useUIStore.getState().currentScreen).toBe('main');
  });

  it('handleAI starts post flow and navigates to AI capture', () => {
    const { result } = renderHook(() => usePostAdEntry());
    act(() => {
      result.current.handleAI();
    });
    expect(mockStartPostFlow).toHaveBeenCalled();
    expect(useUIStore.getState().currentScreen).toBe('post-ai-capture');
  });

  it('handleTraditional starts post flow and navigates to category', () => {
    const { result } = renderHook(() => usePostAdEntry());
    act(() => {
      result.current.handleTraditional();
    });
    expect(mockStartPostFlow).toHaveBeenCalled();
    expect(useUIStore.getState().currentScreen).toBe('post-category');
  });
});
