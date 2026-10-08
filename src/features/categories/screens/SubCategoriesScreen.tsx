import React, { useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { useListings } from '@/hooks/useListings';
import { categoryBySlug, categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { SubcategoryDef } from '@/types';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { ParentCategoryBanner } from '../components/ParentCategoryBanner';
import { SubCategoriesList } from '../components/SubCategoriesList';

export const SubCategoriesScreen: React.FC = () => {
  const {
    isArabic,
    goBack,
    navigateTo,
    setActiveTab,
    setCategoryFilter,
    selectedParentCategory,
    browseCountryCode,
  } = useUI();
  const { t } = useTranslation();
  const { listings } = useListings();

  const parentSlug = selectedParentCategory || categories[0].slug;
  const parentCategory = useMemo(() => categoryBySlug(parentSlug), [parentSlug]);
  const childSubcategories: SubcategoryDef[] = useMemo(
    () => subcategoriesByCategory(parentSlug),
    [parentSlug]
  );

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const countryListings = useMemo(
    () => filterListingsByMarket(listings, browseCountryCode),
    [listings, browseCountryCode]
  );

  const totalParentListings = useMemo(
    () => countryListings.filter((l) => l.categorySlug === parentSlug).length,
    [countryListings, parentSlug]
  );

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    countryListings.forEach((l) => {
      if (l.subcategorySlug) {
        counts[l.subcategorySlug] = (counts[l.subcategorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [countryListings]);

  const handleSelectSubCategory = useCallback(
    (subSlug: string) => {
      setCategoryFilter(subSlug);
      setActiveTab('explore');
      navigateTo('main');
    },
    [setCategoryFilter, setActiveTab, navigateTo]
  );

  const handleSelectAllParentCategory = useCallback(() => {
    setCategoryFilter(parentSlug);
    setActiveTab('explore');
    navigateTo('main');
  }, [setCategoryFilter, parentSlug, setActiveTab, navigateTo]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23E5E7EB"/></svg>';
    },
    []
  );

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`max-w-[440px] mx-auto w-full min-h-screen bg-surface flex flex-col pb-24 ${
        isArabic ? 'font-cairo' : ''
      }`}
    >
      {/* Top Header Navigation Bar */}
      <div className="sticky top-0 z-30 bg-brand border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center cursor-pointer active:scale-95">
            <BackIcon size={18} variant="Linear" color="#FFFFFF" />
          </button>
          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white font-cairo leading-snug">
              {isArabic ? parentCategory.nameAr : parentCategory.nameEn}
            </h1>
            <span className="text-[11px] text-white/70 font-medium font-cairo">
              {childSubcategories.length} {isArabic ? 'تصنيفات فرعية متاحة' : 'available sub-categories'}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface/15 overflow-hidden shrink-0 flex items-center justify-center">
          <img src={parentCategory.asset} alt={parentCategory.nameEn} className="w-full h-full object-cover" onError={handleImageError} />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <ParentCategoryBanner
          parentCategory={parentCategory}
          totalParentListings={totalParentListings}
          isArabic={isArabic}
          t={t}
          handleSelectAllParentCategory={handleSelectAllParentCategory}
        />

        {/* Sub-Categories Section Header */}
        <div className="pt-2 px-1 flex items-center justify-between">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider font-cairo">
            {t('categories.subcategoriesTitle')}
          </h2>
        </div>

        <SubCategoriesList
          childSubcategories={childSubcategories}
          subcategoryCounts={subcategoryCounts}
          isArabic={isArabic}
          t={t}
          handleSelectSubCategory={handleSelectSubCategory}
        />
      </div>
    </div>
  );
};
