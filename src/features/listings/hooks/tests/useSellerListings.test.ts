import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSellerListings } from '../useSellerListings';
import { fetchListingsBySeller } from '../../services/sellerListingsService';
import type { Listing } from '@/types';
import type { SellerListingsResult } from '../../services/sellerListingsService';

vi.mock('../../services/sellerListingsService', () => ({
  fetchListingsBySeller: vi.fn(),
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function listing(id: string, countryCode: Listing['countryCode'] = 'JO'): Listing {
  return {
    id,
    title: id,
    description: 'desc',
    price: '100',
    currency: 'JOD',
    countryCode,
    city: 'Amman',
    neighborhood: 'Abdoun',
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    imageUrl: '/test.jpg',
    images: ['/test.jpg'],
    sellerPhone: '+962791234567',
    sellerName: 'Seller',
    createdAt: '2026-01-01',
    views: 0,
    attributes: [],
    status: 'active',
  };
}

describe('useSellerListings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch and clears state when the seller key is null or empty', async () => {
    const { result, rerender } = renderHook(
      ({ key }: { key: string | null }) => useSellerListings(key, 'JO'),
      { initialProps: { key: null } },
    );
    expect(fetchListingsBySeller).not.toHaveBeenCalled();
    expect(result.current.listings).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);

    rerender({ key: '' });
    await waitFor(() => expect(result.current.listings).toEqual([]));
    expect(fetchListingsBySeller).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('forwards seller key and market, then exposes the listings', async () => {
    const rows = [listing('a'), listing('b')];
    vi.mocked(fetchListingsBySeller).mockResolvedValue({ data: rows, error: null });
    const { result } = renderHook(() => useSellerListings('seller-1', 'JO'));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchListingsBySeller).toHaveBeenCalledWith('seller-1', 'JO');
    expect(result.current.listings).toEqual(rows);
    expect(result.current.error).toBeNull();
  });

  it('exposes the service error and clears listings', async () => {
    vi.mocked(fetchListingsBySeller).mockResolvedValue({ data: null, error: 'rpc down' });
    const { result } = renderHook(() => useSellerListings('seller-1', 'SA'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('rpc down');
    expect(result.current.listings).toEqual([]);
  });

  it('ignores a stale response after the seller identity changes', async () => {
    const first = deferred<SellerListingsResult>();
    const second = deferred<SellerListingsResult>();
    vi.mocked(fetchListingsBySeller)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { result, rerender } = renderHook(
      ({ key }: { key: string }) => useSellerListings(key, 'JO'),
      { initialProps: { key: 'seller-a' } },
    );
    rerender({ key: 'seller-b' });
    await act(async () => {
      first.resolve({ data: [listing('from-a')], error: null });
    });
    expect(result.current.listings).toEqual([]);
    await act(async () => {
      second.resolve({ data: [listing('from-b')], error: null });
    });
    await waitFor(() => expect(result.current.listings.map((l) => l.id)).toEqual(['from-b']));
    expect(fetchListingsBySeller).toHaveBeenNthCalledWith(1, 'seller-a', 'JO');
    expect(fetchListingsBySeller).toHaveBeenNthCalledWith(2, 'seller-b', 'JO');
  });

  it('ignores a stale response after the market changes', async () => {
    const first = deferred<SellerListingsResult>();
    const second = deferred<SellerListingsResult>();
    vi.mocked(fetchListingsBySeller)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { result, rerender } = renderHook(
      ({ market }: { market: string | null }) => useSellerListings('seller-1', market),
      { initialProps: { market: 'JO' } },
    );
    rerender({ market: 'LB' });
    await act(async () => {
      first.resolve({ data: [listing('jo-row', 'JO')], error: null });
    });
    expect(result.current.listings).toEqual([]);
    await act(async () => {
      second.resolve({ data: [listing('lb-row', 'LB')], error: null });
    });
    await waitFor(() => expect(result.current.listings.map((l) => l.id)).toEqual(['lb-row']));
    expect(fetchListingsBySeller).toHaveBeenNthCalledWith(1, 'seller-1', 'JO');
    expect(fetchListingsBySeller).toHaveBeenNthCalledWith(2, 'seller-1', 'LB');
  });

  it('passes a null market through without defaulting to JO', async () => {
    vi.mocked(fetchListingsBySeller).mockResolvedValue({ data: [listing('any')], error: null });
    const { result } = renderHook(() => useSellerListings('seller-1', null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchListingsBySeller).toHaveBeenCalledWith('seller-1', null);
    expect(result.current.listings.map((l) => l.id)).toEqual(['any']);
  });

  it('cancels an in-flight request when the seller key is cleared', async () => {
    const pending = deferred<SellerListingsResult>();
    vi.mocked(fetchListingsBySeller).mockReturnValue(pending.promise);
    const { result, rerender } = renderHook(
      ({ key }: { key: string | null }) => useSellerListings(key, 'JO'),
      { initialProps: { key: 'seller-1' } },
    );
    expect(result.current.isLoading).toBe(true);
    rerender({ key: null });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toEqual([]);
    await act(async () => {
      pending.resolve({ data: [listing('stale')], error: null });
    });
    expect(result.current.listings).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
