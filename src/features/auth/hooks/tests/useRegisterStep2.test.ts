import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegisterStep2 } from '../useRegisterStep2';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

const mockOnSuccess = vi.fn();
const mockOnToast = vi.fn();

const defaultProps = {
  stagedPhone: '791234567',
  stagedPassword: 'Pass123!',
  stagedEmail: 'test@example.com',
  stagedFirstName: 'Test',
  stagedCountry: 'JO' as const,
  secureToken: 'TOKEN-123',
  onSuccess: mockOnSuccess,
  onToast: mockOnToast,
};

describe('useRegisterStep2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({ isArabic: true });
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registeredUsers: [],
    });
  });

  it('starts with subPhase="sending", loading=false, no error', () => {
    const { result } = renderHook(() => useRegisterStep2(defaultProps));
    expect(result.current.subPhase).toBe('sending');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('handleRegisterStep3Activate calls registerNewUser', async () => {
    const { result } = renderHook(() => useRegisterStep2(defaultProps));
    await act(async () => {
      await result.current.handleRegisterStep3Activate();
    });
    expect(useAuthStore.getState().registeredUsers.length).toBeGreaterThan(0);
  });

  it('handleRegisterStep3Activate calls onSuccess after activation', async () => {
    const { result } = renderHook(() => useRegisterStep2(defaultProps));
    await act(async () => {
      await result.current.handleRegisterStep3Activate();
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
