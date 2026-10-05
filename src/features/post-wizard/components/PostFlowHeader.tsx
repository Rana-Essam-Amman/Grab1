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
  readonly categoryAsset?: string;
  readonly categoryNameAr?: string;
  readonly categoryNameEn?: string;
  readonly subcategoryNameAr?: string;
  readonly subcategoryNameEn?: string;
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
  categoryAsset,
  categoryNameAr,
  categoryNameEn,
  subcategoryNameAr,
  subcategoryNameEn,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const subtitle = isArabic ? subtitleAr : subtitleEn;
  const categoryName = isArabic ? categoryNameAr : categoryNameEn;
  const subcategoryName = isArabic ? subcategoryNameAr : subcategoryNameEn;
  const breadcrumb = [categoryName, subcategoryName].filter(Boolean).join(' › ');

  return (
    <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"
        aria-label={isArabic ? 'رجوع' : 'Back'}
      >
        <BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" />
      </Button>
      {categoryAsset && (
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
          <img src={categoryAsset} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-white/70 truncate">
          {isArabic ? `الخطوة ${step} من ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          {subtitle && <> • {subtitle}</>}
        </div>
        <h2 className="text-lg font-bold text-white truncate">
          {isArabic ? titleAr : titleEn}
        </h2>
        {breadcrumb && (
          <div className="text-[11px] text-white/70 truncate mt-0.5">
            {breadcrumb}
          </div>
        )}
      </div>
    </div>
  );
};
