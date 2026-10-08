import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExploreListings } from '../useExploreListings';
import { useUIStore } from '@/store/ui.slice';
import { useListingsStore } from '@/features/listings/store/listings.slice';

const makeListing = (id: string, overrides: Record<string, unknown> = {}) => ({
  id, title: `Listing ${id}`, description: 'Test', price: '1000', currency: 'JOD',
  countryCode: 'JO', city: 'عمّان', neighborhood: 'خلدا', categorySlug: 'motors',
  subcategorySlug: 'cars', imageUrl: '/t.jpg', images: ['/t.jpg'], sellerPhone: '791234567',
  sellerName: 'Test', createdAt: '2026-01-01', views: 0, attributes: [], isPremium: false,
  ...overrides,
});

describe('useExploreListings', () => {
  beforeEach(() => {
    useUIStore.setState({
      searchQuery: '', categoryFilter: null, browseCountryCode: 'JO', browseCityAr: 'عمّان',
      browseCityEn: 'Amman', minPriceFilter: null, maxPriceFilter: null, neighborhoodFilter: null,
    });
    useListingsStore.setState({ listings: [], wishlist: [] });
  });

  it('returns empty displayListings when no listings exist', () => {
    const { result } = renderHook(() => useExploreListings());
    expect(result.current.displayListings).toEqual([]);
  });

  it('does NOT filter displayListings by searchQuery (server owns FTS)', () => {
    // Text search now runs on the server via search_listings RPC
    // (see useSupabaseListingsSync + Wave 3 PRs 3A/3B-1).
    // useExploreListings only applies category / price / neighborhood /
    // city filters client-side. Setting searchQuery must NOT change the
    // client-side result — that contract is verified by the sync hook
    // and Supabase FTS integration tests.
    useListingsStore.setState({
      listings: [
        makeListing('a', { title: 'Toyota Camry 2022' }),
        makeListing('b', { title: 'Honda Civic 2021' }),
      ] as never,
    });
    useUIStore.setState({ searchQuery: 'camry' });
    const { result } = renderHook(() => useExploreListings());
    // All market-scoped listings are returned; no text filtering applied.
    expect(result.current.displayListings.length).toBe(2);
  });

  it('respects market isolation (only current countryCode)', () => {
    useListingsStore.setState({
      listings: [
        makeListing('jo-1', { countryCode: 'JO' }),
        makeListing('sa-1', { countryCode: 'SA' }),
      ] as never,
    });
    const { result } = renderHook(() => useExploreListings());
    expect(result.current.displayListings.length).toBe(1);
    expect(result.current.displayListings[0].countryCode).toBe('JO');
  });

  it('sorts premium listings first (when times are close)', () => {
    const commonDate = '2026-01-01T12:00:00Z';
    useListingsStore.setState({
      listings: [
        makeListing('regular', { isPremium: false, createdAt: commonDate }),
        makeListing('premium', { isPremium: true, createdAt: commonDate }),
      ] as never,
    });
    const { result } = renderHook(() => useExploreListings());
    expect(result.current.displayListings[0].id).toBe('premium');
  });

  it('handleResetAllFilters clears all filters', () => {
    useUIStore.setState({
      searchQuery: 'test', categoryFilter: 'motors', minPriceFilter: 100,
      maxPriceFilter: 5000, neighborhoodFilter: 'خلدا',
    });
    const { result } = renderHook(() => useExploreListings());
    act(() => { result.current.handleResetAllFilters(); });
    expect(useUIStore.getState().searchQuery).toBe('');
    expect(useUIStore.getState().categoryFilter).toBeNull();
    expect(useUIStore.getState().minPriceFilter).toBeNull();
    expect(useUIStore.getState().maxPriceFilter).toBeNull();
    expect(useUIStore.getState().neighborhoodFilter).toBeNull();
  });

  it('setFilterMode user override sticks', () => {
    const { result } = renderHook(() => useExploreListings());
    act(() => { result.current.setFilterMode('all'); });
    expect(result.current.filterMode).toBe('all');
  });
});
