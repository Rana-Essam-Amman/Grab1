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
  // تفعيل خاصية الاختفاء عند السكرول لتحت
  const isVisible = useScrollDirection();

  return (
    <div
      className={`px-4 pt-[calc(0.5rem+var(--safe-top,0px))] pb-2 bg-brand border-b border-white/20 flex items-center justify-between gap-2 sticky top-0 z-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. اللوجو واسم التطبيق (يمين في العربي) */}
      <div className="flex items-center gap-2 shrink-0">
        <img
          src="/assets/icons/logo.png"
          alt="FOX Marketplace"
          className="w-10 h-10 object-cover rounded-full shrink-0 mix-blend-lighten"
        />
        <div className="flex flex-col justify-center items-start">
          <span className="text-[18px] font-black text-white font-cairo tracking-[2px] leading-none m-0">FOX</span>
          <span className="text-[7px] font-semibold text-white tracking-[3px] uppercase leading-none mt-1">Marketplace</span>
        </div>
      </div>

      {/* 2. معلومات الخطوة (في المنتصف) */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 text-center px-1">
        {step !== undefined && totalSteps !== undefined && (
          <div className="text-[11px] text-white/80 font-medium">
            {isArabic ? `الخطوة ${step} من ${totalSteps}` : `Step ${step} of ${totalSteps}`}
          </div>
        )}
        <h2 className="text-white font-bold text-sm truncate w-full m-0 leading-tight mt-0.5">
          {isArabic ? titleAr : titleEn}
        </h2>
        {(subtitleAr || subtitleEn) && (
          <div className="text-[10px] text-white/70 truncate w-full mt-0.5">
            {isArabic ? subtitleAr : subtitleEn}
          </div>
        )}
        {(categoryNameAr || categoryNameEn) && (
          <div className="text-[10px] text-white/70 truncate w-full flex justify-center items-center gap-1 mt-0.5">
            <span>{isArabic ? categoryNameAr : categoryNameEn}</span>
            {(subcategoryNameAr || subcategoryNameEn) && (
              <>
                <span>‹</span>
                <span>{isArabic ? subcategoryNameAr : subcategoryNameEn}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. صورة القسم + زرار الرجوع (شمال في العربي) */}
      <div className="flex items-center gap-2 shrink-0">
        {categoryAsset && (
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white/5 p-1 flex items-center justify-center">
            <Icon icon={categoryAsset} width={22} height={22} className="object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors shrink-0"
          aria-label={isArabic ? 'رجوع' : 'Back'}
        >
          <BackIcon size={20} color="#FFFFFF" variant="Linear" />
        </button>
      </div>
    </div>
  );
};
