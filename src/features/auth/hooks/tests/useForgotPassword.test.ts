import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForgotPassword } from '../useForgotPassword';
import { useUIStore } from '@/store/ui.slice';

describe('useForgotPassword', () => {
  beforeEach(() => {
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO' });
  });

  it('starts with empty fields, no error, not loading', () => {
    const { result } = renderHook(() => useForgotPassword());
    expect(result.current.phone).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedCountry).toBe('JO');
  });

  it('handlePhoneChange updates phone and clears error', () => {
    const { result } = renderHook(() => useForgotPassword());
    act(() => {
      result.current.handlePhoneChange({ target: { value: '791234567' } } as never);
    });
    expect(result.current.phone).toBe('791234567');
    expect(result.current.error).toBe('');
  });

  it('handleForgotPasswordReset with empty inputs sets error', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.handleForgotPasswordReset({ preventDefault: vi.fn() } as never);
    });
    expect(result.current.error).not.toBe('');
    expect(result.current.successMsg).toBe('');
  });
});
