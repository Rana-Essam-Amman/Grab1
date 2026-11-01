import React, { useState, useCallback, useMemo } from 'react';
import { useUI } from '@/hooks/useUI';
import { FilterSection } from '../components/filters/FilterSection';
import { CategoryFilterSection } from '../components/filters/CategoryFilterSection';
import { SortFilterSection } from '../components/filters/SortFilterSection';
import { PriceRangeFilterSection } from '../components/filters/PriceRangeFilterSection';
import { FiltersLocationBlock } from '../components/filters/FiltersLocationBlock';
import { CategoryAttrsSection } from '../components/filters/CategoryAttrsSection';
import { FiltersFooter } from '../components/filters/FiltersFooter';
import { useShareFilters } from '../hooks/useShareFilters';
import { useFiltersUrlSync } from '../hooks/useFiltersUrlSync';
import type { SortBy } from '@/shared/router/filterParams';
import { translateAttrsForDb } from '@/shared/lib/attrsTranslation';
import { filterListings } from '@/shared/lib/filterListings';
import { useListings } from '@/hooks/useListings';
import { commitLocationDraft } from './commitLocationDraft';
import { FiltersHeader } from './FiltersHeader';

export const FiltersScreen: React.FC = () => {
  const {
    isArabic, goBack, navigateTo, setActiveTab,
    categoryFilter, subcategoryFilter, sortBy,
    minPriceFilter, maxPriceFilter, neighborhoodFilter, attrsFilter,
    setCategoryFilter, setSubcategoryFilter, setSortBy,
    setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setAttrsFilter,
    activeCurrency, browseCountryCode, browseCityEn,
    browseGovernorateSlug, browseDistrictSlug, neighborhoodSlugFilter,
  } = useUI();
  const [draftCategory, setDraftCategory] = useState<string | null>(categoryFilter);
  const [draftSub, setDraftSub] = useState<string | null>(subcategoryFilter);
  const [draftSort, setDraftSort] = useState<SortBy>(sortBy);
  const [draftMin, setDraftMin] = useState<number | null>(minPriceFilter);
  const [draftMax, setDraftMax] = useState<number | null>(maxPriceFilter);
  const [draftCity, setDraftCity] = useState<string>(browseCityEn);
  const [draftNeigh, setDraftNeigh] = useState<string | null>(neighborhoodFilter);
  const [draftGov, setDraftGov] = useState<string | null>(browseGovernorateSlug);
  const [draftDist, setDraftDist] = useState<string | null>(browseDistrictSlug);
  const [draftNeighSlug, setDraftNeighSlug] = useState<string | null>(neighborhoodSlugFilter);
  const [draftAttrs, setDraftAttrs] = useState<Record<string, string>>(attrsFilter);
  useFiltersUrlSync(draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftGov, draftDist, draftNeighSlug, draftSort, draftAttrs);
  const catCount = draftCategory ? 1 + (draftSub ? 1 : 0) : 0;
  const sortActive = draftSort !== 'newest';
  const priceActive = draftMin !== null || draftMax !== null;
  const locActive = (draftGov ? 1 : 0) + (draftDist ? 1 : 0) + (draftNeigh ? 1 : 0);
  const attrsActive = Object.keys(draftAttrs).length;
  const { listings } = useListings();
  
  const previewCount = useMemo(() => filterListings(listings, {
    market: browseCountryCode, searchQuery: '', categorySlug: draftSub ?? draftCategory, minPrice: draftMin, maxPrice: draftMax,
    neighborhood: draftNeigh, governorateSlug: draftGov, districtSlug: draftDist, neighborhoodSlug: draftNeighSlug, cityEn: draftCity, filterMode: 'all', sortBy: draftSort, attrs: translateAttrsForDb(draftAttrs, draftCategory, draftSub),
  }).length, [listings, browseCountryCode, draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftGov, draftDist, draftNeighSlug, draftCity, draftSort, draftAttrs]);
  
  const handleApply = useCallback(() => {
    setCategoryFilter(draftCategory);
    setSubcategoryFilter(draftSub);
    setSortBy(draftSort);
    setMinPriceFilter(draftMin);
    setMaxPriceFilter(draftMax);
    setNeighborhoodFilter(draftNeigh);
    setAttrsFilter(draftAttrs);
    commitLocationDraft({ countryCode: browseCountryCode, city: draftCity, governorateSlug: draftGov, districtSlug: draftDist, neighborhoodSlug: draftNeighSlug });
    setActiveTab('explore');
    navigateTo('main');
  }, [draftCategory, draftSub, draftSort, draftMin, draftMax, draftNeigh, draftAttrs, draftCity, draftGov, draftDist, draftNeighSlug, browseCountryCode, setCategoryFilter, setSubcategoryFilter, setSortBy, setMinPriceFilter, setMaxPriceFilter, setNeighborhoodFilter, setAttrsFilter, setActiveTab, navigateTo]);
  
  const handleAttrChange = useCallback((key: string, value: string | null) => {
    setDraftAttrs((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);
  
  const handleShare = useShareFilters({ isArabic, browseCountryCode, draftCategory, draftSub, draftMin, draftMax, draftNeigh, draftGov, draftDist, draftNeighSlug, draftSort, draftAttrs });
  
  const handleReset = useCallback(() => {
    setDraftCategory(null);
    setDraftSub(null);
    setDraftSort('newest');
    setDraftMin(null);
    setDraftMax(null);
    setDraftNeigh(null);
    setDraftCity('');
    setDraftGov(null);
    setDraftDist(null);
    setDraftNeighSlug(null);
    setDraftAttrs({});
  }, []);

  return (
    <div data-testid="filters-screen" className="flex flex-col min-h-screen bg-canvas" dir={isArabic ? 'rtl' : 'ltr'}>
      <FiltersHeader isArabic={isArabic} onBack={goBack} />
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
          <FiltersLocationBlock
            isArabic={isArabic}
            countryCode={browseCountryCode}
            activeNeighborhood={draftNeigh}
            initialGovSlug={draftGov}
            initialDistSlug={draftDist}
            onCityChange={(cityEn) => { setDraftCity(cityEn); setDraftNeigh(null); }}
            onNeighborhoodChange={setDraftNeigh}
            onDraftChange={(draft) => { setDraftGov(draft.governorateSlug); setDraftDist(draft.districtSlug); setDraftNeighSlug(draft.neighborhoodSlug); }}
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
