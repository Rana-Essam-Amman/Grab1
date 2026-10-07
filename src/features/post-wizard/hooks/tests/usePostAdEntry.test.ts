import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePostAdEntry } from '../usePostAdEntry';
import { useUIStore } from '@/store/ui.slice';

const mockStartPostFlow = vi.fn();

let mockIsAnonymous = false;
let mockAuthStatus: 'initializing' | 'authenticated' | 'unauthenticated' = 'authenticated';
let mockUserCountryCode: string | undefined = 'JO';
let mockBrowseCountryCode: string = 'JO';

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: () => useUIStore.getState().goBack(),
    navigateTo: (s: string) => useUIStore.setState({ currentScreen: s as never }),
    setActiveTab: (t: string) => useUIStore.setState({ activeTab: t as never }),
    setAiFlowPending: (v: boolean) => useUIStore.setState({ aiFlowPending: v }),
    get browseCountryCode() { return mockBrowseCountryCode; },
  }),
}));

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({ startPostFlow: mockStartPostFlow }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    get authStatus() { return mockAuthStatus; },
    get isAnonymous() { return mockIsAnonymous; },
    get user() {
      return mockUserCountryCode === undefined
        ? null
        : { countryCode: mockUserCountryCode };
    },
  }),
}));

describe('usePostAdEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAnonymous = false;
    mockAuthStatus = 'authenticated';
    mockUserCountryCode = 'JO';
    mockBrowseCountryCode = 'JO';
    useUIStore.setState({ aiFlowPending: false, currentScreen: 'main' });
  });

  it('canPostInMarket is true when user market matches browse market', () => {
    const { result } = renderHook(() => usePostAdEntry());
    expect(result.current.canPostInMarket).toBe(true);
    expect(result.current.myMarket).toBe('JO');
  });

  it('canPostInMarket is false when user market differs from browse market', () => {
    mockBrowseCountryCode = 'LB';
    const { result } = renderHook(() => usePostAdEntry());
    expect(result.current.canPostInMarket).toBe(false);
    expect(result.current.myMarket).toBe('JO');
  });

  it('startPostFlow starts draft, sets AI pending, and navigates when allowed', () => {
    const { result } = renderHook(() => usePostAdEntry());
    act(() => {
      result.current.startPostFlow();
    });
    expect(mockStartPostFlow).toHaveBeenCalled();
    expect(useUIStore.getState().aiFlowPending).toBe(true);
    expect(useUIStore.getState().currentScreen).toBe('post-category');
  });

  it('startPostFlow does nothing when market mismatch', () => {
    mockBrowseCountryCode = 'LB';
    const { result } = renderHook(() => usePostAdEntry());
    act(() => {
      result.current.startPostFlow();
    });
    expect(mockStartPostFlow).not.toHaveBeenCalled();
  });
});
