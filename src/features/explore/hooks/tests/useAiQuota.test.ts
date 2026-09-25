import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiQuota } from '../useAiQuota';
import { useUIStore } from '@/store/ui.slice';
import { marketStorage } from '@/shared/lib/marketStorage';

describe('useAiQuota', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({
      browseCountryCode: 'JO',
    });
  });

  it('initializes quota to 5 when storage is empty', () => {
    const { result } = renderHook(() => useAiQuota());
    expect(result.current.quota).toBe(5);
    expect(result.current.shareModalOpen).toBe(false);
  });

  it('consumeQuota returns true and decrements quota by 1', () => {
    const { result } = renderHook(() => useAiQuota());
    let ok: boolean | undefined;
    act(() => {
      ok = result.current.consumeQuota();
    });
    expect(ok).toBe(true);
    expect(result.current.quota).toBe(4);
  });

  it('consumeQuota at quota 0 returns false and opens share modal', () => {
    marketStorage('JO').set('ai_quota_v1', { credits: 0 });
    const { result } = renderHook(() => useAiQuota());
    expect(result.current.quota).toBe(0);

    let ok: boolean | undefined;
    act(() => {
      ok = result.current.consumeQuota();
    });
    expect(ok).toBe(false);
    expect(result.current.quota).toBe(0);
    expect(result.current.shareModalOpen).toBe(true);
  });
});
