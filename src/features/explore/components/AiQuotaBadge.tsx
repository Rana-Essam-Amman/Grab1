import React from 'react';
import { Gift, Flash } from 'iconsax-react';

export interface AiQuotaBadgeProps {
  quota: number;
  onOpenShareModal: () => void;
  isArabic: boolean;
}

export const AiQuotaBadge: React.FC<AiQuotaBadgeProps> = ({ quota, onOpenShareModal, isArabic }) => {
  if (quota <= 0) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200 font-cairo mt-2">
        <button
          type="button"
          onClick={onOpenShareModal}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/25 to-primary/15 border border-primary/50 text-primary hover:text-primary-hover hover:border-primary shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer"
        >
          <Gift size={16} variant="Linear" color="#E57E25" className="shrink-0 animate-bounce" />
          <span className="text-xs sm:text-sm font-extrabold text-ink">
            {isArabic
              ? 'اضغط هنا للحصول على ٥ محاولات ذكية إضافية فوراً مجاناً! 🎁'
              : 'Click here to get 5 additional smart attempts instantly for free! 🎁'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={quota <= 2 ? onOpenShareModal : undefined}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border font-cairo select-none transition-colors ${
        quota <= 2
          ? 'bg-danger/10 border-danger/20 text-danger cursor-pointer animate-pulse'
          : 'bg-primary/5 border-primary/10 text-primary/90'
      }`}
    >
      {quota <= 2 ? (
        <Gift size={10} variant="Bold" color="#EF4444" className="text-danger" />
      ) : (
        <Flash size={10} variant="Bold" color="#EAB308" className="text-icon-yellow" />
      )}
      <span>{isArabic ? `${quota}/5 رصيد اليوم` : `${quota}/5 credits`}</span>
    </div>
  );
};
