import React from 'react';
import { Camera, Mic, ArrowUp } from 'lucide-react';

export interface AiMediaButtonsProps {
  onCameraClick: (e: React.MouseEvent) => void;
  onMicToggle: (e: React.MouseEvent) => void;
  isRecording: boolean;
  recordingTime: number;
  onSend: () => void;
  canSend: boolean;
  disabled?: boolean;
  isArabic: boolean;
  imageCount?: number;
}

export const AiMediaButtons: React.FC<AiMediaButtonsProps> = ({
  onCameraClick,
  onMicToggle,
  isRecording,
  recordingTime,
  onSend,
  canSend,
  disabled,
  isArabic,
  imageCount = 0,
}) => {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        title={isArabic ? 'إضافة صور' : 'Add Photos'}
        onClick={onCameraClick}
        disabled={disabled}
        className="p-1.5 rounded-full flex items-center gap-1 shrink-0 transition-colors text-icon-blue bg-icon-blue/10 hover:bg-icon-blue/15 active:scale-95 cursor-pointer relative"
      >
        <Camera size={18} className="transition-colors" />
        {imageCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-primary text-white text-[8px] flex items-center justify-center font-extrabold shadow-xs">
            {imageCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onMicToggle}
        disabled={disabled}
        title={isArabic ? 'تحدث بصوتك' : 'Voice Input'}
        className="p-1.5 rounded-full flex items-center justify-center transition-all text-icon-red bg-icon-red/10 hover:bg-icon-red/15 hover:scale-110 active:scale-95 cursor-pointer relative"
      >
        <Mic size={18} className={isRecording ? 'animate-bounce text-icon-red' : ''} />
        {isRecording && (
          <span className="absolute -top-6 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap">
            {25 - recordingTime}s
          </span>
        )}
      </button>

      <button
        type="button"
        disabled={!canSend || disabled}
        onClick={(e) => { e.preventDefault(); onSend(); }}
        title={isArabic ? 'إرسال' : 'Send'}
        className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer ${
          canSend && !disabled
            ? 'bg-icon-blue hover:bg-icon-blue/90 text-white active:scale-90 hover:scale-105'
            : 'bg-background text-ink-muted cursor-not-allowed opacity-60'
        }`}
      >
        <ArrowUp size={15} className="stroke-[2.5]" />
      </button>
    </div>
  );
};
