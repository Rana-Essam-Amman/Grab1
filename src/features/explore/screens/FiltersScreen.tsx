import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Setting4, Refresh } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { useUI } from '@/hooks/useUI';
import { FilterSection } from '../components/filters/FilterSection';
import { CategoryFilterSection } from '../components/filters/CategoryFilterSection';
import { SortFilterSection } from '../components/filters/SortFilterSection';
import type { SortBy } from '@/shared/router/filterParams';

export const FiltersScreen: React.FC = () => {
  const {
    isArabic, goBack, navigateTo, setActiveTab,
    categoryFilter, subcategoryFilter, sortBy,
    setCategoryFilter, setSubcategoryFilter, setSortBy,
  } = useUI();

  const [draftCategory, setDraftCategory] = useState<string | null>(categoryFilter);
  const [draftSub, setDraftSub] = useState<string | null>(subcategoryFilter);
  const [draftSort, setDraftSort] = useState<SortBy>(sortBy);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const catCount = draftCategory ? 1 + (draftSub ? 1 : 0) : 0;
  const sortActive = draftSort !== 'newest';

  const handleApply = useCallback(() => {
    setCategoryFilter(draftCategory);
    setSubcategoryFilter(draftSub);
    setSortBy(draftSort);
    setActiveTab('explore');
    navigateTo('main');
  }, [draftCategory, draftSub, draftSort, setCategoryFilter, setSubcategoryFilter, setSortBy, setActiveTab, navigateTo]);

  const handleReset = useCallback(() => {
    setDraftCategory(null);
    setDraftSub(null);
    setDraftSort('newest');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-canvas" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="px-4 py-3 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label={isArabic ? 'رجوع' : 'Back'} className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <Setting4 size={20} variant="Bold" color="#FFFFFF" />
        <h1 className="text-base font-bold text-white flex-1">{isArabic ? 'فلترة' : 'Filters'}</h1>
      </header>

      <div className="flex-1 flex flex-col gap-3 p-4 pb-32">
        <FilterSection isArabic={isArabic} title={isArabic ? 'القسم' : 'Category'} activeCount={catCount}>
          <CategoryFilterSection
            isArabic={isArabic}
            activeCategory={draftCategory}
            activeSubcategory={draftSub}
            onCategoryChange={setDraftCategory}
            onSubcategoryChange={setDraftSub}
          />
        </FilterSection>

        <FilterSection isArabic={isArabic} title={isArabic ? 'الترتيب' : 'Sort by'} activeCount={sortActive ? 1 : 0}>
          <SortFilterSection isArabic={isArabic} activeSort={draftSort} onChange={setDraftSort} />
        </FilterSection>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-3 bg-surface border-t border-border flex items-center gap-2.5 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleReset}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-ink hover:bg-canvas transition-colors shrink-0"
          aria-label={isArabic ? 'تصفير' : 'Reset'}
        >
          <Refresh size={18} variant="Linear" color="currentColor" />
        </button>
        <Button variant="primary" size="lg" fullWidth onClick={handleApply}>
          {isArabic ? 'عرض النتائج' : 'Show results'}
        </Button>
      </div>
    </div>
  );
};
