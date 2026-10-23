import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { subcategoriesByCategory } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { groupFurnitureSubcategories } from '@/data/furnitureGroups';
import { FurnitureGroupCard } from '../components/FurnitureGroupCard';

export const FurnitureLandingScreen: React.FC = () => {
  const { isArabic, navigateTo, setActiveTab, setCategoryFilter, setSelectedParentCategory, browseCountryCode } = useUI();
  const { listings } = useListings();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const allSubs = useMemo(() => subcategoriesByCategory('furniture'), []);
  const grouped = useMemo(() => groupFurnitureSubcategories(allSubs), [allSubs]);
  const countryListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);

  const subCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    countryListings.forEach((l) => {
      if (l.categorySlug === 'furniture' && l.subcategorySlug) {
        counts[l.subcategorySlug] = (counts[l.subcategorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [countryListings]);

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleBack = useCallback(() => {
    setActiveTab('categories');
    navigateTo('main');
  }, [setActiveTab, navigateTo]);

  const handleSelectSubcategory = useCallback((subSlug: string) => {
    setCategoryFilter(subSlug);
    setActiveTab('explore');
    navigateTo('main');
  }, [setCategoryFilter, setActiveTab, navigateTo]);

  const handlePublish = useCallback(() => {
    setSelectedParentCategory('furniture');
    navigateTo('post-ad-entry');
  }, [setSelectedParentCategory, navigateTo]);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`max-w-[440px] mx-auto w-full flex flex-col pb-24 px-4 pt-3 ${isArabic ? 'font-cairo' : ''}`}>
      <button type="button" onClick={handleBack} className="flex items-center gap-1 text-ink-muted hover:text-ink text-xs font-bold mb-3 w-fit cursor-pointer" data-testid="furniture-back">
        {isArabic ? <ArrowRight2 size={14} /> : <ArrowLeft2 size={14} />}
        <span>{isArabic ? 'رجوع للأقسام' : 'Back to categories'}</span>
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink font-cairo">{isArabic ? 'أثاث وديكور' : 'Furniture'}</h1>
        <p className="text-xs text-ink-muted mt-0.5 font-medium font-cairo">{isArabic ? 'اختر الأثاث والديكور المناسب لمنزلك' : 'Pick the furniture and decor for your home'}</p>
      </div>

      <button type="button" onClick={handlePublish} className="w-full mb-4 py-3 rounded-2xl bg-primary text-white font-bold text-sm font-cairo shadow-sm active:scale-[0.99] transition-transform cursor-pointer" data-testid="furniture-publish-cta">
        {isArabic ? '+ انشر إعلان أثاث' : '+ Post a furniture ad'}
      </button>

      <div className="flex flex-col gap-2.5">
        {grouped.map(({ group, subcategories }) => (
          <FurnitureGroupCard
            key={group.key}
            group={group}
            subcategories={subcategories}
            isExpanded={expandedGroups.has(group.key)}
            isArabic={isArabic}
            subCounts={subCounts}
            onToggle={toggleGroup}
            onSelectSub={handleSelectSubcategory}
          />
        ))}
      </div>
    </div>
  );
};
