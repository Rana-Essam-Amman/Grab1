import React, { useMemo, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { useListings } from '@/hooks/useListings';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';
import { ArrowRight2, ArrowLeft2 } from 'iconsax-react';

export const CategoriesScreen: React.FC = () => {
  const { isArabic, navigateTo, setSelectedParentCategory, browseCountryCode } = useUI();
  const { t } = useTranslation();
  const { listings } = useListings();

  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

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

      <div className="flex flex-col gap-2.5">
        {categories.map((cat) => {
          const subs = subcategoriesByCategory(cat.slug);
          const catCount = categoryCounts[cat.slug] || 0;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelectPrimaryCategory(cat.slug)}
              className="w-full bg-surface rounded-2xl border border-border p-3.5 flex items-center justify-between hover:border-primary hover:bg-surface active:scale-[0.99] transition-all shadow-2xs group cursor-pointer text-start"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center overflow-hidden border border-border shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.asset}
                    alt={cat.nameEn}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-ink font-cairo group-hover:text-primary transition-colors">
                    {isArabic ? cat.nameAr : cat.nameEn}
                  </h3>
                  <span className="text-[11px] text-ink-muted font-medium font-cairo">
                    {subs.length} {isArabic ? 'تصنيفات فرعية' : 'subcategories'}
                    {catCount > 0 ? ` • ${catCount} ${t('categories.listingsCount')}` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-primary font-cairo opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                  {isArabic ? 'تصفح' : 'Explore'}
                </span>
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-background transition-colors">
                  <ChevronIcon
                    size={16}
                    variant="Linear"
                    className="text-ink-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
