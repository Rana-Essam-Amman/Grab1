import React from 'react';
import { AiQuotaBadge } from './AiQuotaBadge';
import { AiMediaButtons } from './AiMediaButtons';

interface AiAssistantControlsProps {
  readonly quota: number;
  readonly isRecording: boolean;
  readonly recordingTime: number;
  readonly canSend: boolean;
  readonly disabled: boolean;
  readonly isArabic: boolean;
  readonly imageCount: number;
  readonly onOpenShareModal: () => void;
  readonly onCameraClick: (e: React.MouseEvent) => void;
  readonly onMicToggle: (e: React.MouseEvent) => void;
  readonly onSend: () => void;
}

export const AiAssistantControls: React.FC<AiAssistantControlsProps> = ({
  quota,
  isRecording,
  recordingTime,
  canSend,
  disabled,
  isArabic,
  imageCount,
  onOpenShareModal,
  onCameraClick,
  onMicToggle,
  onSend,
}) => {
  return (
    <div className="flex items-center justify-between mt-2 pt-1 border-t border-line/40">
      <AiQuotaBadge quota={quota} onOpenShareModal={onOpenShareModal} isArabic={isArabic} />
      <AiMediaButtons
        onCameraClick={onCameraClick}
        onMicToggle={onMicToggle}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onSend={onSend}
        canSend={canSend}
        disabled={disabled}
        isArabic={isArabic}
        imageCount={imageCount}
      />
    </div>
  );
};
