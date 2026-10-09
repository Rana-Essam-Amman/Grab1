import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Setting4 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { useUI } from '@/hooks/useUI';
import { FilterSection } from '../components/filters/FilterSection';
import { CategoryFilterSection } from '../components/filters/CategoryFilterSection';
import { SortFilterSection } from '../components/filters/SortFilterSection';
import { PriceRangeFilterSection } from '../components/filters/PriceRangeFilterSection';
import { LocationFilterSection } from '../components/filters/LocationFilterSection';
import { CategoryAttrsSection } from '../components/filters/CategoryAttrsSection';
import { FiltersFooter } from '../components/filters/FiltersFooter';
import { useShareFilters } from '../hooks/useShareFilters';
import type { SortBy } from '@/shared/router/filterParams';
import { BrandMark } from '@/shared/components/BrandMark';
import { filterListings } from '@/shared/lib/filterListings';
import { useListings } from '@/hooks/useListings';
export const FiltersScreen: React.FC = () => {
  const {
    isArabic, goBack, navigateTo, setActiveTab,
    categoryFilter, subcategoryFilter, sortBy,
    minPriceFilter, maxPriceFilter, neighborhoodFilter, attrsFilter,
    setCategoryFilter, setSubcategoryFilter, setSortBy,
    setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setAttrsFilter,
    activeCurrency, browseCountryCode, browseCityEn, setBrowseLocation,
  } = useUI();
  const [draftCategory, setDraftCategory] = useState<string | null>(categoryFilter);
  const [draftSub, setDraftSub] = useState<string | null>(subcategoryFilter);
  const [draftSort, setDraftSort] = useState<SortBy>(sortBy);
  const [draftMin, setDraftMin] = useState<number | null>(minPriceFilter);
  const [draftMax, setDraftMax] = useState<number | null>(maxPriceFilter);
  const [draftCity, setDraftCity] = useState<string>(browseCityEn);
  const [draftNeigh, setDraftNeigh] = useState<string | null>(neighborhoodFilter);
  const [draftAttrs, setDraftAttrs] = useState<Record<string, string>>(attrsFilter);
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const catCount = draftCategory ? 1 + (draftSub ? 1 : 0) : 0;
  const sortActive = draftSort !== 'newest';
  const priceActive = draftMin !== null || draftMax !== null;
  const locActive = draftNeigh !== null ? 1 : 0;
  const attrsActive = Object.keys(draftAttrs).length;
  const { listings } = useListings();
  const previewCount = useMemo(() => filterListings(listings, {
    market: browseCountryCode, searchQuery: '', categorySlug: draftSub ?? draftCategory, minPrice: draftMin, maxPrice: draftMax,
    neighborhood: draftNeigh, filterMode: 'all', sortBy: draftSort, attrs: draftAttrs,
  }).length, [listings, browseCountryCode, draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftSort, draftAttrs]);
  const handleApply = useCallback(() => {
    setCategoryFilter(draftCategory);
    setSubcategoryFilter(draftSub);
    setSortBy(draftSort);
    setMinPriceFilter(draftMin);
    setMaxPriceFilter(draftMax);
    setNeighborhoodFilter(draftNeigh);
    setAttrsFilter(draftAttrs);
    setActiveTab('explore');
    navigateTo('main');
  }, [draftCategory, draftSub, draftSort, draftMin, draftMax, draftNeigh, draftAttrs, setCategoryFilter, setSubcategoryFilter, setSortBy, setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setAttrsFilter, setActiveTab, navigateTo]);

  const handleAttrChange = useCallback((key: string, value: string | null) => {
    setDraftAttrs((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const handleShare = useShareFilters({
    isArabic, browseCountryCode, draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftSort, draftAttrs,
  });
  const handleReset = useCallback(() => {
    setDraftCategory(null);
    setDraftSub(null);
    setDraftSort('newest');
    setDraftMin(null);
    setDraftMax(null);
    setDraftNeigh(null);
    setDraftAttrs({});
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-canvas" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="px-4 py-3 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label={isArabic ? 'رجوع' : 'Back'} className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <Setting4 size={20} variant="Bold" color="#FFFFFF" />
        <h1 className="text-base font-bold text-white flex-1">{isArabic ? 'فلترة' : 'Filters'}</h1>
        <BrandMark isArabic={isArabic} />
      </header>

      <div className="flex-1 flex flex-col gap-3 p-4 pb-32">
        <FilterSection isArabic={isArabic} title={isArabic ? 'القسم' : 'Category'} activeCount={catCount}>
          <CategoryFilterSection
            isArabic={isArabic}
            activeCategory={draftCategory}
            activeSubcategory={draftSub}
            onCategoryChange={(slug) => { setDraftCategory(slug); setDraftAttrs({}); }}
            onSubcategoryChange={setDraftSub}
          />
        </FilterSection>

        <FilterSection isArabic={isArabic} title={isArabic ? 'السعر' : 'Price'} activeCount={priceActive ? 1 : 0}>
          <PriceRangeFilterSection
            isArabic={isArabic}
            minPrice={draftMin}
            maxPrice={draftMax}
            currencySymbol={activeCurrency}
            onChange={(mn, mx) => { setDraftMin(mn); setDraftMax(mx); }}
          />
        </FilterSection>

        {draftCategory && (
          <FilterSection isArabic={isArabic} title={isArabic ? 'المواصفات' : 'Specifications'} activeCount={attrsActive}>
            <CategoryAttrsSection
              isArabic={isArabic}
              categorySlug={draftCategory}
              subcategorySlug={draftSub}
              attrs={draftAttrs}
              onChange={handleAttrChange}
            />
          </FilterSection>
        )}

        <FilterSection isArabic={isArabic} title={isArabic ? 'الموقع' : 'Location'} activeCount={locActive}>
          <LocationFilterSection
            isArabic={isArabic}
            countryCode={browseCountryCode}
            activeCity={draftCity}
            activeNeighborhood={draftNeigh}
            onCityChange={(cityEn, cityAr) => { setDraftCity(cityEn); setBrowseLocation(browseCountryCode, cityEn, cityAr); setDraftNeigh(null); }}
            onNeighborhoodChange={setDraftNeigh}
          />
        </FilterSection>

        <FilterSection isArabic={isArabic} title={isArabic ? 'الترتيب' : 'Sort by'} activeCount={sortActive ? 1 : 0}>
          <SortFilterSection isArabic={isArabic} activeSort={draftSort} onChange={setDraftSort} />
        </FilterSection>
      </div>

      <FiltersFooter
        isArabic={isArabic}
        previewCount={previewCount}
        onReset={handleReset}
        onShare={handleShare}
        onApply={handleApply}
      />
    </div>
  );
};
