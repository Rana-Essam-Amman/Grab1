import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileActions } from '../useProfileActions';
import { useUIStore } from '@/store/ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from '@/shared/lib/supabase';

describe('useProfileActions', () => {
  beforeEach(() => {
    useUIStore.setState({
      isArabic: true,
      activeTab: 'profile',
      currentScreen: 'profile',
      screenHistory: ['main', 'profile'],
    });
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: { id: 'u1', name: 'Test', phone: '791234567' } as never,
      sessionToken: 'token-abc',
    });
    vi.clearAllMocks();
  });

  it('handleLogout clears auth and navigates to main with explore tab', () => {
    const { result } = renderHook(() => useProfileActions());
    act(() => {
      result.current.handleLogout();
    });
    expect(useAuthStore.getState().authStatus).toBe('unauthenticated');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useUIStore.getState().currentScreen).toBe('main');
    expect(useUIStore.getState().activeTab).toBe('explore');
  });

  it('handleDeleteAccount succeeds and navigates only after server confirmation', async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account', { method: 'POST' });
    expect(useAuthStore.getState().authStatus).toBe('unauthenticated');
    expect(useUIStore.getState().currentScreen).toBe('main');
    expect(result.current.deleteError).toBeNull();
  });

  it('handleDeleteAccount keeps error and does not navigate on failure', async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: null,
      error: { message: 'Invalid token' },
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(result.current.deleteError).toBeTruthy();
    expect(useAuthStore.getState().authStatus).toBe('authenticated');
    expect(useUIStore.getState().currentScreen).toBe('profile');
  });

  it('prevents duplicate submissions while deleting', async () => {
    let resolveInvoke: (v: unknown) => void;
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => { resolveInvoke = resolve; }),
    );

    const { result } = renderHook(() => useProfileActions());
    const p1 = result.current.handleDeleteAccount();
    const p2 = result.current.handleDeleteAccount();

    expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);

    resolveInvoke!({ data: { success: true }, error: null });
    await act(async () => {
      await p1;
      await p2;
    });
  });
});
