import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAiCapture } from '../useAiCapture';

const mockProcessPublishFlow = vi.fn().mockResolvedValue(undefined);
const mockClearImages = vi.fn();
const mockHandleImageSelect = vi.fn();
const mockHandleRemoveImage = vi.fn();
const mockHandleVoiceToggle = vi.fn();

let mockImages: string[] = [];

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({ isArabic: false }),
}));

vi.mock('@/shared/ai/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    selectedImages: mockImages,
    fileInputRef: { current: null },
    handleImageSelect: mockHandleImageSelect,
    handleRemoveImage: mockHandleRemoveImage,
    clearImages: mockClearImages,
  }),
}));

vi.mock('@/shared/ai/hooks/useVoiceCapture', () => ({
  useVoiceCapture: () => ({
    isRecording: false,
    recordingTime: 0,
    handleVoiceToggle: mockHandleVoiceToggle,
    isSupported: true,
    errorMsg: null,
  }),
}));

vi.mock('@/features/post-wizard/hooks/useAiPublishFlow', () => ({
  useAiPublishFlow: () => ({ processPublishFlow: mockProcessPublishFlow }),
}));

describe('useAiCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImages = [];
  });

  it('canSubmit is false when no photo and no text', () => {
    const { result } = renderHook(() => useAiCapture());
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.hasPhoto).toBe(false);
    expect(result.current.hasText).toBe(false);
  });

  it('hasPhoto true when images >= 1', () => {
    mockImages = ['a.jpg'];
    const { result } = renderHook(() => useAiCapture());
    expect(result.current.hasPhoto).toBe(true);
  });

  it('handleGenerate is a no-op when canSubmit false', async () => {
    const { result } = renderHook(() => useAiCapture());
    await act(async () => {
      await result.current.handleGenerate();
    });
    expect(mockProcessPublishFlow).not.toHaveBeenCalled();
  });
});
