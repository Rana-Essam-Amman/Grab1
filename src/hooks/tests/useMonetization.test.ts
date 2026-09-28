import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMonetization } from '../useMonetization';
import { useMonetizationStore } from '@/features/monetization/store/monetization.slice';

describe('useMonetization', () => {
  beforeEach(() => {
    useMonetizationStore.setState({ isQuotaExhausted: false });
  });

  it('starts with isQuotaExhausted = false', () => {
    const { result } = renderHook(() => useMonetization());
    expect(result.current.isQuotaExhausted).toBe(false);
  });

  it('setIsQuotaExhausted(true) flips the flag', () => {
    const { result } = renderHook(() => useMonetization());
    act(() => {
      result.current.setIsQuotaExhausted(true);
    });
    expect(result.current.isQuotaExhausted).toBe(true);
  });

  it('setIsQuotaExhausted(false) resets the flag', () => {
    useMonetizationStore.setState({ isQuotaExhausted: true });
    const { result } = renderHook(() => useMonetization());
    act(() => {
      result.current.setIsQuotaExhausted(false);
    });
    expect(result.current.isQuotaExhausted).toBe(false);
  });

  it('validateAdQuotaAvailability is a function', () => {
    const { result } = renderHook(() => useMonetization());
    expect(typeof result.current.validateAdQuotaAvailability).toBe('function');
  });

  it('validateAdQuotaAvailability returns a boolean', () => {
    const { result } = renderHook(() => useMonetization());
    const out = result.current.validateAdQuotaAvailability('motors');
    expect(typeof out).toBe('boolean');
  });
});
