import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiPublishFlow } from '../useAiPublishFlow';

const mockNavigateTo = vi.fn();
const mockUpdatePostDraft = vi.fn();
const mockSetIsAnalyzing = vi.fn();
const mockMatchCategory = vi.fn();
const mockGenerateListing = vi.fn();
const mockWriteListingCopy = vi.fn();
const mockBuildFieldsFromFacts = vi.fn();

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    browseCountryCode: 'JO',
    browseCityAr: 'Amman',
    navigateTo: mockNavigateTo,
  }),
}));

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({ updatePostDraft: mockUpdatePostDraft }),
}));

vi.mock('@/ai/categoryMatch', () => ({
  matchCategory: (...args: unknown[]) => mockMatchCategory(...args),
}));

vi.mock('@/ai/listingCopyAgent', () => ({
  generateListing: (...args: unknown[]) => mockGenerateListing(...args),
  writeListingCopy: (...args: unknown[]) => mockWriteListingCopy(...args),
}));

vi.mock('@/ai/buildFieldsFromFacts', () => ({
  buildFieldsFromFacts: (...args: unknown[]) => mockBuildFieldsFromFacts(...args),
}));

describe('useAiPublishFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBuildFieldsFromFacts.mockReturnValue([]);
    mockWriteListingCopy.mockReturnValue({
      title: 'Fallback Title',
      body: 'Fallback Body',
      facts: { price: '100' },
      missing: [],
    });
  });

  it('sets isAnalyzing true at start and false in finally', async () => {
    mockMatchCategory.mockReturnValue({ effectiveCategory: '', effectiveSub: '' });
    const { result } = renderHook(() => useAiPublishFlow(mockSetIsAnalyzing));
    await act(async () => {
      await result.current.processPublishFlow('test', []);
    });
    expect(mockSetIsAnalyzing).toHaveBeenCalledWith(true);
    expect(mockSetIsAnalyzing).toHaveBeenCalledWith(false);
  });

  it('routes to post-category-pick when matchCategory returns no category', async () => {
    mockMatchCategory.mockReturnValue({ effectiveCategory: '', effectiveSub: '' });
    const { result } = renderHook(() => useAiPublishFlow(mockSetIsAnalyzing));
    await act(async () => {
      await result.current.processPublishFlow('vague item', []);
    });
    expect(mockNavigateTo).toHaveBeenCalledWith('post-category-pick');
    expect(mockUpdatePostDraft).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: '' })
    );
  });

  it('passes overrideCategory to matchCategory', async () => {
    mockMatchCategory.mockReturnValue({ effectiveCategory: '', effectiveSub: '' });
    const { result } = renderHook(() => useAiPublishFlow(mockSetIsAnalyzing));
    await act(async () => {
      await result.current.processPublishFlow('test', [], undefined, 'motors');
    });
    expect(mockMatchCategory).toHaveBeenCalledWith(
      expect.objectContaining({ chosenCategory: 'motors' })
    );
  });

  it('on success routes to post-ai-review and updates draft', async () => {
    mockMatchCategory.mockReturnValue({ effectiveCategory: 'motors', effectiveSub: 'cars' });
    mockGenerateListing.mockResolvedValue({
      title: 'AI Title', description: 'AI Desc', price: '5000', city: 'Amman',
      categorySlug: 'motors', subcategorySlug: 'cars', missing: [], fields: [],
    });
    const { result } = renderHook(() => useAiPublishFlow(mockSetIsAnalyzing));
    await act(async () => {
      await result.current.processPublishFlow('Toyota Camry', []);
    });
    expect(mockNavigateTo).toHaveBeenCalledWith('post-ai-review');
    expect(mockUpdatePostDraft).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: 'motors', subcategorySlug: 'cars' })
    );
  });

  it('on generateListing failure → fallback via writeListingCopy', async () => {
    mockMatchCategory
      .mockReturnValueOnce({ effectiveCategory: 'motors', effectiveSub: 'cars' })
      .mockReturnValueOnce({ effectiveCategory: 'motors', effectiveSub: 'cars' });
    mockGenerateListing.mockRejectedValue(new Error('API failed'));
    const { result } = renderHook(() => useAiPublishFlow(mockSetIsAnalyzing));
    await act(async () => {
      await result.current.processPublishFlow('something', []);
    });
    expect(mockWriteListingCopy).toHaveBeenCalled();
    expect(mockNavigateTo).toHaveBeenCalledWith('post-ai-review');
  });
});
