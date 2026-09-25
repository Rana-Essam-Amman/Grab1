import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AiCaptureScreen } from '../AiCaptureScreen';

const mockUseAiCaptureReturn = {
  images: [] as string[],
  fileInputRef: { current: null },
  handleImageSelect: vi.fn(),
  handleRemoveImage: vi.fn(),
  clearImages: vi.fn(),
  rawText: '',
  setRawText: vi.fn(),
  isRecording: false,
  recordingTime: 0,
  handleVoiceToggle: vi.fn(),
  isSupported: true,
  errorMsg: null as string | null,
  isAnalyzing: false,
  canSubmit: false,
  hasPhoto: false,
  hasText: false,
  handleGenerate: vi.fn(),
};

vi.mock('../../hooks/useAiCapture', () => ({
  useAiCapture: () => mockUseAiCaptureReturn,
}));

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: vi.fn(),
  }),
}));

describe('AiCaptureScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAiCaptureReturn.images = [];
    mockUseAiCaptureReturn.rawText = '';
    mockUseAiCaptureReturn.isSupported = true;
    mockUseAiCaptureReturn.errorMsg = null;
    mockUseAiCaptureReturn.canSubmit = false;
    mockUseAiCaptureReturn.hasPhoto = false;
    mockUseAiCaptureReturn.hasText = false;
  });

  it('renders photo grid, voice button, and generate button', () => {
    render(<AiCaptureScreen />);
    expect(screen.getByText('Item Photos (Required)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /speak to describe/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate listing/i })).toBeInTheDocument();
  });

  it('generate button is disabled when canSubmit is false', () => {
    render(<AiCaptureScreen />);
    const generateBtn = screen.getByRole('button', { name: /generate listing/i });
    expect(generateBtn).toBeDisabled();
  });

  it('voice button shows "Coming soon" when !isSupported', () => {
    mockUseAiCaptureReturn.isSupported = false;
    render(<AiCaptureScreen />);
    expect(screen.getByRole('button', { name: /coming soon/i })).toBeInTheDocument();
  });

  it('errorMsg renders when present', () => {
    mockUseAiCaptureReturn.errorMsg = 'Microphone permission denied';
    render(<AiCaptureScreen />);
    expect(screen.getByText('Microphone permission denied')).toBeInTheDocument();
  });
});
