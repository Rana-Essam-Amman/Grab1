import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostAdEntry } from '../usePostAdEntry';
import { useUIStore } from '@/store/ui.slice';

const mockStartPostFlow = vi.fn();

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({ startPostFlow: mockStartPostFlow }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    authStatus: 'authenticated',
    isAnonymous: false,
    user: { firstName: 'Test', lastName: 'User' },
  }),
}));

describe('usePostAdEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({
      isArabic: true,
      activeTab: 'explore',
      currentScreen: 'main',
      screenHistory: ['main', 'post-ad-entry'],
      aiFlowPending: false,
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

  it('startPostFlow starts draft, sets AI pending, and navigates', () => {
    const { result } = renderHook(() => usePostAdEntry());

    act(() => {
      result.current.startPostFlow();
    });

    expect(mockStartPostFlow).toHaveBeenCalled();
    expect(useUIStore.getState().aiFlowPending).toBe(true);
    expect(useUIStore.getState().currentScreen).toBe('post-category');
  });
});
