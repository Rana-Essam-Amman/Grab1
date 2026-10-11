import React from 'react';

export interface SubcategoryChipsProps {
  readonly isArabic: boolean;
  readonly subs: ReadonlyArray<{ slug: string; nameAr: string; nameEn: string }>;
  readonly activeSubcategory: string | null;
  readonly onSubcategoryChange: (slug: string | null) => void;
}

export const SubcategoryChips: React.FC<SubcategoryChipsProps> = ({
  isArabic, subs, activeSubcategory, onSubcategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      <button
        type="button"
        data-testid="filter-sub-all"
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
            data-testid="filter-sub-option"
            data-slug={sub.slug}
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
  );
};
