import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { useListingDetail } from '../useListingDetail';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/shared/lib/supabase';
import { showChatUnavailable, showChatOpenFailed, showChatCrossMarket } from '../../helpers/chatErrorToast';
import type { Listing } from '@/types';
import type { WhatsAppIntent } from '../../helpers/whatsappIntents';

type UIReturn = ReturnType<typeof useUI>;
type AuthReturn = ReturnType<typeof useAuth>;
type ListingsReturn = ReturnType<typeof useListings>;
type ChatReturn = ReturnType<typeof useChat>;

interface LocationStub {
  href: string;
}

const navigateToMock = vi.fn();
const setSelectedListingIdMock = vi.fn();
const setSelectedThreadIdMock = vi.fn();
const setSelectedSellerPhoneMock = vi.fn();
const goBackMock = vi.fn();
const openConversationMock = vi.fn();
const handleDeleteRawMock = vi.fn();

const locationStub: LocationStub = { href: '' };
const originalLocation = window.location;

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
vi.mock('../../helpers/chatErrorToast', () => ({
  showChatUnavailable: vi.fn(),
  showChatOpenFailed: vi.fn(),
  showChatCrossMarket: vi.fn(),
}));
vi.mock('../useListingDelete', () => ({
  useListingDelete: () => ({ handleDelete: handleDeleteRawMock, isDeleting: false }),
}));

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 'item-123',
    userId: 'seller-1',
    title: 'Test Listing',
    description: 'desc',
    price: '100',
    currency: 'JOD',
    countryCode: 'JO',
    city: 'Amman',
    neighborhood: 'Abdoun',
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    imageUrl: '/test.jpg',
    images: ['/test.jpg'],
    sellerPhone: '',
    sellerName: 'Seller',
    createdAt: '2026-01-01',
    views: 0,
    attributes: [],
    status: 'active',
    ...overrides,
  };
}

let currentListing: Listing = makeListing();

function mockUI(overrides: Partial<UIReturn> = {}): void {
  vi.mocked(useUI).mockReturnValue({
    isArabic: true,
    goBack: goBackMock,
    selectedListingId: 'item-123',
    setSelectedListingId: setSelectedListingIdMock,
    setSelectedThreadId: setSelectedThreadIdMock,
    setSelectedSellerPhone: setSelectedSellerPhoneMock,
    navigateTo: navigateToMock,
    browseCountryCode: 'JO',
    ...overrides,
  } as UIReturn);
}

function mockAuth(overrides: Partial<AuthReturn> = {}): void {
  vi.mocked(useAuth).mockReturnValue({
    authStatus: 'authenticated',
    isAnonymous: false,
    user: { id: 'buyer-1', firstName: 'B', lastName: 'U', email: 'b@example.com', phone: '+962700000000' },
    registered: true,
    sessionToken: 'token',
    logout: vi.fn(),
    verifySession: vi.fn(),
    updateUser: vi.fn(),
    updateAvatar: vi.fn(),
    feedLayout: 'list',
    setFeedLayout: vi.fn(),
    ...overrides,
  } as AuthReturn);
}

function mockListings(): void {
  vi.mocked(useListings).mockReturnValue({
    getListing: vi.fn(() => currentListing),
  } as unknown as ListingsReturn);
}

function mockChat(): void {
  vi.mocked(useChat).mockReturnValue({
    openConversation: openConversationMock,
  } as unknown as ChatReturn);
}

describe('useListingDetail', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: locationStub,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    locationStub.href = '';
    currentListing = makeListing();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUI();
    mockAuth();
    mockListings();
    mockChat();
    vi.mocked(supabase.rpc).mockResolvedValue({ data: '+962791234567', error: null });
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } });
    vi.mocked(supabase.auth.signInAnonymously).mockResolvedValue({ error: null });
  });

  it('handleCall with unauthenticated user (guest) reveals phone and sets tel: link', async () => {
    mockAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleCall();
    });
    expect(navigateToMock).not.toHaveBeenCalledWith('login');
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(locationStub.href).toBe('tel:+962791234567');
  });

  it('handleCall with authenticated user sets window.location.href to tel: link', async () => {
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleCall();
    });
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(locationStub.href).toBe('tel:+962791234567');
  });

  it('handleWhatsApp with unauthenticated user (guest) reveals phone and opens WhatsApp', async () => {
    mockAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleWhatsApp();
    });
    expect(navigateToMock).not.toHaveBeenCalledWith('login');
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(window.open).toHaveBeenCalled();
  });

  it('handleWhatsApp with authenticated user opens WhatsApp URL', async () => {
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleWhatsApp();
    });
    expect(supabase.rpc).toHaveBeenCalledWith('get_listing_phone', { p_listing_id: 'item-123' });
    expect(window.open).toHaveBeenCalled();
  });

  it('redirects guest to login and stores pending chat listing', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    mockAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(setItem).toHaveBeenCalled();
    expect(navigateToMock).toHaveBeenCalledWith('login');
    expect(openConversationMock).not.toHaveBeenCalled();
  });

  it('redirects anonymous user to login', async () => {
    mockAuth({ authStatus: 'authenticated', isAnonymous: true, user: { id: 'anon', firstName: 'A', lastName: 'N', email: '', phone: '' } });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(navigateToMock).toHaveBeenCalledWith('login');
    expect(openConversationMock).not.toHaveBeenCalled();
  });

  it('does not start chat when the viewer is the owner', async () => {
    mockAuth({ user: { id: 'seller-1', firstName: 'S', lastName: 'E', email: 's@example.com', phone: '' } });
    const { result } = renderHook(() => useListingDetail());
    expect(result.current.isOwner).toBe(true);
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(openConversationMock).not.toHaveBeenCalled();
    expect(navigateToMock).not.toHaveBeenCalledWith('thread');
  });

  it('shows unavailable toast when seller userId is missing', async () => {
    currentListing = makeListing({ userId: undefined });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(showChatUnavailable).toHaveBeenCalledWith(true);
    expect(openConversationMock).not.toHaveBeenCalled();
  });

  it('opens the thread after a successful conversation', async () => {
    openConversationMock.mockResolvedValue({ id: 'conv-1' });
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(openConversationMock).toHaveBeenCalledWith(
      { listingId: 'item-123', buyerId: 'buyer-1', sellerId: 'seller-1', marketCode: 'JO' },
      'JO',
    );
    expect(setSelectedThreadIdMock).toHaveBeenCalledWith('conv-1');
    expect(navigateToMock).toHaveBeenCalledWith('thread');
  });

  it('shows open-failed toast when conversation is null', async () => {
    openConversationMock.mockResolvedValue(null);
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(showChatOpenFailed).toHaveBeenCalledWith(true);
    expect(navigateToMock).not.toHaveBeenCalledWith('thread');
  });

  it('shows open-failed toast on a generic conversation error', async () => {
    openConversationMock.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(showChatOpenFailed).toHaveBeenCalledWith(true);
    expect(showChatCrossMarket).not.toHaveBeenCalled();
  });

  it('shows cross-market toast when the handshake is rejected', async () => {
    openConversationMock.mockRejectedValue(new Error('Cross-market chat handshakes are strictly forbidden.'));
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(showChatCrossMarket).toHaveBeenCalledWith(true);
    expect(showChatOpenFailed).not.toHaveBeenCalled();
  });

  it('selects seller by userId when present', () => {
    currentListing = makeListing({ userId: 'seller-1', sellerPhone: '+962799999999' });
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleSelectSeller();
    });
    expect(setSelectedSellerPhoneMock).toHaveBeenCalledWith('seller-1');
    expect(navigateToMock).toHaveBeenCalledWith('seller-profile');
  });

  it('falls back to seller phone when userId is missing', () => {
    currentListing = makeListing({ userId: undefined, sellerPhone: '+962799999999' });
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleSelectSeller();
    });
    expect(setSelectedSellerPhoneMock).toHaveBeenCalledWith('+962799999999');
    expect(navigateToMock).toHaveBeenCalledWith('seller-profile');
  });

  it('navigates to edit-post with the listing id', () => {
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleEdit();
    });
    expect(setSelectedListingIdMock).toHaveBeenCalledWith('item-123');
    expect(navigateToMock).toHaveBeenCalledWith('edit-post');
  });

  it('delegates delete to the delete handler and passes goBack', async () => {
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleDelete();
    });
    expect(handleDeleteRawMock).toHaveBeenCalledWith('item-123', goBackMock);
  });

  it('opens the WhatsApp sheet on click and closes it when an intent is chosen', async () => {
    const intent: WhatsAppIntent = { id: 'available', label: 'Available?', body: 'Hi, is this still available?' };
    const { result } = renderHook(() => useListingDetail());
    act(() => {
      result.current.handleWhatsAppClick();
    });
    expect(result.current.showWhatsAppSheet).toBe(true);
    await act(async () => {
      await result.current.handleWhatsAppIntent(intent);
    });
    expect(result.current.showWhatsAppSheet).toBe(false);
    expect(window.open).toHaveBeenCalled();
  });
});
