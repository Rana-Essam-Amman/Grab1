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

      try {
        const match = matchCategory({
          chosenCategory: overrideCategory || '',
          chosenSub: '',
          note: raw,
        });
        if (!match.effectiveCategory) {
          updatePostDraft({ noteText: raw, photos: photosToUse, categorySlug: '' });
          nextScreen = 'post-category-pick';
          return;
        }

        const aiPromise = generateListing({
          raw,
          categorySlug: match.effectiveCategory,
          subcategorySlug: match.effectiveSub,
          arabic: isArabic,
          city: browseCityAr,
          countryCode: browseCountryCode,
        });
        const timeoutPromise = new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error('Timeout')), 10000)
        );
        const generated = await Promise.race([aiPromise, timeoutPromise]);
        generated.categoryMatch = match;

        updatePostDraft({
          noteText: raw,
          photos: photosToUse,
          categorySlug: match.effectiveCategory,
          subcategorySlug: match.effectiveSub,
          city: generated.city || browseCityAr,
          generated,
        });
      } catch {
        const fallbackMatch = matchCategory({ chosenCategory: '', chosenSub: '', note: raw });
        const fallbackCategory = fallbackMatch.effectiveCategory || 'krakeeb';
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
          subcategorySlug: fallbackMatch.effectiveSub,
          city: browseCityAr,
          generated: {
            title: copy.title,
            description: copy.body,
            price: copy.facts.price || '',
            city: browseCityAr,
            categorySlug: fallbackCategory,
            subcategorySlug: fallbackMatch.effectiveSub,
            categoryMatch: fallbackMatch,
            missing: copy.missing,
            fields: buildFieldsFromFacts(
              copy.facts,
              fallbackCategory,
              fallbackMatch.effectiveSub || '',
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
