import { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useImageUpload } from '@/shared/ai/hooks/useImageUpload';
import { useVoiceCapture } from '@/shared/ai/hooks/useVoiceCapture';
import { useAiPublishFlow } from './useAiPublishFlow';

export const useAiCapture = () => {
  const { isArabic, browseCountryCode } = useUI();
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    selectedImages: images,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    clearImages,
  } = useImageUpload();

  const handleTranscript = useCallback((text: string) => {
    setRawText((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const {
    isRecording, recordingTime, isWarning, interimText,
    handleVoiceToggle, isSupported, errorMsg,
  } = useVoiceCapture(
    handleTranscript,
    browseCountryCode,
    isArabic
  );

  const { processPublishFlow } = useAiPublishFlow(setIsAnalyzing);

  const hasPhoto = images.length >= 1;
  const hasText = rawText.trim().length >= 3;
  const canSubmit = hasPhoto && hasText;

  const handleGenerate = useCallback(async () => {
    if (!canSubmit) return;
    await processPublishFlow(rawText, images, () => {
      clearImages();
      setRawText('');
    });
  }, [canSubmit, processPublishFlow, rawText, images, clearImages]);

  return {
    images,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    clearImages,
    rawText,
    setRawText,
    isRecording,
    recordingTime,
    isWarning,
    interimText,
    handleVoiceToggle,
    isSupported,
    errorMsg,
    isAnalyzing,
    canSubmit,
    hasPhoto,
    hasText,
    handleGenerate,
  };
};
