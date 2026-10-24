import React, { useState, useMemo, useCallback } from 'react';
import { SearchNormal1, CloseCircle, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { useListings } from '@/hooks/useListings';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { filterListingsByMarket } from '@/shared/lib/marketGate';

export const CategoriesScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const { isArabic, navigateTo, setSelectedParentCategory, setCategoryFilter, setActiveTab, browseCountryCode } = useUI();
  const { t } = useTranslation();
  const { listings } = useListings();

  const handleSelectPrimaryCategory = useCallback((catSlug: string) => {
    setSelectedParentCategory(catSlug);
    const cat = categories.find((c) => c.slug === catSlug);
    navigateTo((cat?.landingScreen || 'sub-categories') as Parameters<typeof navigateTo>[0]);
  }, [setSelectedParentCategory, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23E5E7EB"/></svg>';
  }, []);

  const countryListings = useMemo(() => filterListingsByMarket(listings, browseCountryCode), [listings, browseCountryCode]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    countryListings.forEach((l) => { counts[l.categorySlug] = (counts[l.categorySlug] || 0) + 1; });
    return counts;
  }, [countryListings]);

  const allSearchableItems = useMemo(() => {
    const items: Array<{ type: 'category' | 'subcategory'; slug: string; nameAr: string; nameEn: string; parentNameAr: string; parentNameEn: string; landingScreen?: string }> = [];
    for (const cat of categories) {
      items.push({ type: 'category', slug: cat.slug, nameAr: cat.nameAr, nameEn: cat.nameEn, parentNameAr: '', parentNameEn: '', landingScreen: cat.landingScreen });
      for (const sub of subcategoriesByCategory(cat.slug)) {
        items.push({ type: 'subcategory', slug: sub.slug, nameAr: sub.nameAr, nameEn: sub.nameEn, parentNameAr: cat.nameAr, parentNameEn: cat.nameEn, landingScreen: cat.landingScreen });
      }
    }
    return items;
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSearchableItems.filter((i) => i.nameAr.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q) || i.parentNameAr.toLowerCase().includes(q) || i.parentNameEn.toLowerCase().includes(q));
  }, [query, allSearchableItems]);

  const handleSelectCategoryItem = useCallback((item: (typeof allSearchableItems)[number]) => {
    if (item.type === 'category') {
      handleSelectPrimaryCategory(item.slug);
    } else {
      setCategoryFilter(item.slug);
      setActiveTab('explore');
      navigateTo('main');
    }
  }, [handleSelectPrimaryCategory, setCategoryFilter, setActiveTab, navigateTo]);

  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;
  const isSearching = query.trim().length > 0;

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`max-w-[440px] mx-auto w-full flex flex-col pb-24 px-4 pt-3 ${isArabic ? 'font-cairo' : ''}`}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink font-cairo">{t('categories.categoriesTitle')}</h1>
        <p className="text-xs text-ink-muted mt-0.5 font-medium font-cairo">{isArabic ? 'اختر القسم للوصول للتصنيفات الفرعية وعروض الصفقات' : 'Select a category to explore sub-categories and localized deals'}</p>
        <div className="relative mt-3">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-ink-muted"><SearchNormal1 size={18} variant="Linear" /></div>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isArabic ? 'ابحث في الأقسام والتصنيفات الفرعية...' : 'Search categories & subcategories...'} className="w-full ps-10 pe-10 py-2.5 text-sm bg-surface border border-border rounded-xl text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent font-cairo transition-colors" />
          {query && (<button type="button" onClick={() => setQuery('')} className="absolute inset-y-0 end-0 flex items-center pe-3 text-ink-muted hover:text-ink transition-colors" aria-label={isArabic ? 'مسح البحث' : 'Clear search'}><CloseCircle size={18} variant="Bold" /></button>)}
        </div>
      </div>
      {isSearching ? (
        <div className="flex flex-col gap-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-muted font-cairo bg-surface rounded-2xl border border-border">{isArabic ? 'لا توجد نتائج تطابق بحثك' : 'No matching categories or subcategories found'}</div>
          ) : (
            filteredItems.map((item) => (
              <button key={`${item.type}-${item.slug}`} type="button" data-testid={`search-result-${item.slug}`} onClick={() => handleSelectCategoryItem(item)} className="p-3.5 flex items-center justify-between rounded-xl bg-surface border border-border hover:border-accent/50 hover:shadow-sm active:scale-[0.99] transition-all text-start group cursor-pointer">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink font-cairo group-hover:text-accent transition-colors">{isArabic ? item.nameAr : item.nameEn}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent font-cairo">{item.type === 'category' ? (isArabic ? 'قسم رئيسي' : 'Category') : (isArabic ? 'تصنيف فرعي' : 'Subcategory')}</span>
                  </div>
                  {item.type === 'subcategory' && <span className="text-xs text-ink-muted font-cairo">{isArabic ? item.parentNameAr : item.parentNameEn}</span>}
                </div>
                <ChevronIcon size={16} className="text-ink-muted group-hover:text-accent shrink-0 ms-2 transition-colors" />
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const subs = subcategoriesByCategory(cat.slug);
            const catCount = categoryCounts[cat.slug] || 0;
            return (
              <button key={cat.slug} type="button" data-testid={`category-card-${cat.slug}`} onClick={() => handleSelectPrimaryCategory(cat.slug)} className="p-4 flex flex-col items-center text-center gap-3 rounded-2xl bg-surface border border-border hover:border-accent/50 hover:shadow-md active:scale-[0.97] transition-all group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-canvas overflow-hidden border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <img src={cat.asset} alt={cat.nameEn} className="w-full h-full object-cover" onError={handleImageError} loading="lazy" decoding="async" />
                </div>
                <div className="flex flex-col items-center gap-0.5 min-w-0 w-full">
                  <h3 className="text-[15px] font-bold text-ink font-cairo group-hover:text-accent transition-colors line-clamp-1 w-full">{isArabic ? cat.nameAr : cat.nameEn}</h3>
                  <span className="text-[11px] text-ink-muted font-medium font-cairo">
                    {subs.length} {isArabic ? 'تصنيف' : 'subs'}
                    {catCount > 0 ? ` • ${catCount} ${t('categories.listingsCount')}` : ''}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
