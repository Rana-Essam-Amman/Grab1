import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWishlistFilter } from '../useWishlistFilter';
import { useListingsStore } from '@/features/listings/store/listings.slice';
import { saveWishlistForMarket } from '@/services/listing.service';
import { Listing } from '@/types';

const makeListing = (id: string, categorySlug: string, countryCode: Listing['countryCode'] = 'JO'): Listing => ({
  id,
  title: `Listing ${id}`,
  description: 'Test description',
  price: '100',
  currency: 'JOD',
  countryCode,
  city: 'Amman',
  neighborhood: 'Khalda',
  categorySlug,
  subcategorySlug: 'sub',
  imageUrl: '/test.jpg',
  images: ['/test.jpg'],
  sellerPhone: '791234567',
  sellerName: 'Test Seller',
  createdAt: '2026-01-01',
  views: 0,
  attributes: [],
});

describe('useWishlistFilter', () => {
  const l1 = makeListing('1', 'cars');
  const l2 = makeListing('2', 'electronics');
  const mockSetActiveTab = vi.fn();
  const mockNavigateTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    saveWishlistForMarket('JO', ['1', '2']);
    useListingsStore.setState({
      listings: [l1, l2],
      wishlist: ['1', '2'],
      activeWishlistCountry: 'JO',
      isInitialized: true,
    });
  });

  it('selectedCategory defaults to all and returns all country wishlist items', () => {
    const { result } = renderHook(() =>
      useWishlistFilter('JO', false, mockSetActiveTab, mockNavigateTo)
    );
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.countryWishlistListings).toHaveLength(2);
    expect(result.current.filteredListings).toHaveLength(2);
    expect(result.current.availableCategories).toContain('cars');
    expect(result.current.availableCategories).toContain('electronics');
  });

  it('handleCategorySelect filters listings by categorySlug', () => {
    const { result } = renderHook(() =>
      useWishlistFilter('JO', false, mockSetActiveTab, mockNavigateTo)
    );
    act(() => {
      result.current.handleCategorySelect('cars');
    });
    expect(result.current.selectedCategory).toBe('cars');
    expect(result.current.filteredListings).toHaveLength(1);
    expect(result.current.filteredListings[0].id).toBe('1');
  });

  it('handleRemoveItem calls toggleWishlist and shows toast message', () => {
    const { result } = renderHook(() =>
      useWishlistFilter('JO', false, mockSetActiveTab, mockNavigateTo)
    );
    act(() => {
      result.current.handleRemoveItem('1');
    });
    expect(result.current.showToast).toBe(true);
    expect(result.current.toastMessage).toBe('Removed from Favorites');
    expect(useListingsStore.getState().wishlist).toEqual(['2']);
  });
});
