import React from 'react';
import { categories } from '@/data/categories';
import { ArrowRight2, ArrowLeft2 } from 'iconsax-react';

export interface ExploreCategoryGridProps {
  isArabic: boolean;
  onViewAll: () => void;
  onCategoryClick: (slug: string) => void;
  categoryCounts?: Record<string, number>;
}

export const ExploreCategoryGrid: React.FC<ExploreCategoryGridProps> = React.memo(({ isArabic, onViewAll, onCategoryClick }) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;
  return (
    <div className="bg-background rounded-2xl py-3.5 px-1 my-1">
      <div className="flex items-center justify-between px-5 mt-0.5 mb-1">
        <h2 className="text-ink font-cairo text-base font-bold my-0.5">{isArabic ? 'الأقسام' : 'Categories'}</h2>
        <button onClick={onViewAll} className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">
          <span>{isArabic ? 'عرض الكل' : 'View All'}</span>
          <ChevronIcon size={13} variant="Linear" className="w-3.25 h-3.25" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 mt-0.5">
        {categories.slice(0, 6).map((cat) => (
          <button key={cat.slug} onClick={() => onCategoryClick(cat.slug)} className="border-none bg-transparent hover:scale-105 transition-all outline-none cursor-pointer w-[85px] flex flex-col items-center mx-auto">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src={cat.asset}
                alt={isArabic ? cat.nameAr : cat.nameEn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%23f9f8f4"/><text x="30" y="35" font-size="20" text-anchor="middle">🏷️</text></svg>';
                }}
              />
            </div>
            <span className="text-ink font-cairo text-[11px] font-semibold text-center mt-0.5">{isArabic ? cat.nameAr : cat.nameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

ExploreCategoryGrid.displayName = 'ExploreCategoryGrid';
