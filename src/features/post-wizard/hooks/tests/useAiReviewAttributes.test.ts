import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAiReviewAttributes } from '../useAiReviewAttributes';

describe('useAiReviewAttributes', () => {
  it('injects brand options for make/brand key', () => {
    const fields = [{ key: 'make', label: 'Make', value: '' }];
    const { result } = renderHook(() =>
      useAiReviewAttributes('motors', fields, false, 'cars')
    );
    const makeField = result.current.find((f) => f.key === 'make');
    expect(makeField).toBeDefined();
    expect(makeField?.type).toBe('select');
    expect((makeField?.options?.length ?? 0)).toBeGreaterThan(0);
  });

  it('injects model options only when brand is set', () => {
    const fields = [
      { key: 'make', label: 'Make', value: 'toyota' },
      { key: 'model', label: 'Model', value: '' },
    ];
    const { result } = renderHook(() =>
      useAiReviewAttributes('motors', fields, false, 'cars')
    );
    const modelField = result.current.find((f) => f.key === 'model');
    expect(modelField?.type).toBe('cascading-model');
    expect(modelField?.dependsOn).toBe('make');
  });

  it('leaves non-brand/model fields unchanged', () => {
    const fields = [{ key: 'year', label: 'Year', value: '2020' }];
    const { result } = renderHook(() =>
      useAiReviewAttributes('motors', fields, false, 'cars')
    );
    const yearField = result.current.find((f) => f.key === 'year');
    expect(yearField?.type).toBe('select');
    expect(yearField?.value).toBe('2020');
  });
});
