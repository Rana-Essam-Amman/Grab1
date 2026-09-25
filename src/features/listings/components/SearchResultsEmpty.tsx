import React from 'react';
import { SearchNormal1 } from 'iconsax-react';

interface SearchResultsEmptyProps {
  readonly isArabic: boolean;
}

export const SearchResultsEmpty: React.FC<SearchResultsEmptyProps> = ({ isArabic }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
      <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-ink-muted">
        <SearchNormal1 size={22} variant="Linear" />
      </div>
      <div className="text-sm font-bold text-ink">
        {isArabic ? 'لا توجد نتائج في بلدك الحالي' : 'No results found in your current country'}
      </div>
      <p className="text-xs text-ink-muted max-w-xs">
        {isArabic
          ? 'جرب البحث بكلمات أخرى أو اختر قسماً عاماً'
          : 'Try adjusting your search terms or clearing category filters'}
      </p>
    </div>
  );
};
