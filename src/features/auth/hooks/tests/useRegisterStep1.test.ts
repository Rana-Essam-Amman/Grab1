import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegisterStep1 } from '../useRegisterStep1';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

describe('useRegisterStep1', () => {
  const onStage = vi.fn();
  const onToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO' });
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registeredUsers: [],
    });
  });

  it('starts with empty fields and no error', () => {
    const { result } = renderHook(() =>
      useRegisterStep1({ onStageCredentials: onStage, onToast })
    );
    expect(result.current.firstName).toBe('');
    expect(result.current.phone).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.selectedCountry).toBe('JO');
  });

  it('handleFirstNameChange updates firstName and clears error', () => {
    const { result } = renderHook(() =>
      useRegisterStep1({ onStageCredentials: onStage, onToast })
    );
    act(() => {
      result.current.handleFirstNameChange({ target: { value: 'Test' } } as never);
    });
    expect(result.current.firstName).toBe('Test');
    expect(result.current.error).toBe('');
  });

  it('handleRegisterUnified with invalid phone sets error and does not call onStage', () => {
    const { result } = renderHook(() =>
      useRegisterStep1({ onStageCredentials: onStage, onToast })
    );
    act(() => {
      result.current.handleRegisterUnified({ preventDefault: vi.fn() } as never);
    });
    expect(result.current.error).not.toBe('');
    expect(onStage).not.toHaveBeenCalled();
  });
});
