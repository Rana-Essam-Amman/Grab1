import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';
import { signInWithEmailPassword } from '../../services/authService';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import { useUIStore } from '@/store/ui.slice';

vi.mock('../../services/authService', () => ({
  signInWithEmailPassword: vi.fn(),
}));

const mockSignIn = vi.mocked(signInWithEmailPassword);

const changeInput = (value: string) =>
  ({ target: { value } }) as React.ChangeEvent<HTMLInputElement>;

const submitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.FormEvent;

const authenticatedUser = {
  id: 'user-1',
  firstName: 'Seller',
  lastName: '',
  email: 'seller@example.com',
  phone: '',
  countryCode: 'JO',
};

describe('useLoginForm', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO' });
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
      registeredUsers: [],
    });
  });

  it('starts with empty email/password, no error, loading=false, password hidden', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.showPassword).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('toggle showPassword flips its value', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.handleToggleShowPassword());
    expect(result.current.showPassword).toBe(true);
    act(() => result.current.handleToggleShowPassword());
    expect(result.current.showPassword).toBe(false);
  });

  it('empty email sets a validation error without calling the service', async () => {
    const { result } = renderHook(() => useLoginForm());
    await act(async () => {
      await result.current.handleLoginSubmit(submitEvent());
    });
    expect(result.current.error).not.toBe('');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('invalid email format sets a validation error without calling the service', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.handleEmailChange(changeInput('not-an-email')));
    await act(async () => {
      await result.current.handleLoginSubmit(submitEvent());
    });
    expect(result.current.error).not.toBe('');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('empty password with valid email sets an error without calling the service', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.handleEmailChange(changeInput('seller@example.com')));
    await act(async () => {
      await result.current.handleLoginSubmit(submitEvent());
    });
    expect(result.current.error).toBe('يرجى إدخال كلمة المرور');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('failed authentication sets the localized error and leaves session unchanged', async () => {
    mockSignIn.mockResolvedValue({
      success: false,
      errorMessageAr: 'البريد أو كلمة المرور غير صحيحة',
      errorMessageEn: 'Invalid email or password',
    });
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleEmailChange(changeInput('seller@example.com'));
      result.current.handlePasswordChange(changeInput('wrong-password'));
    });
    await act(async () => {
      await result.current.handleLoginSubmit(submitEvent());
    });
    expect(result.current.error).toBe('البريد أو كلمة المرور غير صحيحة');
    expect(useAuthStore.getState().sessionToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('successful authentication calls the service once and shows success toast', async () => {
    mockSignIn.mockImplementation(async () => {
      useAuthStore.setState({
        user: authenticatedUser,
        sessionToken: 'test-session',
        authStatus: 'authenticated',
      });
      return { success: true, userId: 'user-1', email: 'seller@example.com' };
    });
    const onToast = vi.fn();
    const { result } = renderHook(() => useLoginForm({ onToast }));
    act(() => {
      result.current.handleEmailChange(changeInput('seller@example.com'));
      result.current.handlePasswordChange(changeInput('correct-password'));
    });
    await act(async () => {
      await result.current.handleLoginSubmit(submitEvent());
    });
    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith('seller@example.com', 'correct-password');
    expect(onToast).toHaveBeenCalledWith('تم تسجيل الدخول بنجاح');
  });

  it('sets loading during the authentication request and clears it afterward', async () => {
    let resolveSignIn!: (value: {
      success: boolean;
      userId?: string;
      email?: string;
      errorMessageAr?: string;
      errorMessageEn?: string;
    }) => void;
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => { resolveSignIn = resolve; })
    );

    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleEmailChange(changeInput('seller@example.com'));
      result.current.handlePasswordChange(changeInput('correct-password'));
    });

    let submitPromise!: Promise<void>;
    await act(async () => {
      submitPromise = result.current.handleLoginSubmit(submitEvent());
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      useAuthStore.setState({
        user: authenticatedUser,
        sessionToken: 'test-session',
        authStatus: 'authenticated',
      });
      resolveSignIn({ success: true, userId: 'user-1' });
      await submitPromise;
    });
    expect(result.current.loading).toBe(false);
  });
});
