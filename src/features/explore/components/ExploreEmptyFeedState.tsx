import React from 'react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { ShoppingBag, SearchNormal1 } from 'iconsax-react';

export interface ExploreEmptyFeedStateProps {
  readonly isArabic: boolean;
  readonly hasActiveFilters: boolean;
  readonly activeSearchText?: string;
  readonly onResetFilters: () => void;
  readonly onPostWithSearch?: () => void;
  readonly onExpandSearch?: () => void;
}

export const ExploreEmptyFeedState: React.FC<ExploreEmptyFeedStateProps> = React.memo(({
  isArabic, hasActiveFilters, activeSearchText, onResetFilters, onExpandSearch,
}) => {
  if (activeSearchText) {
    return (
      <EmptyState
        icon={<SearchNormal1 size={40} variant="Linear" color="#64748B" />}
        title={isArabic ? `لا نتائج لـ "${activeSearchText}"` : `No results for "${activeSearchText}"`}
        description={
          isArabic ? 'جرّب كلمات أخرى، أو انشر إعلانك' : 'Try other keywords, or post your own'
        }
        action={
          <div className="flex flex-col gap-2 w-full max-w-[240px] mx-auto">
            <Button variant="primary" size="md" onClick={onExpandSearch}>
              {isArabic ? 'وسّع البحث لكل الدولة' : 'Search all country'}
            </Button>
            <Button variant="ghost" size="md" onClick={onResetFilters}>
              {isArabic ? 'مسح البحث' : 'Clear search'}
            </Button>
          </div>
        }
      />
    );
  }

  if (hasActiveFilters) {
    return (
      <EmptyState
        icon={<ShoppingBag size={40} variant="Linear" color="#64748B" />}
        title={isArabic ? 'لا توجد نتائج تطابق فلاتر البحث الحالية' : 'No listings match current search filters'}
        description={
          isArabic
            ? 'جرب تعديل السعر الأقصى أو اختيار قسم أو منطقة أخرى، أو مسح الفلاتر لعرض كافة الإعلانات.'
            : 'Try adjusting your max price limit, selecting another category or area, or clearing filters.'
        }
        action={
          <Button variant="secondary" size="md" onClick={onResetFilters}>
            {isArabic ? 'إعادة ضبط فلاتر البحث' : 'Reset Search Filters'}
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={<ShoppingBag size={40} variant="Linear" color="#64748B" />}
      title={isArabic ? 'لا إعلانات متوفرة حالياً' : 'No listings available at the moment'}
    />
  );
});

ExploreEmptyFeedState.displayName = 'ExploreEmptyFeedState';
