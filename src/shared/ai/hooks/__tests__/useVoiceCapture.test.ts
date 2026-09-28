import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceCapture } from '../useVoiceCapture';

interface MockRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  onresult: ((e: { results: Array<{ 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const MockSpeechRecognition = vi.fn().mockImplementation(function(this: MockRecognitionInstance) {
  this.continuous = false;
  this.interimResults = false;
  this.lang = '';
  this.start = vi.fn();
  this.stop = vi.fn();
  this.onresult = null;
  this.onerror = null;
  this.onend = null;
}) as unknown as {
  new (): MockRecognitionInstance;
  mock: { instances: MockRecognitionInstance[] };
};

describe('useVoiceCapture', () => {
  const mockOnTranscript = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('isSupported is true when SpeechRecognition exists', () => {
    const { result } = renderHook(() => useVoiceCapture(mockOnTranscript, 'SA', false));
    expect(result.current.isSupported).toBe(true);
  });

  it('isSupported is false when speech recognition is absent', () => {
    vi.stubGlobal('SpeechRecognition', undefined);
    vi.stubGlobal('webkitSpeechRecognition', undefined);
    const { result } = renderHook(() => useVoiceCapture(mockOnTranscript, 'SA', false));
    expect(result.current.isSupported).toBe(false);
  });

  it('handleVoiceToggle starts recording when supported', () => {
    const { result } = renderHook(() => useVoiceCapture(mockOnTranscript, 'SA', false));
    act(() => {
      result.current.handleVoiceToggle();
    });
    expect(result.current.isRecording).toBe(true);
    expect(result.current.errorMsg).toBeNull();
  });

  it('error path sets errorMsg and sets isRecording to false', () => {
    const { result } = renderHook(() => useVoiceCapture(mockOnTranscript, 'SA', false));
    act(() => {
      result.current.handleVoiceToggle();
    });
    expect(result.current.isRecording).toBe(true);

    const instances = (MockSpeechRecognition as unknown as { mock: { instances: MockRecognitionInstance[] } }).mock.instances;
    const recognitionInstance = instances[0];
    act(() => {
      if (recognitionInstance && recognitionInstance.onerror) {
        recognitionInstance.onerror({ error: 'not-allowed' });
      }
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.errorMsg).toContain('not-allowed');
  });
});
