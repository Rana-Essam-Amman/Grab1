import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import React, { useMemo, useCallback } from 'react';
import { categoryBySlug } from '@/data/categories';
import { subcategoriesByCategory } from '@/data/subcategories';
import { SubcategoryDef } from '@/types';
import { ArrowRight2, ArrowLeft2 } from 'iconsax-react';
import { PostFlowHeader } from '../components/PostFlowHeader';

export const ChooseSubcategoryScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo, aiFlowPending, setAiFlowPending } = useUI();
  const { postDraft, updatePostDraft } = usePostWizard();
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
      if (aiFlowPending) {
        setAiFlowPending(false);
        navigateTo('post-ai-capture');
      } else {
        navigateTo('post-photos');
      }
    },
    [updatePostDraft, navigateTo, aiFlowPending, setAiFlowPending]
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={2}
        titleAr="اختر التصنيف الفرعي"
        titleEn="Choose Subcategory"
        subtitleAr={currentCategory.nameAr}
        subtitleEn={currentCategory.nameEn}
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4 flex flex-col gap-2">
        {subs.map((sub: SubcategoryDef) => (
          <button
            key={sub.slug}
            type="button"
            data-testid={`subcategory-card-${sub.slug}`}
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
