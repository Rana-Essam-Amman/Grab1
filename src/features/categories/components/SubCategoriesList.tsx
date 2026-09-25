import React from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { SubcategoryDef } from '@/types';

interface SubCategoriesListProps {
  childSubcategories: SubcategoryDef[];
  subcategoryCounts: Record<string, number>;
  isArabic: boolean;
  t: (key: string) => string;
  handleSelectSubCategory: (subSlug: string) => void;
}

export const SubCategoriesList: React.FC<SubCategoriesListProps> = ({
  childSubcategories,
  subcategoryCounts,
  isArabic,
  t,
  handleSelectSubCategory,
}) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

  return (
    <div className="flex flex-col gap-2.5">
      {childSubcategories.map((sub) => {
        const subCount = subcategoryCounts[sub.slug] || 0;
        return (
          <button
            key={sub.slug}
            type="button"
            onClick={() => handleSelectSubCategory(sub.slug)}
            className="w-full bg-surface rounded-2xl p-4 flex items-center justify-between border border-border hover:border-primary hover:bg-surface active:scale-[0.99] transition-all shadow-2xs group cursor-pointer text-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors shrink-0" />
              <span className="font-cairo font-bold text-ink text-sm group-hover:text-primary transition-colors">
                {isArabic ? sub.nameAr : sub.nameEn}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-ink-muted font-semibold bg-background px-2.5 py-1 rounded-full font-cairo group-hover:bg-border transition-colors">
                {subCount} {t('categories.listingsCount')}
              </span>
              <ChevronIcon
                size={18}
                variant="Linear"
                className="text-ink-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};
