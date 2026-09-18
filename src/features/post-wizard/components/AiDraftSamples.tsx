import React from 'react';
import { Button } from '@/shared/ui/Button';

interface Props {
  isArabic: boolean;
  samples: { ar: string; en: string }[];
  onSampleClick: (text: string) => void;
}

export const AiDraftSamples: React.FC<Props> = ({ isArabic, samples, onSampleClick }) => {
  return (
    <div className="flex flex-col gap-1.5 px-1">
      <div className="text-[11px] font-bold text-ink uppercase tracking-wider">
        {isArabic ? 'نماذج للتجربة السريعة:' : 'Quick samples to test:'}
      </div>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample, idx) => {
          const sampleText = isArabic ? sample.ar : sample.en;
          return (
            <Button
              key={idx}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSampleClick(sampleText)}
              className="rounded-full bg-background hover:bg-border border-border text-ink-soft text-xs font-bold truncate max-w-full"
            >
              ✨ {sampleText}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
