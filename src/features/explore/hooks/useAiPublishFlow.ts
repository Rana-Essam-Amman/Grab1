import { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { matchCategory } from '@/ai/categoryMatch';
import { generateListing } from '@/ai/listingCopyAgent';

export const useAiPublishFlow = (setIsAnalyzing: (val: boolean) => void) => {
  const { isArabic, browseCountryCode, browseCityAr, navigateTo } = useUI();
  const { updatePostDraft } = useDraft();

  const processPublishFlow = useCallback(async (rawInput: string, images: string[], cb?: () => void) => {
    const raw = rawInput || (isArabic ? 'إعلان جديد للبيع' : 'New Item for sale');
    setIsAnalyzing(true);
    const photosToUse = images.length > 0 ? images : ['/assets/listings/car.jpg'];
    try {
      const aiPromise = (async () => {
        const match = matchCategory({ chosenCategory: '', chosenSub: '', note: raw });
        const generated = await generateListing({ raw, categorySlug: match.effectiveCategory, subcategorySlug: match.effectiveSub, arabic: isArabic, city: browseCityAr, countryCode: browseCountryCode });
        generated.categoryMatch = match;
        return { match, generated };
      })();
      const timeoutPromise = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Timeout')), 10000));
      const { match, generated } = await Promise.race([aiPromise, timeoutPromise]);
      updatePostDraft({ noteText: raw, photos: photosToUse, categorySlug: match.effectiveCategory, subcategorySlug: match.effectiveSub, city: generated.city || '', generated });
    } catch {
      const fallbackMatch = matchCategory({ chosenCategory: '', chosenSub: '', note: raw });
      updatePostDraft({
        noteText: raw, photos: photosToUse, categorySlug: fallbackMatch.effectiveCategory, subcategorySlug: fallbackMatch.effectiveSub, city: '',
        generated: { title: raw, price: '', city: '', categorySlug: fallbackMatch.effectiveCategory, subcategorySlug: fallbackMatch.effectiveSub, description: raw, categoryMatch: fallbackMatch, missing: ['price', 'city'] }
      });
    } finally {
      setIsAnalyzing(false);
      cb?.();
      navigateTo('post-ai-review');
    }
  }, [isArabic, browseCountryCode, browseCityAr, navigateTo, updatePostDraft, setIsAnalyzing]);

  return { processPublishFlow };
};
