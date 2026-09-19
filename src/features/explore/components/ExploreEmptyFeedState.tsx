import React from 'react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { ShoppingBag } from 'iconsax-react';

export interface ExploreEmptyFeedStateProps {
  isArabic: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const ExploreEmptyFeedState: React.FC<ExploreEmptyFeedStateProps> = React.memo(({
  isArabic, hasActiveFilters, onResetFilters,
}) => (
  <EmptyState
    icon={<ShoppingBag size={40} variant="Linear" color="#64748B" />}
    title={isArabic ? 'لا توجد نتائج تطابق فلاتر البحث الحالية' : 'No listings match current search filters'}
    description={
      isArabic
        ? 'جرب تعديل السعر الأقصى أو اختيار قسم أو منطقة أخرى، أو مسح الفلاتر لعرض كافة الإعلانات.'
        : 'Try adjusting your max price limit, selecting another category or area, or clearing filters.'
    }
    action={
      hasActiveFilters ? (
        <Button variant="secondary" size="md" onClick={onResetFilters}>
          {isArabic ? 'إعادة ضبط فلاتر البحث' : 'Reset Search Filters'}
        </Button>
      ) : undefined
    }
  />
));

ExploreEmptyFeedState.displayName = 'ExploreEmptyFeedState';
