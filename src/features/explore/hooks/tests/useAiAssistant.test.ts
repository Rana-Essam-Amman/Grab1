import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiAssistant } from '../useAiAssistant';

const mockSetMaxPriceFilter = vi.fn();
const mockSetActiveNeighborhood = vi.fn();
const mockSetActiveSearchText = vi.fn();
const mockSetVoidedNotice = vi.fn();

const defaultProps = {
  setMaxPriceFilter: mockSetMaxPriceFilter,
  setActiveNeighborhood: mockSetActiveNeighborhood,
  setActiveSearchText: mockSetActiveSearchText,
  setVoidedNotice: mockSetVoidedNotice,
};

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    browseCountryCode: 'JO',
    setCategoryFilter: vi.fn(),
    setSearchQuery: vi.fn(),
  }),
}));

vi.mock('@/ai/searchQueryParser', () => ({
  parseNaturalLanguageSearch: vi.fn(() => ({
    categorySlug: null,
    maxPrice: undefined,
    locationLabel: null,
    cleanTextQuery: 'test',
    voidedCrossBorderLocation: null,
  })),
}));

vi.mock('@/features/explore/helpers/intentClassifier', () => ({
  classifyUserIntent: vi.fn(() => 'SEARCH'),
  extractCleanSearchFallback: vi.fn((s: string) => s),
}));

vi.mock('../useAiPublishFlow', () => ({
  useAiPublishFlow: () => ({ processPublishFlow: vi.fn() }),
}));

vi.mock('../useAiSuggestion', () => ({
  useAiSuggestion: () => ({
    suggestion: null,
    isDismissed: false,
    evaluate: vi.fn(),
    dismiss: vi.fn(),
    clear: vi.fn(),
  }),
}));

import { classifyUserIntent } from '@/features/explore/helpers/intentClassifier';

describe('useAiAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initial state has empty query, not analyzing, no hint', () => {
    const { result } = renderHook(() => useAiAssistant(defaultProps));
    expect(result.current.query).toBe('');
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.hint).toBeNull();
  });

  it('handleQueryChange updates query', () => {
    const { result } = renderHook(() => useAiAssistant(defaultProps));
    act(() => {
      result.current.handleQueryChange({ target: { value: 'camry' } } as never);
    });
    expect(result.current.query).toBe('camry');
  });

  it('handleSend with empty query returns null', async () => {
    const { result } = renderHook(() => useAiAssistant(defaultProps));
    let out: unknown = 'CALLED';
    await act(async () => {
      out = await result.current.handleSend([]);
    });
    expect(out).toBeNull();
  });

  it('handleSend IGNORE sets hint and returns null', async () => {
    (classifyUserIntent as ReturnType<typeof vi.fn>).mockReturnValueOnce('IGNORE');
    const { result } = renderHook(() => useAiAssistant(defaultProps));
    act(() => { result.current.setQuery('hi'); });
    let out: unknown = 'NOT_CALLED';
    await act(async () => {
      out = await result.current.handleSend([]);
    });
    expect(out).toBeNull();
    expect(result.current.hint).not.toBeNull();
    expect(result.current.query).toBe('');
  });

  it('handleSend SEARCH applies parsed filters', async () => {
    const { result } = renderHook(() => useAiAssistant(defaultProps));
    act(() => { result.current.setQuery('camry in amman'); });
    await act(async () => {
      await result.current.handleSend([]);
    });
    expect(mockSetActiveSearchText).toHaveBeenCalled();
  });
});
