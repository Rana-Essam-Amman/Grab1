import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthProviders } from '../useAuthProviders';

describe('useAuthProviders', () => {
  it('detects web as default platform in jsdom', () => {
    const { result } = renderHook(() => useAuthProviders());
    expect(result.current.platform).toBe('web');
  });

  it('returns a non-empty providers list', () => {
    const { result } = renderHook(() => useAuthProviders());
    expect(result.current.providers.length).toBeGreaterThan(0);
  });

  it('returns a stable reference across re-renders (useMemo)', () => {
    const { result, rerender } = renderHook(() => useAuthProviders());
    const first = result.current.providers;
    rerender();
    expect(result.current.providers).toBe(first);
  });
});
