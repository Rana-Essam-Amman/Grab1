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
    mockDeleteListing.mockResolvedValue({ success: true, error: null });

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

  it('handleDelete deletes listing and calls goBack', async () => {
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteListing).toHaveBeenCalledWith('item-123');
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('handleSelectSeller sets selectedSellerPhone and navigates to seller-profile', () => {
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleSelectSeller();
    });
    expect(mockSetSelectedSellerPhone).toHaveBeenCalledWith(mockListing.sellerPhone);
    expect(mockNavigateTo).toHaveBeenCalledWith('seller-profile');
  });

  it('handleStartChat with authenticated user starts conversation and navigates to thread', () => {
    mockStartOrOpenConversation.mockReturnValue('thread-123');

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleStartChat();
    });

    expect(mockStartOrOpenConversation).toHaveBeenCalledWith(mockListing);
    expect(mockSetSelectedThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockNavigateTo).toHaveBeenCalledWith('thread');
  });

  it('handleStartChat is a no-op when isCountryMismatch is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'u1', phone: '0799999999', countryCode: 'SA' },
    } as unknown as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useListingDetail());
    expect(result.current.isCountryMismatch).toBe(true);

    act(() => {
      result.current.handleStartChat();
    });

    expect(mockStartOrOpenConversation).not.toHaveBeenCalled();
    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it('handleCall with unauthenticated user navigates to login', () => {
    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    } as unknown as ReturnType<typeof useAuth>);

    const originalLocation = window.location;
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleCall();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith('login');
    expect(mockLocation.href).toBe('');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('handleCall with authenticated user sets window.location.href to tel: link', () => {
    const originalLocation = window.location;
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleCall();
    });

    expect(mockLocation.href).toBe('tel:+962791234567');

    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('handleWhatsApp with authenticated user opens WhatsApp URL', () => {
    const spyOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleWhatsApp();
    });

    expect(spyOpen).toHaveBeenCalled();
    const urlCalled = spyOpen.mock.calls[0][0] as string;
    expect(urlCalled).toContain('wa.me');
    expect(urlCalled).toContain('791234567');
    spyOpen.mockRestore();
  });

  it('handleWhatsApp is a no-op when isCountryMismatch is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'u1', phone: '0799999999', countryCode: 'SA' },
    } as unknown as ReturnType<typeof useAuth>);

    const spyOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleWhatsApp();
    });

    expect(spyOpen).not.toHaveBeenCalled();
    spyOpen.mockRestore();
  });

  it('exposes isOwner=true when user.phone equals listing.sellerPhone', () => {
    vi.mocked(useAuth).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'u1', phone: '0791234567', countryCode: 'JO' },
    } as unknown as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useListingDetail());
    expect(result.current.isOwner).toBe(true);
  });
});
