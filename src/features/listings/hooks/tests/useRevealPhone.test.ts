import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRevealPhone } from '../useRevealPhone';
import { supabase } from '@/shared/lib/supabase';
import { ensureAnonymousSessionForPhone } from '@/features/auth/services/anonymousSession';
import { toast } from 'sonner';

type SessionResult = { created: boolean; error: string | null };

interface RpcError {
  message: string;
  details: string;
  hint: string;
  code: string;
  name: string;
  toJSON: () => { message: string; details: string; hint: string; code: string };
}

interface RpcSuccess {
  data: string | null;
  error: null;
  success: true;
  count: null;
  status: 200;
  statusText: 'OK';
}

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

function rpcOk(data: string): RpcSuccess {
  return { data, error: null, success: true, count: null, status: 200, statusText: 'OK' };
}

function rpcError(message: string): RpcError {
  return {
    message,
    details: '',
    hint: '',
    code: 'P0001',
    name: 'PostgrestError',
    toJSON: () => ({ message, details: '', hint: '', code: 'P0001' }),
  };
}

describe('useRevealPhone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ensureAnonymousSessionForPhone).mockResolvedValue({ created: false, error: null });
  });

  it('returns the initial phone for its matching listing', () => {
    const { result } = renderHook(() => useRevealPhone('A', '+962700000001', false, 'JO'));
    expect(result.current.phone).toBe('+962700000001');
    expect(result.current.isRevealing).toBe(false);
  });

  it('does not expose listing A phone after rerender as B', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue(rpcOk('+962711111111'));
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
    const session = deferred<SessionResult>();
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
      session.resolve({ created: false, error: null });
      vi.mocked(supabase.rpc).mockResolvedValue(rpcOk('+962711111111'));
      stale = await pending;
    });
    expect(stale).toBeNull();
    expect(result.current.phone).toBeNull();
  });

  it('reveals B with p_listing_id B after switching', async () => {
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce(rpcOk('+962711111111'))
      .mockResolvedValueOnce(rpcOk('+962722222222'));
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
    const aSession = deferred<SessionResult>();
    const bSession = deferred<SessionResult>();
    vi.mocked(ensureAnonymousSessionForPhone)
      .mockReturnValueOnce(aSession.promise)
      .mockReturnValueOnce(bSession.promise);
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useRevealPhone(id, undefined, false, 'JO'),
      { initialProps: { id: 'A' } },
    );
    let pendingA!: Promise<string | null>;
    let pendingB!: Promise<string | null>;
    act(() => {
      pendingA = result.current.revealPhone();
    });
    rerender({ id: 'B' });
    act(() => {
      pendingB = result.current.revealPhone();
    });
    expect(result.current.isRevealing).toBe(true);
    await act(async () => {
      aSession.resolve({ created: false, error: null });
      vi.mocked(supabase.rpc).mockResolvedValue(rpcOk('+962711111111'));
      await pendingA;
    });
    expect(result.current.isRevealing).toBe(true);
    expect(result.current.phone).toBeNull();
    let revealedB = '';
    await act(async () => {
      bSession.resolve({ created: false, error: null });
      vi.mocked(supabase.rpc).mockResolvedValue(rpcOk('+962722222222'));
      revealedB = (await pendingB) || '';
    });
    expect(revealedB).toBe('+962722222222');
    expect(result.current.phone).toBe('+962722222222');
    expect(result.current.isRevealing).toBe(false);
  });

  it('preserves session failure behavior', async () => {
    vi.mocked(ensureAnonymousSessionForPhone).mockResolvedValue({ created: false, error: 'down' });
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
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: rpcError('RATE_LIMIT_EXCEEDED'),
      success: false,
      count: null,
      status: 400,
      statusText: 'Bad Request',
    });
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
