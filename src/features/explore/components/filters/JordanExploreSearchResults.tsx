import React from 'react';
import { searchJordanLocations, JordanLocationSearchResult } from '@/features/post-wizard/helpers/jordanLocationIndex';

interface Props {
  readonly query: string;
  readonly isArabic: boolean;
  readonly onSelect: (item: JordanLocationSearchResult) => void;
}

export const JordanExploreSearchResults: React.FC<Props> = ({ query, isArabic, onSelect }) => {
  const results = searchJordanLocations(query, isArabic);

  if (results.length === 0) {
    return (
      <div className="p-3 text-center text-xs text-ink-muted">
        {isArabic ? 'لا توجد نتائج مطابقة' : 'No matching locations found'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 p-1" data-testid="jordan-explore-search-results">
      <span className="text-xs font-bold text-ink-muted px-1">
        {isArabic ? 'النتائج المباشرة' : 'Direct Results'}
      </span>
      {results.map((item) => {
        const label = isArabic ? item.nameAr : item.nameEn;
        const parent = isArabic ? item.parentPathAr : item.parentPathEn;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="flex flex-col items-start p-2.5 rounded-xl border border-border bg-surface hover:bg-canvas text-start cursor-pointer transition-colors"
            data-testid={`jordan-filter-result-${item.id}`}
          >
            <span className="text-xs font-bold text-ink">{label}</span>
            <span className="text-[10px] text-ink-muted">{parent}</span>
          </button>
        );
      })}
    </div>
  );
};
