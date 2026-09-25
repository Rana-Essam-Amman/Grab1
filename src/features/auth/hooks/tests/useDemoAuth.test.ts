import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDemoAuth } from '../useDemoAuth';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

describe('useDemoAuth', () => {
  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn());
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO' });
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
    });
  });

  it('starts with picker closed', () => {
    const { result } = renderHook(() => useDemoAuth());
    expect(result.current.demoCountryPickerOpen).toBe(false);
  });

  it('setDemoCountryPickerOpen(true) opens the picker', () => {
    const { result } = renderHook(() => useDemoAuth());
    act(() => {
      result.current.setDemoCountryPickerOpen(true);
    });
    expect(result.current.demoCountryPickerOpen).toBe(true);
  });

  it('handleDemoCountrySelect closes picker and triggers auth', () => {
    const { result } = renderHook(() => useDemoAuth());
    act(() => {
      result.current.setDemoCountryPickerOpen(true);
    });
    act(() => {
      result.current.handleDemoCountrySelect('JO');
    });
    expect(result.current.demoCountryPickerOpen).toBe(false);
    expect(useAuthStore.getState().authStatus).toBe('authenticated');
  });
});
