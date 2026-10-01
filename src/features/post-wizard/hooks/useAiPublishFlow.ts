import { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { matchCategory } from '@/ai/categoryMatch';
import { generateListing } from '@/ai/listingCopyAgent';
import type { ScreenType } from '@/store/ui.slice.types';
import { buildAppliedDraft, buildFallbackDraft } from './useAiPublishFlow.helpers';

export const useAiPublishFlow = (setIsAnalyzing: (val: boolean) => void) => {
  const { isArabic, browseCountryCode, browseCityAr, navigateTo } = useUI();
  const { updatePostDraft } = useDraft();

  const processPublishFlow = useCallback(
    async (rawInput: string, images: string[], cb?: () => void, overrideCategory?: string) => {
      const raw = rawInput || (isArabic ? 'إعلان جديد للبيع' : 'New Item for sale');
      setIsAnalyzing(true);
      const photosToUse = images;
      let nextScreen: ScreenType = 'post-ai-review';

      const initialMatch = matchCategory({
        chosenCategory: overrideCategory || '',
        chosenSub: '',
        note: raw,
      });

      // Category to pass to Gemini:
      //  - overrideCategory (from CategoryPickScreen) wins
      //  - then matchCategory's best guess
      //  - otherwise empty string → Gemini infers from text
      const categoryForAI = overrideCategory || initialMatch.effectiveCategory || '';
      const subForAI = initialMatch.effectiveSub || '';

      try {
        const aiPromise = generateListing({
          raw,
          categorySlug: categoryForAI,
          subcategorySlug: subForAI,
          arabic: isArabic,
          city: browseCityAr,
          countryCode: browseCountryCode,
        });
        const timeoutPromise = new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error('Timeout')), 10000)
        );
        const generated = await Promise.race([aiPromise, timeoutPromise]);
        updatePostDraft(
          buildAppliedDraft({
            generated,
            match: initialMatch,
            raw,
            photos: photosToUse,
            isArabic,
            browseCityAr,
            categoryForAI,
            subForAI,
          })
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('[AI FLOW] Gemini failed, using fallback:', errorMessage);
        const fallbackMatch = matchCategory({
          chosenCategory: overrideCategory || '',
          chosenSub: '',
          note: raw,
        });
        const fallbackCategory = fallbackMatch.effectiveCategory || overrideCategory || '';

        // No category can be determined → hand off to manual picker.
        if (!fallbackCategory) {
          updatePostDraft({ noteText: raw, photos: photosToUse, categorySlug: '' });
          nextScreen = 'post-category-pick';
          return;
        }

        updatePostDraft(
          buildFallbackDraft({
            raw,
            photos: photosToUse,
            isArabic,
            browseCityAr,
            browseCountryCode,
            categorySlug: fallbackCategory,
            subcategorySlug: fallbackMatch.effectiveSub,
            match: fallbackMatch,
            errorMessage,
          })
        );
      } finally {
        setIsAnalyzing(false);
        cb?.();
        navigateTo(nextScreen);
      }
    },
    [isArabic, browseCountryCode, browseCityAr, navigateTo, updatePostDraft, setIsAnalyzing]
  );

  return { processPublishFlow };
};
