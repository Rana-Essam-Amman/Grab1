import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

describe('useLoginForm', () => {
  beforeEach(() => {
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO' });
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registeredUsers: [],
    });
  });

  it('starts with empty phone/password, no error, password hidden', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.phone).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.showPassword).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('handleToggleShowPassword flips showPassword', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleToggleShowPassword();
    });
    expect(result.current.showPassword).toBe(true);
    act(() => {
      result.current.handleToggleShowPassword();
    });
    expect(result.current.showPassword).toBe(false);
  });

  it('handleLoginSubmit with invalid phone sets error and no auth change', async () => {
    const { result } = renderHook(() => useLoginForm());
    await act(async () => {
      await result.current.handleLoginSubmit({ preventDefault: vi.fn() } as never);
    });
    expect(result.current.error).not.toBe('');
    expect(useAuthStore.getState().authStatus).toBe('unauthenticated');
  });
});
