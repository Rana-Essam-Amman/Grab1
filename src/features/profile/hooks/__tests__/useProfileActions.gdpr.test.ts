import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileActions } from '../useProfileActions';
import { scopedKey } from '@/data/markets/storage';
import {
  ALL_MARKETS,
  USER_GLOBAL_KEYS,
} from '@/shared/lib/userDataRegistry';

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: 'u1', phone: '791234567' },
  }),
}));

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    navigateTo: vi.fn(),
    setActiveTab: vi.fn(),
  }),
}));

import { supabase } from '@/shared/lib/supabase';

describe('GDPR: Account Deletion Completeness', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('does not write catch_deletion_fingerprint on deletion', async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    const keys = Object.keys(localStorage);
    expect(keys.some((k) => k.startsWith('catch_deletion_fingerprint_'))).toBe(false);
  });

  it('clears user-scoped keys only after confirmed success', async () => {
    for (const m of ALL_MARKETS) {
      localStorage.setItem(scopedKey(m, 'wishlist'), JSON.stringify(['x']));
    }
    for (const k of USER_GLOBAL_KEYS) {
      localStorage.setItem(k, '1');
    }

    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    for (const m of ALL_MARKETS) {
      expect(localStorage.getItem(scopedKey(m, 'wishlist'))).toBeNull();
    }
    for (const k of USER_GLOBAL_KEYS) {
      expect(localStorage.getItem(k)).toBeNull();
    }
  });

  it('preserves locale on success', async () => {
    localStorage.setItem('catch_locale', 'en');

    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(localStorage.getItem('catch_locale')).toBe('en');
  });

  it('does not clear data when deletion fails', async () => {
    localStorage.setItem('catch_wishlist', '["x"]');

    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: null,
      error: { message: 'Storage cleanup failed' },
    });

    const { result } = renderHook(() => useProfileActions());
    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(localStorage.getItem('catch_wishlist')).toBe('["x"]');
    expect(result.current.deleteError).toBeTruthy();
  });
});
