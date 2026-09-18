import React from 'react';
import { Layers, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryDef } from '@/types';

interface ParentCategoryBannerProps {
  parentCategory: CategoryDef;
  totalParentListings: number;
  isArabic: boolean;
  t: (key: string) => string;
  handleSelectAllParentCategory: () => void;
}

export const ParentCategoryBanner: React.FC<ParentCategoryBannerProps> = ({
  parentCategory,
  totalParentListings,
  isArabic,
  t,
  handleSelectAllParentCategory,
}) => {
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="flex flex-col gap-3">
      {/* Parent Category Banner Card */}
      <div className="bg-surface rounded-2xl p-4 border border-border flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-soft font-cairo">
              {isArabic ? 'القسم الرئيسي' : 'Primary Category'}
            </div>
            <div className="text-sm font-bold text-ink font-cairo">
              {isArabic ? parentCategory.nameAr : parentCategory.nameEn}
            </div>
          </div>
        </div>
        <span className="text-xs font-bold text-primary bg-surface border border-border px-3 py-1.5 rounded-full font-cairo">
          {totalParentListings} {isArabic ? 'إعلان متاح' : 'active ads'}
        </span>
      </div>

      {/* View All In Parent Category Quick Bar */}
      <button
        type="button"
        onClick={handleSelectAllParentCategory}
        className="w-full bg-ink text-white rounded-2xl p-4 flex items-center justify-between hover:bg-neutral-900 active:scale-[0.99] transition-all shadow-sm group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-accent" />
          <span className="font-cairo font-bold text-sm text-white">
            {t('categories.viewAllInParent')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted font-semibold font-cairo">
            {totalParentListings} {t('categories.listingsCount')}
          </span>
          <ChevronIcon
            size={16}
            className="text-accent transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          />
        </div>
      </button>
    </div>
  );
};
