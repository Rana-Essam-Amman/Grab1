import React, { useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { useListings } from '@/hooks/useListings';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';

export const CategoriesScreen: React.FC = () => {
  const { isArabic, navigateTo, setSelectedParentCategory, browseCountryCode } = useUI();
  const { t } = useTranslation();
  const { listings } = useListings();

  const handleSelectPrimaryCategory = useCallback((catSlug: string) => {
    setSelectedParentCategory(catSlug);
    navigateTo('sub-categories');
  }, [setSelectedParentCategory, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23E5E7EB"/></svg>';
  }, []);

  const countryListings = useMemo(
    () => filterListingsByMarket(listings, browseCountryCode),
    [listings, browseCountryCode]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    countryListings.forEach((l) => {
      counts[l.categorySlug] = (counts[l.categorySlug] || 0) + 1;
    });
    return counts;
  }, [countryListings]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`max-w-[440px] mx-auto w-full flex flex-col pb-24 px-4 pt-3 ${
        isArabic ? 'font-cairo' : ''
      }`}
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink font-cairo">
          {t('categories.categoriesTitle')}
        </h1>
        <p className="text-xs text-ink-muted mt-0.5 font-medium font-cairo">
          {isArabic
            ? 'اختر القسم للوصول للتصنيفات الفرعية وعروض الصفقات'
            : 'Select a category to explore sub-categories and localized deals'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const subs = subcategoriesByCategory(cat.slug);
          const catCount = categoryCounts[cat.slug] || 0;
          return (
            <button
              key={cat.slug}
              type="button"
              data-testid={`category-card-${cat.slug}`}
              onClick={() => handleSelectPrimaryCategory(cat.slug)}
              className="p-4 flex flex-col items-center text-center gap-3 rounded-2xl bg-surface border border-border hover:border-accent/50 hover:shadow-md active:scale-[0.97] transition-all group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full bg-canvas overflow-hidden border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={cat.asset}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex flex-col items-center gap-0.5 min-w-0 w-full">
                <h3 className="text-[15px] font-bold text-ink font-cairo group-hover:text-accent transition-colors line-clamp-1 w-full">
                  {isArabic ? cat.nameAr : cat.nameEn}
                </h3>
                <span className="text-[11px] text-ink-muted font-medium font-cairo">
                  {subs.length} {isArabic ? 'تصنيف' : 'subs'}
                  {catCount > 0 ? ` • ${catCount} ${t('categories.listingsCount')}` : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
