import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { CategorySearchBar } from '../components/CategorySearchBar';
import { searchCategories } from '@/data/searchIndex';

export const ChooseCategoryScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { updatePostDraft } = usePostWizard();
  const { authStatus } = useAuth();
  const [query, setQuery] = useState('');
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

  const handleSelect = useCallback(
    (categorySlug: string) => {
      // Automatically bind the country context of the new listing to match user's country
      updatePostDraft({ 
        categorySlug,
        // Force country binding on start of creation flow
      });
      navigateTo('post-subcategory');
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

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={1}
        titleAr="اختر القسم الرئيسي"
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

      <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visible.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            data-testid={`category-card-${cat.slug}`}
            onClick={() => handleSelect(cat.slug)}
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
    </div>
  );
};
