import React from 'react';
import { Warning2, Add } from 'iconsax-react';
import type { AiResponse } from '../hooks/useAiAssistant.types';

export interface AiResponseCardProps {
  response: AiResponse | null;
  onDismiss: () => void;
  isArabic: boolean;
}

export const AiResponseCard: React.FC<AiResponseCardProps> = ({ response, onDismiss, isArabic }) => {
  if (!response) return null;

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="w-full max-w-[440px] mx-auto bg-surface rounded-2xl shadow-xs border border-border p-3 mt-2 animate-in fade-in slide-in-from-top-2 relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 end-2 p-1 text-ink-muted hover:text-ink transition-colors rounded-full hover:bg-background cursor-pointer"
      >
        <Add size={14} variant="Linear" color="#64748B" className="rotate-45" />
      </button>
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <Warning2 size={16} variant="Linear" color="#E57E25" />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="text-sm font-bold text-ink mb-1">
            {isArabic ? 'نتائج التحليل' : 'Analysis Results'}
          </h4>
          <pre className="text-xs text-ink-soft whitespace-pre-wrap overflow-x-auto bg-background p-2 rounded-lg border border-border">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
