import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import React, { useMemo, useCallback } from 'react';
import { categoryBySlug } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { SubcategoryDef } from '@/types';
import { ArrowLeft, ArrowRight, ArrowRight2, ArrowLeft2 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

export const ChooseSubcategoryScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { postDraft, updatePostDraft } = usePostWizard();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

  const currentCategory = useMemo(
    () => categoryBySlug(postDraft.categorySlug),
    [postDraft.categorySlug]
  );
  const subs: SubcategoryDef[] = useMemo(
    () => subcategoriesByCategory(postDraft.categorySlug),
    [postDraft.categorySlug]
  );

  const handleSelectSub = useCallback(
    (subcategorySlug: string) => {
      updatePostDraft({ subcategorySlug });
      navigateTo('post-photos');
    },
    [updatePostDraft, navigateTo]
  );

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
            {isArabic ? 'الخطوة 2 من 6' : 'Step 2 of 6'} • {isArabic ? currentCategory.nameAr : currentCategory.nameEn}
          </div>
          <h2 className="text-lg font-bold text-white">
            {isArabic ? 'اختر التصنيف الفرعي' : 'Choose Subcategory'}
          </h2>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {subs.map((sub: SubcategoryDef) => (
          <button
            key={sub.slug}
            type="button"
            onClick={() => handleSelectSub(sub.slug)}
            className="w-full p-4 flex items-center justify-between text-start transition-all group active:scale-[0.99] cursor-pointer rounded-2xl bg-white border border-line hover:border-[#E57E25]/50 hover:shadow-sm"
          >
            <span className="text-[14px] font-bold text-ink group-hover:text-[#E57E25] transition-colors">
              {isArabic ? sub.nameAr : sub.nameEn}
            </span>
            <span className="w-7 h-7 rounded-full bg-canvas border border-line flex items-center justify-center group-hover:bg-[#E57E25] group-hover:border-[#E57E25] transition-colors shrink-0">
              <ChevronIcon size={14} variant="Bold" className="text-ink-muted group-hover:text-white transition-colors" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
