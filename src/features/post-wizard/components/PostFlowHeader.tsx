import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

interface PostFlowHeaderProps {
  readonly step: number;
  readonly totalSteps?: number;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly subtitleAr?: string;
  readonly subtitleEn?: string;
  readonly isArabic: boolean;
  readonly onBack: () => void;
}

export const PostFlowHeader: React.FC<PostFlowHeaderProps> = ({
  step,
  totalSteps = 6,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  isArabic,
  onBack,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const subtitle = isArabic ? subtitleAr : subtitleEn;
  return (
    <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-[#1a2238] sticky top-0 z-20">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"
        aria-label={isArabic ? 'رجوع' : 'Back'}
      >
        <BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" />
      </Button>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-white/70 truncate">
          {isArabic ? `الخطوة ${step} من ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          {subtitle && <> • {subtitle}</>}
        </div>
        <h2 className="text-lg font-bold text-white truncate">
          {isArabic ? titleAr : titleEn}
        </h2>
      </div>
    </div>
  );
};
