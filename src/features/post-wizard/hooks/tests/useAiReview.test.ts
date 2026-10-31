import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('@/hooks/useIsAdmin', () => ({ useIsAdmin: () => ({ isAdmin: false, isLoading: false }) }));
import { renderHook, act } from '@testing-library/react';
import { useAiReview } from '../useAiReview';

const mockPhoneModalOpen = vi.fn();

const mockNavigateTo = vi.fn();
const mockSetActiveTab = vi.fn();
const mockUpdatePostDraft = vi.fn();
const mockResetPostDraft = vi.fn();
const mockPublishListing = vi.fn();
const mockToastError = vi.fn();

let mockAuthStatus = 'authenticated';
let mockPostDraft = {
  photos: [] as string[],
  title: 'Test Car',
  price: '5000',
  city: 'Amman',
  neighborhood: 'Abdoun',
  citySlug: 'amman',
  districtSlug: 'tlaa-al-ali',
  neighborhoodSlug: undefined,
  description: 'Nice car',
  generated: {
    fields: [{ key: 'year', label: 'Year', value: '2020', required: true }],
  },
};

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    navigateTo: mockNavigateTo,
    setActiveTab: mockSetActiveTab,
    browseCountryCode: 'JO',
    activeCurrency: 'JOD',
    isArabic: false,
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    authStatus: mockAuthStatus,
    user: { id: 'u1', name: 'John', phone: '0791234567' },
  }),
}));

vi.mock('@/features/auth/store/auth.slice', () => ({
  useAuthStore: {
    getState: () => ({ user: { id: 'u1', name: 'John', phone: '0791234567' } }),
  },
}));

vi.mock('@/features/auth/store/phoneModal.slice', () => ({
  usePhoneModalStore: {
    getState: () => ({ open: mockPhoneModalOpen, close: vi.fn() }),
  },
}));

vi.mock('../usePostWizard', () => ({
  usePostWizard: () => ({
    postDraft: mockPostDraft,
    updatePostDraft: mockUpdatePostDraft,
  }),
}));

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({
    resetPostDraft: mockResetPostDraft,
  }),
}));

vi.mock('@/hooks/useListings', () => ({
  useListings: () => ({
    publishListing: mockPublishListing,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: mockToastError,
    success: vi.fn(),
  },
}));

describe('useAiReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPhoneModalOpen.mockClear();
    mockAuthStatus = 'authenticated';
    mockPublishListing.mockResolvedValue({ success: true, remoteId: 'remote-1', error: null });
    mockPostDraft = {
      photos: ['photo1.jpg'],
      title: 'Test Car',
      price: '5000',
      city: 'Amman',
      neighborhood: 'Abdoun',
      citySlug: 'amman',
      districtSlug: 'tlaa-al-ali',
      neighborhoodSlug: undefined,
      description: 'Nice car',
      generated: {
        fields: [{ key: 'year', label: 'Year', value: '2020', required: true }],
      },
    };
  });

  it('returns draft values correctly', () => {
    const { result } = renderHook(() => useAiReview());
    expect(result.current.title).toBe('Test Car');
    expect(result.current.price).toBe('5000');
    expect(result.current.city).toBe('Amman');
    expect(result.current.photos).toEqual(['photo1.jpg']);
  });

  it('setAttributeValue updates draft fields', () => {
    const { result } = renderHook(() => useAiReview());
    act(() => {
      result.current.setAttributeValue('year', '2022');
    });
    expect(mockUpdatePostDraft).toHaveBeenCalledWith({
      generated: {
        fields: [{ key: 'year', label: 'Year', value: '2022', required: true }],
      },
    });
  });

  it('handlePublish navigates to login when unauthenticated', async () => {
    mockAuthStatus = 'unauthenticated';
    const { result } = renderHook(() => useAiReview());

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith('login');
    expect(mockPublishListing).not.toHaveBeenCalled();
  });

  it('handlePublish succeeds and navigates to listing-detail', async () => {
    const { result } = renderHook(() => useAiReview());

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(mockPublishListing).toHaveBeenCalledTimes(1);
    expect(mockResetPostDraft).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith('post-publish-success');
  });

  // OPTIMISTIC UI: handlePublish resets the draft and navigates immediately
  // (before the network call resolves). Failures are surfaced via toast,
  // not via the inline `error` state.
  it('handlePublish navigates immediately and reports failures via toast', async () => {
    mockPublishListing.mockResolvedValueOnce({
      success: false,
      remoteId: null,
      error: 'Publish error',
    });

    const { result } = renderHook(() => useAiReview());

    await act(async () => {
      await result.current.handlePublish();
      // Flush pending microtasks so publishPromise.then() runs.
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Optimistic behavior: draft reset + success navigation happen before await.
    expect(mockResetPostDraft).toHaveBeenCalledTimes(1);
    expect(mockNavigateTo).toHaveBeenCalledWith('post-publish-success');

    // Failure is reported via toast; the inline error state stays null.
    expect(mockToastError).toHaveBeenCalledWith('Publish error');
    expect(result.current.error).toBeNull();
  });
});
