import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchMissingListing } from '../useFetchMissingListing';
import { supabase } from '@/shared/lib/supabase';
import type { Listing } from '@/types';

vi.mock('@/shared/lib/supabase', () => ({
  supabase: { from: vi.fn() },
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

function mockSingle(result: Promise<{ data: Listing | null; error: { code?: string; message?: string } | null }>) {
  const single = vi.fn(() => result);
  const eq = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ select });
  return { single, eq, select };
}

function makeListing(overrides: Partial<Listing>): Listing {
  return {
    id: 'remote-1',
    title: 'Remote car',
    description: 'desc',
    price: '100',
    currency: 'JOD',
    countryCode: 'JO',
    city: 'Amman',
    neighborhood: 'Khalda',
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    imageUrl: '/assets/listings/car.jpg',
    images: ['/assets/listings/car.jpg'],
    sellerPhone: '',
    sellerName: 'Sam',
    createdAt: '2026-01-01T00:00:00.000Z',
    views: 0,
    attributes: [],
    status: 'active',
    ...overrides,
  };
}

describe('useFetchMissingListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stays loading and does not resolve while the remote request is pending', async () => {
    const gate = deferred<{ data: Listing | null; error: null }>();
    mockSingle(gate.promise);
    const { result } = renderHook(() => useFetchMissingListing('remote-1', null));
    await waitFor(() => expect(result.current.status).toBe('loading'));
    expect(result.current.listing).toBeNull();
    gate.resolve({ data: makeListing({ id: 'remote-1' }), error: null });
    await waitFor(() => expect(result.current.status).toBe('found'));
    expect(result.current.listing?.id).toBe('remote-1');
  });

  it('returns not_found only after the lookup completes with no row', async () => {
    mockSingle(Promise.resolve({ data: null, error: { code: 'PGRST116', message: '0 rows' } }));
    const { result } = renderHook(() => useFetchMissingListing('missing-1', null));
    await waitFor(() => expect(result.current.status).toBe('not_found'));
    expect(result.current.listing).toBeNull();
  });

  it('returns error on a real request failure, not not_found', async () => {
    mockSingle(Promise.resolve({ data: null, error: { code: '500', message: 'Internal server error' } }));
    const { result } = renderHook(() => useFetchMissingListing('boom-1', null));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.status).not.toBe('not_found');
  });

  it('does not fetch when a local listing is already available', async () => {
    const from = vi.fn();
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(from);
    const local = makeListing({ id: 'local-1' });
    const { result } = renderHook(() => useFetchMissingListing('local-1', local));
    expect(result.current.status).toBe('idle');
    expect(result.current.listing).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it('ignores a stale response after the listing id changes', async () => {
    const first = deferred<{ data: Listing | null; error: null }>();
    const second = deferred<{ data: Listing | null; error: null }>();
    const single = vi.fn()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const eq = vi.fn(() => ({ single }));
    const select = vi.fn(() => ({ eq }));
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ select });

    const { result, rerender } = renderHook(
      ({ id }) => useFetchMissingListing(id, null),
      { initialProps: { id: 'A' } },
    );
    await waitFor(() => expect(result.current.status).toBe('loading'));

    rerender({ id: 'B' });
    await waitFor(() => expect(eq).toHaveBeenCalledTimes(2));

    await act(async () => {
      first.resolve({ data: makeListing({ id: 'A' }), error: null });
    });
    expect(result.current.listing?.id).not.toBe('A');

    await act(async () => {
      second.resolve({ data: makeListing({ id: 'B', title: 'B listing' }), error: null });
    });
    await waitFor(() => expect(result.current.status).toBe('found'));
    expect(result.current.listing?.id).toBe('B');
  });
});
