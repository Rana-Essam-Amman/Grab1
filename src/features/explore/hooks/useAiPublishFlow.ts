import { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { matchCategory } from '@/ai/categoryMatch';
import { generateListing, writeListingCopy } from '@/ai/listingCopyAgent';
import { buildFieldsFromFacts } from '@/ai/buildFieldsFromFacts';
import type { ScreenType } from '@/store/ui.slice.types';

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
        if (!generated) {
          throw new Error('Generation failed');
        }

        // Gemini's categorySlug wins
        const effectiveCategory =
          overrideCategory || generated.categorySlug || initialMatch.effectiveCategory || '';
        const effectiveSub =
          generated.subcategorySlug || initialMatch.effectiveSub || '';

        if (!effectiveCategory) {
          throw new Error('No category determined');
        }

        updatePostDraft({
          noteText: raw,
          photos: photosToUse,
          categorySlug: effectiveCategory,
          subcategorySlug: effectiveSub,
          city: generated.city || browseCityAr,
          generated: {
            ...generated,
            categorySlug: effectiveCategory,
            subcategorySlug: effectiveSub,
            categoryMatch: initialMatch,
          },
        });
      } catch {
        const fallbackMatch = matchCategory({ chosenCategory: '', chosenSub: '', note: raw });
        const fallbackCategory =
          overrideCategory || initialMatch.effectiveCategory || fallbackMatch.effectiveCategory;

        if (!fallbackCategory) {
          updatePostDraft({ noteText: raw, photos: photosToUse, categorySlug: '' });
          nextScreen = 'post-category-pick';
          return;
        }

        const fallbackSub =
          initialMatch.effectiveSub || fallbackMatch.effectiveSub || '';
        const copy = writeListingCopy({
          raw,
          arabic: isArabic,
          categorySlug: fallbackCategory,
          countryCode: browseCountryCode,
        });
        updatePostDraft({
          noteText: raw,
          photos: photosToUse,
          categorySlug: fallbackCategory,
          subcategorySlug: fallbackSub,
          city: browseCityAr,
          generated: {
            title: copy.title,
            description: copy.body,
            price: copy.facts.price || '',
            city: browseCityAr,
            categorySlug: fallbackCategory,
            subcategorySlug: fallbackSub,
            categoryMatch: fallbackMatch,
            missing: copy.missing,
            fields: buildFieldsFromFacts(
              copy.facts,
              fallbackCategory,
              fallbackSub || '',
              isArabic
            ),
          },
        });
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
