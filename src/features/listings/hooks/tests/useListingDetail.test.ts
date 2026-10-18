import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useListingDetail } from '../useListingDetail';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/shared/lib/supabase';

// Mock the hooks
vi.mock('@/hooks/useUI', () => ({
  useUI: vi.fn(),
}));
vi.mock('@/hooks/useListings', () => ({
  useListings: vi.fn(),
}));
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));
vi.mock('@/hooks/useChat', () => ({
  useChat: vi.fn(),
}));
vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
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
  const mockListing = {
    id: 'item-123',
    userId: 'user-1',
    title: 'Test Listing',
    sellerPhone: null, // Important: No initial phone to force RPC call
    countryCode: 'JO',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useUI as any).mockReturnValue({
      isArabic: true,
      goBack: vi.fn(),
      selectedListingId: 'item-123',
      setSelectedListingId: vi.fn(),
      setSelectedThreadId: vi.fn(),
      setSelectedSellerPhone: vi.fn(),
      navigateTo: vi.fn(),
      browseCountryCode: 'JO',
    });

    (useListings as any).mockReturnValue({
      getListing: vi.fn().mockReturnValue(mockListing),
    });

    (useChat as any).mockReturnValue({
      openConversation: vi.fn(),
    });

    // Mock window.location and window.open
    vi.stubGlobal('location', { href: '' });
    vi.stubGlobal('open', vi.fn());

    // Mock supabase RPC for phone reveal
    (supabase.rpc as any).mockResolvedValue({
      data: '+962791234567',
      error: null,
    });
  });

  it('handleCall with unauthenticated user sets window.location.href to tel: link', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    });

    const { result } = renderHook(() => useListingDetail());

    await act(async () => {
      await result.current.handleCall();
    });

    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
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

  it('handleWhatsApp with unauthenticated user opens WhatsApp URL', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'unauthenticated',
      user: null,
    });

    const { result } = renderHook(() => useListingDetail());
    const spyOpen = vi.spyOn(window, 'open');

    await act(async () => {
      await result.current.handleWhatsApp();
    });

    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(spyOpen).toHaveBeenCalled();
  });

  it('handleWhatsApp with authenticated user opens WhatsApp URL', async () => {
    (useAuth as any).mockReturnValue({
      authStatus: 'authenticated',
      user: { id: 'user-1' },
    });

    const { result } = renderHook(() => useListingDetail());
    const spyOpen = vi.spyOn(window, 'open');

    await act(async () => {
      await result.current.handleWhatsApp();
    });

    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(spyOpen).toHaveBeenCalled();
  });
});
