import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useListingDetail } from '../useListingDetail';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Listing } from '@/types';

vi.mock('@/hooks/useUI');
vi.mock('@/hooks/useListings');
vi.mock('@/hooks/useChat');
vi.mock('@/hooks/useAuth');

const mockListing: Listing = {
  id: 'item-123',
  title: 'Test Listing',
  description: 'Test description',
  price: '100',
  currency: 'JOD',
  countryCode: 'JO',
  city: 'Amman',
  neighborhood: 'Khalda',
  categorySlug: 'cars',
  subcategorySlug: 'sedan',
  imageUrl: '/test.jpg',
  images: ['/test.jpg'],
  sellerPhone: '0791234567',
  sellerName: 'Test Seller',
  createdAt: '2026-01-01',
  views: 0,
  attributes: [],
};

describe('useListingDetail', () => {
  const mockGoBack = vi.fn();
  const mockNavigateTo = vi.fn();
  const mockSetSelectedThreadId = vi.fn();
  const mockSetSelectedSellerPhone = vi.fn();
  const mockGetListing = vi.fn();
  const mockDeleteListing = vi.fn();
  const mockStartOrOpenConversation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUI).mockReturnValue({
      isArabic: false,
      goBack: mockGoBack,
      selectedListingId: 'item-123',
      setSelectedThreadId: mockSetSelectedThreadId,
      setSelectedSellerPhone: mockSetSelectedSellerPhone,
      navigateTo: mockNavigateTo,
      browseCountryCode: 'JO',
    } as unknown as ReturnType<typeof useUI>);

    vi.mocked(useListings).mockReturnValue({
      getListing: mockGetListing.mockImplementation((id: string) => (id === 'item-123' ? mockListing : null)),
      deleteListing: mockDeleteListing,
    } as unknown as ReturnType<typeof useListings>);

    vi.mocked(useChat).mockReturnValue({
      startOrOpenConversation: mockStartOrOpenConversation,
    } as unknown as ReturnType<typeof useChat>);

    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'u1', phone: '0799999999', countryCode: 'JO' },
    } as unknown as ReturnType<typeof useAuth>);
  });

  it('returns listing as null when selectedListingId is null', () => {
    vi.mocked(useUI).mockReturnValue({
      isArabic: false,
      goBack: mockGoBack,
      selectedListingId: null,
      setSelectedThreadId: mockSetSelectedThreadId,
      setSelectedSellerPhone: mockSetSelectedSellerPhone,
      navigateTo: mockNavigateTo,
      browseCountryCode: 'JO',
    } as unknown as ReturnType<typeof useUI>);

    const { result } = renderHook(() => useListingDetail());
    expect(result.current.listing).toBeNull();
  });

  it('handleStartChat with unauthenticated user navigates to login and starts no chat', () => {
    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    } as unknown as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleStartChat();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith('login');
    expect(mockStartOrOpenConversation).not.toHaveBeenCalled();
    expect(mockSetSelectedThreadId).not.toHaveBeenCalled();
  });

  it('handleDelete deletes listing and calls goBack', () => {
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleDelete();
    });

    expect(mockDeleteListing).toHaveBeenCalledWith('item-123');
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
