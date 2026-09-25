import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '@/features/auth/store/auth.slice';

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({
      authStatus: 'unauthenticated',
      user: null,
      sessionToken: null,
    });
  });

  it('exposes unauthenticated status by default', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.authStatus).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
    expect(result.current.registered).toBe(false);
  });

  it('loginDirectly sets user + session + authenticated', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.loginDirectly('test@example.com', '791234567', 'JO', 'Test');
    });
    expect(result.current.authStatus).toBe('authenticated');
    expect(result.current.user).not.toBeNull();
    expect(result.current.sessionToken).toBeTruthy();
  });

  it('registered is true when user + sessionToken both present', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: { firstName: 'Test', lastName: 'User', email: 'test@x.com', phone: '123', countryCode: 'JO' },
      sessionToken: 'tok-abc',
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.registered).toBe(true);
  });

  it('logout clears user + session + status', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: { firstName: 'Test', lastName: 'User', email: 'test@x.com', phone: '123', countryCode: 'JO' },
      sessionToken: 'tok-abc',
    });
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.logout();
    });
    expect(result.current.authStatus).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
    expect(result.current.sessionToken).toBeNull();
  });

  it('updateUser merges partial fields', () => {
    useAuthStore.setState({
      authStatus: 'authenticated',
      user: { firstName: 'Old', lastName: 'User', email: 'a@b.com', phone: '123', countryCode: 'JO' },
      sessionToken: 'tok',
    });
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.updateUser({ firstName: 'New' });
    });
    expect(result.current.user?.firstName).toBe('New');
    expect(result.current.user?.email).toBe('a@b.com');
  });
});
