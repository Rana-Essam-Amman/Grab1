import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import { useUIStore } from '@/store/ui.slice';
import { globalStorage } from '@/shared/lib/marketStorage';

describe('useTheme', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    }
    useUIStore.setState({ theme: 'light' });
    globalStorage().set('grab_theme_v1', 'light');
  });

  it('exposes initial theme from store', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggle flips theme and persists to globalStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).toBe('dark');
    expect(globalStorage().get('grab_theme_v1')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme applies new theme and persists to globalStorage', () => {
    useUIStore.setState({ theme: 'dark' });
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.theme).toBe('light');
    expect(globalStorage().get('grab_theme_v1')).toBe('light');
  });
});
