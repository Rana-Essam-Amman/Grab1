import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useCallback } from 'react';
import { categories } from '@/data/categories';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

export const ChooseCategoryScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { updatePostDraft } = usePostWizard();
  const { authStatus } = useAuth();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

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
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-[#1a2238] sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"
          aria-label={isArabic ? 'رجوع' : 'Back'}
        >
          <BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" />
        </Button>
        <div>
          <div className="text-xs font-semibold text-white/70">
            {isArabic ? 'الخطوة 1 من 6' : 'Step 1 of 6'}
          </div>
          <h2 className="text-lg font-bold text-white">
            {isArabic ? 'اختر القسم الرئيسي' : 'Choose Category'}
          </h2>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleSelect(cat.slug)}
            className="p-3.5 flex flex-col items-center text-center gap-2.5 transition-all group active:scale-[0.97] cursor-pointer rounded-2xl bg-white border border-line hover:border-[#E57E25]/50 hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-canvas overflow-hidden border border-line group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src={cat.asset}
                alt={cat.nameEn}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <span className="text-[13px] font-bold text-ink group-hover:text-[#E57E25] line-clamp-1 transition-colors">
              {isArabic ? cat.nameAr : cat.nameEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
