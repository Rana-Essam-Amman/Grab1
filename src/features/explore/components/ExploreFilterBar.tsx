import React, { useState, useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { categoryBySlug } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';
import { locations, locationsAr } from '@/data/locations';
import { ExploreFilterChipsBar } from './ExploreFilterChipsBar';
import { ExploreActiveCategoryBanner } from './ExploreActiveCategoryBanner';
import { ExploreCategoryFilterDrawer } from './ExploreCategoryFilterDrawer';
import { ExplorePriceFilterDrawer } from './ExplorePriceFilterDrawer';
import { ExploreLocationFilterDrawer } from './ExploreLocationFilterDrawer';

export interface ExploreFilterBarProps {
  filterMode: 'city' | 'all';
  setFilterMode: React.Dispatch<React.SetStateAction<'city' | 'all'>>;
  feedLayout: 'list' | 'grid';
  setFeedLayout: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
  totalListingsCount: number;
  minPriceFilter: number | null;
  setMinPriceFilter: (p: number | null) => void;
  maxPriceFilter: number | null;
  setMaxPriceFilter: (p: number | null) => void;
  activeNeighborhood: string | null;
  setActiveNeighborhood: (n: string | null) => void;
  readonly activeSearchText?: string;
  readonly onClearSearch?: () => void;
  readonly onDarkBackground?: boolean;
}

export const ExploreFilterBar: React.FC<ExploreFilterBarProps> = ({
  filterMode, setFilterMode, feedLayout, setFeedLayout, totalListingsCount,
  minPriceFilter, setMinPriceFilter, maxPriceFilter, setMaxPriceFilter, activeNeighborhood, setActiveNeighborhood,
  activeSearchText, onClearSearch,
  onDarkBackground,
}) => {
  const { isArabic, categoryFilter, setCategoryFilter, browseCountryCode, browseCityAr, browseCityEn, activeCurrency, setBrowseLocation } = useUI();
  const [openDrawer, setOpenDrawer] = useState<'category' | 'price' | 'location' | null>(null);

  const currentLocations = useMemo(
    () => (isArabic ? locationsAr[browseCountryCode] || {} : locations[browseCountryCode] || {}),
    [browseCountryCode, isArabic]
  );

  const activeCategoryTitle = useMemo(() => {
    if (!categoryFilter) return undefined;
    const sub = findSubcategoryBySlug(categoryFilter);
    if (sub) return isArabic ? sub.nameAr : sub.nameEn;
    const parent = categoryBySlug(categoryFilter);
    return parent ? (isArabic ? parent.nameAr : parent.nameEn) : categoryFilter;
  }, [categoryFilter, isArabic]);

  const handleSelectCity = useCallback((cityEn: string, cityAr: string) => {
    setBrowseLocation(browseCountryCode, cityEn, cityAr);
    setFilterMode('city');
    setActiveNeighborhood(null);
  }, [browseCountryCode, setBrowseLocation, setFilterMode, setActiveNeighborhood]);

  const handleSelectEntireCountry = useCallback(() => {
    setFilterMode('all');
    setActiveNeighborhood(null);
  }, [setFilterMode, setActiveNeighborhood]);

  return (
    <>
      <div className="sticky top-2 z-30 backdrop-blur-md">
        <ExploreFilterChipsBar
          isArabic={isArabic}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
          feedLayout={feedLayout}
          onFeedLayoutChange={setFeedLayout}
          listingCount={totalListingsCount}
          browseCityAr={browseCityAr}
          browseCityEn={browseCityEn}
          categoryFilter={categoryFilter}
          activeCategoryTitle={activeCategoryTitle}
          minPriceFilter={minPriceFilter}
          maxPriceFilter={maxPriceFilter}
          activeCurrency={activeCurrency}
          activeNeighborhood={activeNeighborhood}
          onOpenDrawer={setOpenDrawer}
          onClearCategory={() => setCategoryFilter(null)}
          onClearPrice={() => { setMinPriceFilter(null); setMaxPriceFilter(null); }}
          onClearNeighborhood={() => setActiveNeighborhood(null)}
          activeSearchText={activeSearchText}
          onClearSearch={onClearSearch}
          onDarkBackground={onDarkBackground}
        />
        {categoryFilter && (
          <ExploreActiveCategoryBanner isArabic={isArabic} activeCategoryTitle={activeCategoryTitle} onClearCategory={() => setCategoryFilter(null)} />
        )}
      </div>
      <ExploreCategoryFilterDrawer open={openDrawer === 'category'} onClose={() => setOpenDrawer(null)} isArabic={isArabic} activeCategory={categoryFilter} onSelectCategory={setCategoryFilter} />
      <ExplorePriceFilterDrawer open={openDrawer === 'price'} onClose={() => setOpenDrawer(null)} isArabic={isArabic} activeMinPrice={minPriceFilter} activeMaxPrice={maxPriceFilter} onApplyRange={(min, max) => { setMinPriceFilter(min); setMaxPriceFilter(max); }} currencySymbol={activeCurrency} />
      <ExploreLocationFilterDrawer open={openDrawer === 'location'} onClose={() => setOpenDrawer(null)} isArabic={isArabic} activeNeighborhood={activeNeighborhood} onSelectLocation={setActiveNeighborhood} onSelectCity={handleSelectCity} onSelectEntireCountry={handleSelectEntireCountry} currentLocations={currentLocations} browseCountryCode={browseCountryCode} />
    </>
  );
};
