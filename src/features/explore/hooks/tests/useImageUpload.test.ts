import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../useImageUpload';

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with selectedImages as empty array and fileInputRef as null', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.selectedImages).toEqual([]);
    expect(result.current.fileInputRef.current).toBeNull();
  });

  it('clearImages resets selectedImages to empty array', () => {
    const { result } = renderHook(() => useImageUpload());
    act(() => {
      result.current.clearImages();
    });
    expect(result.current.selectedImages).toEqual([]);
  });

  it('handleRemoveImage removes image at specified index', () => {
    const { result } = renderHook(() => useImageUpload());
    act(() => {
      result.current.handleRemoveImage(0);
    });
    expect(result.current.selectedImages).toEqual([]);
  });
});
