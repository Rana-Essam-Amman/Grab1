import React from 'react';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';

export interface CategoryFilterSectionProps {
  readonly isArabic: boolean;
  readonly activeCategory: string | null;
  readonly activeSubcategory: string | null;
  readonly onCategoryChange: (slug: string | null) => void;
  readonly onSubcategoryChange: (slug: string | null) => void;
}

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  isArabic, activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange,
}) => {
  const subs = activeCategory ? subcategoriesByCategory(activeCategory) : [];
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => { onCategoryChange(null); onSubcategoryChange(null); }}
        className={`w-full h-11 rounded-full flex items-center justify-center px-4 text-sm font-bold transition-all active:scale-[0.98] ${
          !activeCategory ? 'bg-brand text-white' : 'bg-canvas text-ink'
        }`}
      >
        {isArabic ? 'جميع الأقسام' : 'All categories'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => { onCategoryChange(cat.slug); onSubcategoryChange(null); }}
              className={`h-12 rounded-2xl flex items-center gap-2 px-3 text-xs font-bold transition-all active:scale-[0.98] ${
                isActive ? 'bg-brand text-white' : 'bg-canvas text-ink'
              }`}
            >
              <img src={cat.asset} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" decoding="async" />
              <span className="truncate text-start">{isArabic ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {activeCategory && subs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            type="button"
            onClick={() => onSubcategoryChange(null)}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
              !activeSubcategory ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          {subs.map((sub) => {
            const isActive = activeSubcategory === sub.slug;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onSubcategoryChange(isActive ? null : sub.slug)}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
                }`}
              >
                {isArabic ? sub.nameAr : sub.nameEn}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
