import React from 'react';
import { Icon } from '@iconify/react';
import { ArrowRight, ArrowLeft } from 'iconsax-react';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection';

interface PostFlowHeaderProps {
  step?: number;
  totalSteps?: number;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  isArabic: boolean;
  onBack: () => void;
  categoryAsset?: string;
  categoryNameAr?: string;
  categoryNameEn?: string;
  subcategoryNameAr?: string;
  subcategoryNameEn?: string;
}

export const PostFlowHeader: React.FC<PostFlowHeaderProps> = ({
  step,
  totalSteps,
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
  // الـ Hook اللي بيخلي الهيدر يختفي بالسكرول
  const isVisible = useScrollDirection();

  return (
    <div
      className={`px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
        aria-label={isArabic ? 'رجوع' : 'Back'}
      >
        <BackIcon size={20} color="#FFFFFF" variant="Linear" />
      </button>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex flex-col min-w-0">
          <h2 className="text-white font-bold text-base truncate">
            {isArabic ? titleAr : titleEn}
          </h2>
          <div className="flex items-center gap-1.5 text-white/70 text-xs mt-0.5">
            {/* عرض الخطوة لو موجودة */}
            {step !== undefined && totalSteps !== undefined && (
              <span>{isArabic ? `الخطوة ${step} من ${totalSteps}` : `Step ${step} of ${totalSteps}`}</span>
            )}
            
            {/* عرض الوصف الفرعي لو موجود */}
            {(subtitleAr || subtitleEn) && (
              <span className="truncate">
                {isArabic ? subtitleAr : subtitleEn}
              </span>
            )}

            {/* عرض القسم لو موجود */}
            {(categoryNameAr || categoryNameEn) && (
              <>
                {(step !== undefined || subtitleAr) && <span>•</span>}
                <span className="truncate">
                  {isArabic ? categoryNameAr : categoryNameEn}
                  {subcategoryNameAr || subcategoryNameEn ? (
                    <span className="opacity-70">
                      {' '}/ {isArabic ? subcategoryNameAr : subcategoryNameEn}
                    </span>
                  ) : null}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {categoryAsset && (
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-white/5 flex items-center justify-center p-1">
          <Icon icon={categoryAsset} width={24} height={24} className="object-contain" />
        </div>
      )}
    </div>
  );
};
