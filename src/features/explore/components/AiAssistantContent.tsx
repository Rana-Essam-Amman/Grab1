import React from 'react';
import { AiInputTextarea } from './AiInputTextarea';
import { AiThumbnailStrip } from './AiThumbnailStrip';
import { AiAssistantControls } from './AiAssistantControls';
import { AiPostSuggestion } from './AiPostSuggestion';
import type { SuggestionState } from '../hooks/useAiSuggestion';

export interface AiAssistantContentProps {
  readonly isArabic: boolean;
  readonly isFocused: boolean;
  readonly query: string;
  readonly onQueryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly onFocus: () => void;
  readonly onBlur: () => void;
  readonly onSend: () => void;
  readonly isAnalyzing: boolean;
  readonly images: readonly string[];
  readonly onRemoveImage: (index: number) => void;
  readonly quota: number;
  readonly isRecording: boolean;
  readonly recordingTime: number;
  readonly onOpenShareModal: () => void;
  readonly onCameraClick: (e: React.MouseEvent) => void;
  readonly onMicToggle: (e: React.MouseEvent) => void;
  readonly suggestion: SuggestionState | null;
  readonly onSuggestionAccept: () => void;
  readonly onSuggestionDismiss: () => void;
  readonly hint?: string | null;
}

export const AiAssistantContent: React.FC<AiAssistantContentProps> = ({
  isArabic,
  isFocused,
  query,
  onQueryChange,
  onFocus,
  onBlur,
  onSend,
  isAnalyzing,
  images,
  onRemoveImage,
  quota,
  isRecording,
  recordingTime,
  onOpenShareModal,
  onCameraClick,
  onMicToggle,
  suggestion,
  onSuggestionAccept,
  onSuggestionDismiss,
  hint,
}) => {
  return (
    <>
      {suggestion && (
        <AiPostSuggestion
          state={suggestion}
          onAccept={onSuggestionAccept}
          onDismiss={onSuggestionDismiss}
          isArabic={isArabic}
        />
      )}
      <div
        className={
          'w-full max-w-[440px] bg-surface rounded-2xl border border-line shadow-xs relative transition-all duration-300 p-3 mb-3 font-cairo ' +
          (isFocused ? 'ring-2 ring-primary/25 scale-[1.01] z-30 border-primary' : 'z-20')
        }
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <AiThumbnailStrip images={images as string[]} onRemove={onRemoveImage} />
        {hint && (
          <p className="text-[11px] text-ink-soft px-1 pb-1 font-cairo animate-in fade-in">
            {hint}
          </p>
        )}
        <AiInputTextarea
          value={query}
          onChange={onQueryChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSend={onSend}
          disabled={isAnalyzing}
          isArabic={isArabic}
          placeholderOverride={
            isAnalyzing ? (isArabic ? 'جاري التحليل...' : 'Analyzing...') : undefined
          }
        />
        <AiAssistantControls
          quota={quota}
          isRecording={isRecording}
          recordingTime={recordingTime}
          canSend={!!query.trim() || images.length > 0}
          disabled={isAnalyzing}
          isArabic={isArabic}
          imageCount={images.length}
          onOpenShareModal={onOpenShareModal}
          onCameraClick={onCameraClick}
          onMicToggle={onMicToggle}
          onSend={onSend}
        />
      </div>
    </>
  );
};
