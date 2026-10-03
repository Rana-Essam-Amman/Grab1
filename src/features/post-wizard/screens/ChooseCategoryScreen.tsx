import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { CategorySearchBar } from '../components/CategorySearchBar';
import { searchCategories } from '@/data/searchIndex';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'iconsax-react';

export const ChooseCategoryScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { updatePostDraft } = usePostWizard();
  const { authStatus } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const isSearching = query.trim().length > 0;
  const matches = useMemo(() => (isSearching ? searchCategories(query) : []), [query, isSearching]);
  const noMatch = isSearching && matches.length === 0;
  const visible = noMatch || !isSearching ? categories : matches;

  // Protect listing creation with a session guard redirect
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigateTo('login');
    }
  }, [authStatus, navigateTo]);

  const handleCategorySelect = useCallback(
    (categorySlug: string) => {
      if (selectedCategory === categorySlug) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(categorySlug);
        // Clear query when expanding a category to show its full subcategories
        if (isSearching) setQuery('');
      }
    },
    [selectedCategory, isSearching]
  );

  const handleSubcategorySelect = useCallback(
    (categorySlug: string, subcategorySlug: string) => {
      updatePostDraft({ 
        categorySlug,
        subcategorySlug,
      });
      navigateTo('post-photos');
    },
    [updatePostDraft, navigateTo]
  );

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23E5E7EB"/></svg>';
  }, []);

  if (authStatus === 'unauthenticated') {
    return null; // completely block render during redirection
  }

  const subcategories = selectedCategory ? subcategoriesByCategory(selectedCategory) : [];

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={1}
        totalSteps={3}
        titleAr="اختر القسم"
        titleEn="Choose Category"
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4">
        <CategorySearchBar isArabic={isArabic} value={query} onChange={setQuery} />
      </div>

      {noMatch && (
        <p className="px-4 pb-2 text-xs text-ink-muted">
          {isArabic ? 'لا يوجد تطابق — اختر من الأقسام' : 'No match — pick from categories'}
        </p>
      )}

      {selectedCategory ? (
        <div className="px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-accent font-bold py-2"
          >
            {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{isArabic ? 'العودة للأقسام الرئيسية' : 'Back to main categories'}</span>
          </button>
          
          <div className="bg-white rounded-3xl border border-line overflow-hidden shadow-sm">
            <div className="p-4 bg-canvas/30 border-b border-line flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden">
                <img 
                  src={categories.find(c => c.slug === selectedCategory)?.asset} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <span className="font-bold text-ink">
                {isArabic 
                  ? categories.find(c => c.slug === selectedCategory)?.nameAr 
                  : categories.find(c => c.slug === selectedCategory)?.nameEn}
              </span>
            </div>
            
            <div className="divide-y divide-line">
              {subcategories.map(sub => (
                <button
                  key={sub.slug}
                  onClick={() => handleSubcategorySelect(selectedCategory, sub.slug)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-canvas/20 active:bg-canvas/40 transition-colors text-right"
                >
                  <span className="text-[15px] font-medium text-ink">
                    {isArabic ? sub.nameAr : sub.nameEn}
                  </span>
                  {isArabic ? <ArrowLeft size={18} className="text-ink-muted" /> : <ArrowRight size={18} className="text-ink-muted" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visible.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              data-testid={`category-card-${cat.slug}`}
              onClick={() => handleCategorySelect(cat.slug)}
              className="p-3.5 flex flex-col items-center text-center gap-2.5 transition-all group active:scale-[0.97] cursor-pointer rounded-2xl bg-white border border-line hover:border-accent/50 hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-canvas overflow-hidden border border-line group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src={cat.asset}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <span className="text-[13px] font-bold text-ink group-hover:text-accent line-clamp-1 transition-colors">
                {isArabic ? cat.nameAr : cat.nameEn}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
