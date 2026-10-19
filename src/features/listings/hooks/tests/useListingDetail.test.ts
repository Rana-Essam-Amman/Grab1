import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { useListingDetail } from '../useListingDetail';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/shared/lib/supabase';

// Mock the hooks
vi.mock('@/hooks/useUI', () => ({ useUI: vi.fn() }));
vi.mock('@/hooks/useListings', () => ({ useListings: vi.fn() }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useChat', () => ({ useChat: vi.fn() }));
vi.mock('@/shared/lib/supabase', () => ({
  supabase: { rpc: vi.fn(), auth: { getSession: vi.fn(), signInAnonymously: vi.fn() } },
}));
vi.mock('../helpers/listingDerivedData', () => ({
  useListingDerivedData: vi.fn(() => ({
    formattedPhone: { dialNumber: '+962791234567' },
    images: [],
    locationText: '',
    mapUrl: '',
    mapQuery: '',
    displayCurrency: 'JOD',
  })),
  getWhatsAppUrl: vi.fn(() => 'https://wa.me/962791234567'),
}));

describe('useListingDetail', () => {
  const navigateToMock = vi.fn();
  
  const mockListing = {
    id: 'item-123',
    userId: 'user-1',
    title: 'Test Listing',
    sellerPhone: null, // Important: No initial phone to force RPC call
    countryCode: 'JO',
    status: 'active',
  };

  const originalLocation = window.location;

  beforeAll(() => {
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterAll(() => {
    (window as any).location = originalLocation;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    navigateToMock.mockClear();
    window.location.href = '';
    vi.spyOn(window, 'open').mockImplementation(() => null);

    (useUI as any).mockReturnValue({
      isArabic: true,
      goBack: vi.fn(),
      selectedListingId: 'item-123',
      setSelectedListingId: vi.fn(),
      setSelectedThreadId: vi.fn(),
      setSelectedSellerPhone: vi.fn(),
      navigateTo: navigateToMock,
      browseCountryCode: 'JO',
    });

    (useListings as any).mockReturnValue({
      getListing: vi.fn().mockReturnValue(mockListing),
    });

    (useChat as any).mockReturnValue({
      openConversation: vi.fn(),
    });

    // Mock supabase RPC for phone reveal
    (supabase.rpc as any).mockResolvedValue({
      data: '+962791234567',
      error: null,
    });
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (supabase.auth.signInAnonymously as any).mockResolvedValue({ error: null });
  });

  it('handleCall with unauthenticated user (guest) reveals phone and sets tel: link', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    });

    const { result } = renderHook(() => useListingDetail());

    await act(async () => {
      await result.current.handleCall();
    });

    expect(navigateToMock).not.toHaveBeenCalledWith('login');
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    // Now uses international format so it works cross-market
    expect(window.location.href).toBe('tel:+962791234567');
  });

  it('handleCall with authenticated user sets window.location.href to tel: link', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'user-1' },
    });

    const { result } = renderHook(() => useListingDetail());

    await act(async () => {
      await result.current.handleCall();
    });

    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(window.location.href).toBe('tel:+962791234567');
  });

  it('handleWhatsApp with unauthenticated user (guest) reveals phone and opens WhatsApp', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    });

    const { result } = renderHook(() => useListingDetail());
    
    await act(async () => {
      await result.current.handleWhatsApp();
    });

    expect(navigateToMock).not.toHaveBeenCalledWith('login');
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(window.open).toHaveBeenCalled();
  });

  it('handleWhatsApp with authenticated user opens WhatsApp URL', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'user-1' },
    });

    const { result } = renderHook(() => useListingDetail());

    await act(async () => {
      await result.current.handleWhatsApp();
    });

    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(window.open).toHaveBeenCalled();
  });
});
