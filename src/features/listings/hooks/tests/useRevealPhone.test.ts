import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRevealPhone } from '../useRevealPhone';
import { supabase } from '@/shared/lib/supabase';
import { ensureAnonymousSessionForPhone } from '@/features/auth/services/anonymousSession';
import { toast } from 'sonner';

vi.mock('@/shared/lib/supabase', () => ({ supabase: { rpc: vi.fn() } }));
vi.mock('@/features/auth/services/anonymousSession', () => ({ ensureAnonymousSessionForPhone: vi.fn() }));
vi.mock('@/shared/lib/phoneFormatting', () => ({
  getFormattedLocalPhone: (value: string) => ({ dialNumber: value }),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useRevealPhone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ensureAnonymousSessionForPhone).mockResolvedValue({ error: null });
  });

  it('returns the initial phone for its matching listing', () => {
    const { result } = renderHook(() => useRevealPhone('A', '+962700000001', false, 'JO'));
    expect(result.current.phone).toBe('+962700000001');
    expect(result.current.isRevealing).toBe(false);
  });

  it('does not expose listing A phone after rerender as B', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({ data: '+962711111111', error: null });
    const { result, rerender } = renderHook(
      ({ id, initial }: { id: string; initial?: string }) => useRevealPhone(id, initial, false, 'JO'),
      { initialProps: { id: 'A', initial: undefined } },
    );
    let revealed = '';
    await act(async () => {
      revealed = (await result.current.revealPhone()) || '';
    });
    expect(revealed).toBe('+962711111111');
    rerender({ id: 'B', initial: undefined });
    expect(result.current.phone).toBeNull();
    expect(result.current.isRevealing).toBe(false);
  });

  it('ignores a stale A response after switching to B', async () => {
    const session = deferred<{ error: null }>();
    vi.mocked(ensureAnonymousSessionForPhone).mockReturnValue(session.promise);
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRevealPhone(id, undefined, false, 'JO'),
      { initialProps: { id: 'A' } },
    );
    let stale: string | null = 'pending';
    let pending!: Promise<string | null>;
    act(() => {
      pending = result.current.revealPhone();
    });
    rerender({ id: 'B' });
    await act(async () => {
      session.resolve({ error: null });
      vi.mocked(supabase.rpc).mockResolvedValue({ data: '+962711111111', error: null });
      stale = await pending;
    });
    expect(stale).toBeNull();
    expect(result.current.phone).toBeNull();
  });

  it('reveals B with p_listing_id B after switching', async () => {
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({ data: '+962711111111', error: null })
      .mockResolvedValueOnce({ data: '+962722222222', error: null });
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRevealPhone(id, undefined, false, 'JO'),
      { initialProps: { id: 'A' } },
    );
    await act(async () => {
      await result.current.revealPhone();
    });
    rerender({ id: 'B' });
    let revealed = '';
    await act(async () => {
      revealed = (await result.current.revealPhone()) || '';
    });
    expect(supabase.rpc).toHaveBeenLastCalledWith('get_listing_phone', { p_listing_id: 'B' });
    expect(revealed).toBe('+962722222222');
    expect(result.current.phone).toBe('+962722222222');
  });

  it('does not let a stale request clear B isRevealing', async () => {
    const aSession = deferred<{ error: null }>();
    const bSession = deferred<{ error: null }>();
    vi.mocked(ensureAnonymousSessionForPhone)
      .mockReturnValueOnce(aSession.promise)
      .mockReturnValueOnce(bSession.promise);
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRevealPhone(id, undefined, false, 'JO'),
      { initialProps: { id: 'A' } },
    );
    let pendingA!: Promise<string | null>;
    act(() => {
      pendingA = result.current.revealPhone();
    });
    rerender({ id: 'B' });
    act(() => {
      void result.current.revealPhone();
    });
    expect(result.current.isRevealing).toBe(true);
    await act(async () => {
      aSession.resolve({ error: null });
      vi.mocked(supabase.rpc).mockResolvedValue({ data: '+962711111111', error: null });
      await pendingA;
    });
    expect(result.current.isRevealing).toBe(true);
    expect(result.current.phone).toBeNull();
    bSession.resolve({ error: null });
  });

  it('preserves session failure behavior', async () => {
    vi.mocked(ensureAnonymousSessionForPhone).mockResolvedValue({ error: new Error('down') });
    const { result } = renderHook(() => useRevealPhone('A', undefined, false, 'JO'));
    let revealed: string | null = 'pending';
    await act(async () => {
      revealed = await result.current.revealPhone();
    });
    expect(revealed).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Connection failed.');
    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(result.current.isRevealing).toBe(false);
  });

  it('preserves RPC failure behavior', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: { message: 'RATE_LIMIT_EXCEEDED' } });
    const { result } = renderHook(() => useRevealPhone('A', undefined, false, 'JO'));
    let revealed: string | null = 'pending';
    await act(async () => {
      revealed = await result.current.revealPhone();
    });
    expect(revealed).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Daily limit for revealing numbers reached (20). Try again tomorrow.');
    expect(result.current.isRevealing).toBe(false);
  });
});
