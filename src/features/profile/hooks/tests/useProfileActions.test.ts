import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileActions } from '../useProfileActions';
import { useUIStore } from '@/store/ui.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';

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

  it('handleDeleteAccount writes fingerprint (no crash)', () => {
    const { result } = renderHook(() => useProfileActions());
    expect(() => {
      act(() => {
        result.current.handleDeleteAccount();
      });
    }).not.toThrow();
  });

  it('handleDeleteAccount logs out and redirects to main', () => {
    const { result } = renderHook(() => useProfileActions());
    act(() => {
      result.current.handleDeleteAccount();
    });
    expect(useAuthStore.getState().authStatus).toBe('unauthenticated');
    expect(useUIStore.getState().currentScreen).toBe('main');
  });
});
