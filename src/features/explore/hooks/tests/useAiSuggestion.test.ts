import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAiSuggestion } from '../useAiSuggestion';

describe('useAiSuggestion', () => {
  it('initial state: suggestion=null, isDismissed=false', () => {
    const { result } = renderHook(() => useAiSuggestion());
    expect(result.current.suggestion).toBeNull();
    expect(result.current.isDismissed).toBe(false);
  });

  it('evaluate("بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف") → suggestion set, confidence ≥ 0.75', () => {
    const { result } = renderHook(() => useAiSuggestion());
    const text = 'بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف';
    
    act(() => {
      result.current.evaluate(text);
    });

    expect(result.current.suggestion).not.toBeNull();
    expect(result.current.suggestion?.rawText).toBe(text);
    expect(result.current.suggestion!.confidence).toBeGreaterThanOrEqual(0.75);
  });

  it('evaluate("بدي سيارة كامري") → suggestion stays null', () => {
    const { result } = renderHook(() => useAiSuggestion());
    
    act(() => {
      result.current.evaluate('بدي سيارة كامري');
    });

    expect(result.current.suggestion).toBeNull();
  });

  it('dismiss() → suggestion=null, isDismissed=true', () => {
    const { result } = renderHook(() => useAiSuggestion());
    
    act(() => {
      result.current.evaluate('بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف');
    });
    expect(result.current.suggestion).not.toBeNull();

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.isDismissed).toBe(true);
  });

  it('evaluate after dismiss → silent (suggestion remains null)', () => {
    const { result } = renderHook(() => useAiSuggestion());
    
    act(() => {
      result.current.dismiss();
    });

    act(() => {
      result.current.evaluate('بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف');
    });

    expect(result.current.suggestion).toBeNull();
  });

  it('clear() → suggestion=null, isDismissed unchanged', () => {
    const { result } = renderHook(() => useAiSuggestion());
    
    act(() => {
      result.current.evaluate('بدي أبيعها كامري 2020 بحالة ممتازة 12 ألف');
    });
    expect(result.current.suggestion).not.toBeNull();

    act(() => {
      result.current.clear();
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.isDismissed).toBe(false);
  });
});
