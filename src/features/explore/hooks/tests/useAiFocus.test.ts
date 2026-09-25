import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiFocus } from '../useAiFocus';
import { useUIStore } from '@/store/ui.slice';

describe('useAiFocus', () => {
  beforeEach(() => {
    useUIStore.setState({
      isAiFocused: false,
    });
  });

  it('initializes with isFocused false', () => {
    const { result } = renderHook(() => useAiFocus());
    expect(result.current.isFocused).toBe(false);
    expect(useUIStore.getState().isAiFocused).toBe(false);
  });

  it('handleFocus sets isFocused to true and updates useUI store', () => {
    const { result } = renderHook(() => useAiFocus());
    act(() => {
      result.current.handleFocus();
    });
    expect(result.current.isFocused).toBe(true);
    expect(useUIStore.getState().isAiFocused).toBe(true);
  });

  it('handleBlur sets isFocused to false and updates useUI store', () => {
    useUIStore.setState({ isAiFocused: true });
    const { result } = renderHook(() => useAiFocus());
    act(() => {
      result.current.handleFocus();
    });
    expect(result.current.isFocused).toBe(true);

    act(() => {
      result.current.handleBlur();
    });
    expect(result.current.isFocused).toBe(false);
    expect(useUIStore.getState().isAiFocused).toBe(false);
  });
});
