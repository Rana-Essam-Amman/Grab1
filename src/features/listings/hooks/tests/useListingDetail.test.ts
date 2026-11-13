import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { useListingDetail } from '../useListingDetail';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { supabase } from '@/shared/lib/supabase';
import { showChatUnavailable, showChatOpenFailed, showChatCrossMarket } from '../../helpers/chatErrorToast';
import { getWhatsAppUrl } from '../../helpers/listingDerivedData';
import type { Listing, UserProfile, CountryDef } from '@/types';
import type { WhatsAppIntent } from '../../helpers/whatsappIntents';
import type { ScreenType, TabType } from '@/store/ui.slice';
import type { MarketCode } from '@/shared/lib/marketGate';

type UIReturn = ReturnType<typeof useUI>;
type AuthReturn = ReturnType<typeof useAuth>;
type ListingsReturn = ReturnType<typeof useListings>;
type ChatReturn = ReturnType<typeof useChat>;

interface LocationStub {
  href: string;
}

const navigateToMock = vi.fn<(screen: ScreenType) => void>();
const setSelectedListingIdMock = vi.fn<(id: string | null) => void>();
const setSelectedThreadIdMock = vi.fn<(id: string | null) => void>();
const setSelectedSellerPhoneMock = vi.fn<(phone: string | null) => void>();
const goBackMock = vi.fn<() => void>();
const openConversationMock = vi.fn<ChatReturn['openConversation']>();
const handleDeleteRawMock = vi.fn<(id: string, onSuccess: () => void) => Promise<void>>();

const locationStub: LocationStub = { href: '' };
const originalLocation = window.location;

const jordan: CountryDef = {
  code: 'JO',
  nameEn: 'Jordan',
  nameAr: 'الأردن',
  flagUrl: '/flags/jo.jpg',
  currencies: [{ code: 'JOD', nameEn: 'Jordanian Dinar', nameAr: 'دينار أردني' }],
};

vi.mock('@/hooks/useUI', () => ({ useUI: vi.fn() }));
vi.mock('@/hooks/useListings', () => ({ useListings: vi.fn() }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useChat', () => ({ useChat: vi.fn() }));
vi.mock('@/shared/lib/supabase', () => ({
  supabase: { rpc: vi.fn(), auth: { getSession: vi.fn(), signInAnonymously: vi.fn() } },
}));
vi.mock('../../helpers/listingDerivedData', () => ({
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

function makeUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'buyer-1',
    firstName: 'B',
    lastName: 'U',
    email: 'b@example.com',
    phone: '+962700000000',
    ...overrides,
  };
}

let currentListing: Listing = makeListing();

function buildUI(overrides: Partial<UIReturn> = {}): UIReturn {
  const base: UIReturn = {
    locale: 'ar',
    isArabic: true,
    setLocale: vi.fn<(locale: 'en' | 'ar') => void>(),
    currentScreen: 'listing-detail',
    activeTab: 'explore',
    screenHistory: [],
    navigateTo: navigateToMock,
    goBack: goBackMock,
    setActiveTab: vi.fn<(tab: TabType) => void>(),
    selectedListingId: 'item-123',
    setSelectedListingId: setSelectedListingIdMock,
    selectedThreadId: null,
    setSelectedThreadId: setSelectedThreadIdMock,
    selectedSellerPhone: null,
    setSelectedSellerPhone: setSelectedSellerPhoneMock,
    searchQuery: '',
    setSearchQuery: vi.fn<(query: string) => void>(),
    categoryFilter: null,
    setCategoryFilter: vi.fn<(category: string | null) => void>(),
    subcategoryFilter: null,
    setSubcategoryFilter: vi.fn<(subcategory: string | null) => void>(),
    sortBy: 'newest',
    setSortBy: vi.fn<(sortBy: 'newest' | 'price-asc' | 'price-desc') => void>(),
    attrsFilter: {},
    setAttrsFilter: vi.fn<(attrs: Record<string, string>) => void>(),
    selectedParentCategory: null,
    setSelectedParentCategory: vi.fn<(category: string | null) => void>(),
    maxPriceFilter: null,
    setMaxPriceFilter: vi.fn<(price: number | null) => void>(),
    minPriceFilter: null,
    setMinPriceFilter: vi.fn<(price: number | null) => void>(),
    neighborhoodFilter: null,
    neighborhoodSlugFilter: null,
    browseGovernorateSlug: null,
    browseDistrictSlug: null,
    setNeighborhoodFilter: vi.fn<(neighborhood: string | null) => void>(),
    browseCountryCode: 'JO',
    browseMarketOverride: null,
    setBrowseMarketOverrideLocal: vi.fn<(market: MarketCode) => void>(),
    clearBrowseMarketOverride: vi.fn<() => void>(),
    geoUnsupported: false,
    setGeoUnsupported: vi.fn<(v: boolean) => void>(),
    pendingWishlistId: null,
    setPendingWishlistId: vi.fn<(id: string | null) => void>(),
    browseCountry: jordan,
    browseCityEn: 'Amman',
    browseCityAr: 'عمان',
    activeCurrency: 'JOD',
    setBrowseLocation: vi.fn<(countryCode: MarketCode, cityEn: string, cityAr: string) => void>(),
    setActiveCurrency: vi.fn<(currency: string) => void>(),
    isAiFocused: false,
    setIsAiFocused: vi.fn<(focused: boolean) => void>(),
    isCountrySheetOpen: false,
    setIsCountrySheetOpen: vi.fn<(open: boolean) => void>(),
    isSearchFocused: false,
    setIsSearchFocused: vi.fn<(focused: boolean) => void>(),
    aiFlowPending: false,
    setAiFlowPending: vi.fn<(v: boolean) => void>(),
  };
  return { ...base, ...overrides };
}

function buildAuth(overrides: Partial<AuthReturn> = {}): AuthReturn {
  const base: AuthReturn = {
    authStatus: 'authenticated',
    isAnonymous: false,
    user: makeUser(),
    registered: true,
    sessionToken: 'token',
    logout: vi.fn<() => void>(),
    verifySession: vi.fn<() => Promise<boolean>>(async () => true),
    updateUser: vi.fn<(updates: Partial<UserProfile>) => void>(),
    updateAvatar: vi.fn<(dataUrl: string | null) => void>(),
    feedLayout: 'list',
    setFeedLayout: vi.fn<(layout: 'list' | 'grid') => void>(),
  };
  return { ...base, ...overrides };
}

function buildListings(): ListingsReturn {
  return {
    listings: [currentListing],
    wishlist: [],
    favorites: [],
    wishlistListings: [],
    isQuotaExhausted: false,
    isWishlisted: () => false,
    clearWishlist: vi.fn<() => void>(),
    setWishlistForCountry: vi.fn<(country: string) => void>(),
    toggleWishlist: vi.fn<(id: string, countryCode?: string) => void>(),
    toggleFavorite: vi.fn<(id: string, countryCode?: string) => void>(),
    addListing: vi.fn<(listing: Listing, activeCountry: string, isArabic?: boolean) => void>(),
    publishListing: vi.fn<(listing: Listing, activeCountry: string, isArabic?: boolean) => Promise<{ success: boolean; remoteId: string | null; error: string | null }>>(async () => ({ success: true, remoteId: null, error: null })),
    updateListing: vi.fn<(id: string, updates: Partial<Listing>) => void>(),
    saveListingEdits: vi.fn<(id: string, updates: Partial<Listing>) => Promise<{ success: boolean; error: string | null }>>(async () => ({ success: true, error: null })),
    deleteListing: vi.fn<(id: string) => Promise<{ success: boolean; error: string | null }>>(async () => ({ success: true, error: null })),
    getListing: () => currentListing,
    getUserListings: () => [currentListing],
    userListings: [currentListing],
    setIsQuotaExhausted: vi.fn<(exhausted: boolean) => void>(),
    validateAdQuotaAvailability: vi.fn<(categorySlug: string, userId?: string, countryCode?: string) => boolean>(() => true),
    hasMore: false,
    isLoadingMore: false,
    loadMore: vi.fn<() => Promise<void>>(async () => undefined),
    searchFromSupabase: vi.fn<() => Promise<void>>(async () => undefined),
    activeSearchQuery: null,
    searchBanner: null,
    searchRelatedHeader: null,
    tier2Listings: [],
  };
}

function buildChat(): ChatReturn {
  return {
    conversations: [],
    isTyping: () => false,
    openConversation: openConversationMock,
    sendChatMessage: () => undefined,
    sendChatMessageAsync: vi.fn<ChatReturn['sendChatMessageAsync']>(),
  };
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
    vi.mocked(useUI).mockReturnValue(buildUI());
    vi.mocked(useAuth).mockReturnValue(buildAuth());
    vi.mocked(useListings).mockReturnValue(buildListings());
    vi.mocked(useChat).mockReturnValue(buildChat());
    vi.mocked(supabase.rpc).mockResolvedValue({ data: '+962791234567', error: null });
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } });
    vi.mocked(supabase.auth.signInAnonymously).mockResolvedValue({ error: null });
  });

  it('applies the listingDerivedData mock', () => {
    expect(vi.isMockFunction(getWhatsAppUrl)).toBe(true);
    expect(getWhatsAppUrl({
      countryCode: 'JO',
      dialNumber: '+962791234567',
      listingTitle: 'Test',
      isArabic: true,
    })).toBe('https://wa.me/962791234567');
  });

  it('handleCall with unauthenticated user (guest) reveals phone and sets tel: link', async () => {
    vi.mocked(useAuth).mockReturnValue(buildAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false }));
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
    vi.mocked(useAuth).mockReturnValue(buildAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false }));
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
    vi.mocked(useAuth).mockReturnValue(buildAuth({ authStatus: 'unauthenticated', user: null, isAnonymous: false }));
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(setItem).toHaveBeenCalled();
    expect(navigateToMock).toHaveBeenCalledWith('login');
    expect(openConversationMock).not.toHaveBeenCalled();
  });

  it('redirects anonymous user to login', async () => {
    vi.mocked(useAuth).mockReturnValue(buildAuth({
      authStatus: 'authenticated',
      isAnonymous: true,
      user: makeUser({ id: 'anon', firstName: 'A', lastName: 'N', email: '', phone: '' }),
    }));
    const { result } = renderHook(() => useListingDetail());
    await act(async () => {
      await result.current.handleStartChat();
    });
    expect(navigateToMock).toHaveBeenCalledWith('login');
    expect(openConversationMock).not.toHaveBeenCalled();
  });

  it('does not start chat when the viewer is the owner', async () => {
    vi.mocked(useAuth).mockReturnValue(buildAuth({
      user: makeUser({ id: 'seller-1', firstName: 'S', lastName: 'E', email: 's@example.com', phone: '' }),
    }));
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
