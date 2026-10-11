import React, { useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';

export interface CategoryFilterSectionProps {
  readonly isArabic: boolean;
  readonly activeCategory: string | null;
  readonly activeSubcategory: string | null;
  readonly onCategoryChange: (slug: string | null) => void;
  readonly onSubcategoryChange: (slug: string | null) => void;
}

const SUB_QUICK_PICK_COUNT = 6;
const SUB_SEARCHABLE_THRESHOLD = 8;

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  isArabic, activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange,
}) => {
  const subs = activeCategory ? subcategoriesByCategory(activeCategory) : [];
  const [subQuery, setSubQuery] = useState('');

  const filteredSubs = useMemo(() => {
    if (!subQuery.trim()) return subs;
    const q = subQuery.toLowerCase().trim();
    return subs.filter((s) =>
      s.nameAr.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q) || s.slug.includes(q)
    );
  }, [subs, subQuery]);

  const useSubSearch = subs.length > SUB_SEARCHABLE_THRESHOLD;
  const quickSubs = useSubSearch ? subs.slice(0, SUB_QUICK_PICK_COUNT) : subs;

  const subLabelOf = (slug: string) => {
    const s = subs.find((x) => x.slug === slug);
    return s ? (isArabic ? s.nameAr : s.nameEn) : '';
  };

  const handleSubSelect = (label: string) => {
    const found = subs.find((s) => (isArabic ? s.nameAr : s.nameEn) === label);
    if (found) {
      onSubcategoryChange(activeSubcategory === found.slug ? null : found.slug);
      setSubQuery('');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        data-testid="filter-category-all"
        onClick={() => { onCategoryChange(null); onSubcategoryChange(null); }}
        className={`w-full h-11 rounded-full flex items-center justify-center px-4 text-sm font-bold transition-all active:scale-[0.98] ${
          !activeCategory ? 'bg-brand text-white' : 'bg-canvas text-ink'
        }`}
      >
        {isArabic ? 'جميع الأقسام' : 'All categories'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              data-testid="filter-category-option"
              data-slug={cat.slug}
              type="button"
              onClick={() => { onCategoryChange(cat.slug); onSubcategoryChange(null); setSubQuery(''); }}
              className={`h-12 rounded-2xl flex items-center gap-2 px-3 text-xs font-bold transition-all active:scale-[0.98] ${
                isActive ? 'bg-brand text-white' : 'bg-canvas text-ink'
              }`}
            >
              <img src={cat.asset} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" decoding="async" />
              <span className="truncate text-start">{isArabic ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {activeCategory && subs.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {useSubSearch && (
            <div data-testid="filter-sub-search">
              <SearchableDropdown
                options={filteredSubs.map((s) => (isArabic ? s.nameAr : s.nameEn))}
                value={activeSubcategory ? subLabelOf(activeSubcategory) : ''}
                onChange={handleSubSelect}
                placeholder={isArabic ? 'ابحث في الفئات الفرعية...' : 'Search subcategories...'}
                isArabic={isArabic}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="filter-sub-all"
              onClick={() => { onSubcategoryChange(null); setSubQuery(''); }}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                !activeSubcategory ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            {quickSubs.map((sub) => {
              const isActive = activeSubcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  data-testid="filter-sub-option"
                  data-slug={sub.slug}
                  type="button"
                  onClick={() => { onSubcategoryChange(isActive ? null : sub.slug); setSubQuery(''); }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    isActive ? 'bg-accent/15 border-accent text-accent' : 'bg-surface border-border text-ink'
                  }`}
                >
                  {isArabic ? sub.nameAr : sub.nameEn}
                </button>
              );
            })}
          </div>

          {!useSubSearch && subs.length > 6 && (
            <input
              type="text"
              value={subQuery}
              onChange={(e) => setSubQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث في الفئات...' : 'Search subcategories...'}
              className="w-full h-10 px-3 rounded-xl border border-line bg-canvas text-ink text-xs focus:outline-none focus:border-primary"
            />
          )}
        </div>
      )}
    </div>
  );
};
