import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useListings } from '../useListings';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

const makeListing = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  title: `Listing ${id}`,
  description: 'Test',
  price: '1000',
  currency: 'JOD' as const,
  countryCode: 'JO',
  city: 'عمّان',
  neighborhood: 'خلدا',
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  imageUrl: '/test.jpg',
  images: ['/test.jpg'],
  sellerPhone: '791234567',
  sellerName: 'Test',
  createdAt: '2026-01-01',
  views: 0,
  attributes: [],
  ...overrides,
});

describe('useListings', () => {
  beforeEach(() => {
    useListingsStore.setState({
      listings: [],
      wishlist: [],
      activeWishlistCountry: 'JO',
      isInitialized: true,
    });
    useAuthStore.setState({ authStatus: 'unauthenticated', user: null, sessionToken: null });
    useUIStore.setState({ browseCountryCode: 'JO' });
  });

  it('returns empty listings + wishlist by default', () => {
    const { result } = renderHook(() => useListings());
    expect(result.current.listings).toEqual([]);
    expect(result.current.wishlist).toEqual([]);
    expect(result.current.wishlistListings).toEqual([]);
  });

  it('isWishlisted returns false for unknown id', () => {
    const { result } = renderHook(() => useListings());
    expect(result.current.isWishlisted('unknown')).toBe(false);
  });

  it('isWishlisted returns true after toggleWishlist', () => {
    const { result } = renderHook(() => useListings());
    act(() => {
      result.current.toggleWishlist('jo-1');
    });
    expect(result.current.isWishlisted('jo-1')).toBe(true);
  });

  it('getListing finds a listing by id', () => {
    useListingsStore.setState({ listings: [makeListing('jo-1')] as never });
    const { result } = renderHook(() => useListings());
    expect(result.current.getListing('jo-1')?.id).toBe('jo-1');
    expect(result.current.getListing('nope')).toBeUndefined();
  });

  it('userListings returns [] when no user phone', () => {
    useListingsStore.setState({ listings: [makeListing('jo-1')] as never });
    const { result } = renderHook(() => useListings());
    expect(result.current.userListings).toEqual([]);
  });
});
