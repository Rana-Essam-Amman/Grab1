import { useState, useCallback } from 'react';
import { parseNaturalLanguageSearch } from '@/ai/searchQueryParser';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { matchCategory } from '@/ai/categoryMatch';
import { generateListing } from '@/ai/listingCopyAgent';
import { classifyUserIntent, extractCleanSearchFallback } from '../helpers/intentClassifier';
import type { AiResponse } from './useAiAssistant.types';

export interface UseAiAssistantReturn {
  query: string;
  setQuery: (q: string) => void;
  handleQueryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isAnalyzing: boolean;
  aiResponse: AiResponse | null;
  handleSend: (images: string[], onSuccess?: () => void) => Promise<AiResponse | null | void>;
  clearResponse: () => void;
}

export const useAiAssistant = (props: {
  setMaxPriceFilter: (val: number | null) => void;
  setActiveNeighborhood: (val: string | null) => void;
  setActiveSearchText: (val: string) => void;
  setVoidedNotice: (val: string | null) => void;
}): UseAiAssistantReturn => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const { isArabic, browseCountryCode, browseCityAr, setCategoryFilter, setSearchQuery, navigateTo } = useUI();
  const { updatePostDraft } = useDraft();

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value), []);
  const clearResponse = useCallback(() => setAiResponse(null), []);

  const processPublishFlow = async (rawInput: string, images: string[], cb?: () => void) => {
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
    } catch (error) {
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
  };

  const handleSend = useCallback(async (images: string[] = [], onSuccess?: () => void) => {
    const raw = query.trim();
    if (!raw && images.length === 0) return null;
    const intent = classifyUserIntent(raw);
    if (intent === 'SEARCH' && raw) {
      const parsed = parseNaturalLanguageSearch(raw, browseCountryCode);
      setAiResponse(parsed);
      if (parsed.categorySlug) setCategoryFilter(parsed.categorySlug);
      if (parsed.maxPrice !== undefined) props.setMaxPriceFilter(parsed.maxPrice);
      if (parsed.locationLabel) props.setActiveNeighborhood(parsed.locationLabel);
      if (parsed.cleanTextQuery) {
        props.setActiveSearchText(parsed.cleanTextQuery);
        setSearchQuery(parsed.cleanTextQuery);
      } else if (!parsed.categorySlug && parsed.maxPrice === undefined && !parsed.locationLabel) {
        const clean = extractCleanSearchFallback(raw);
        props.setActiveSearchText(clean);
        setSearchQuery(clean);
      } else {
        props.setActiveSearchText('');
      }
      props.setVoidedNotice(parsed.voidedCrossBorderLocation || null);
      onSuccess?.();
      return parsed;
    } else {
      await processPublishFlow(raw, images, onSuccess);
    }
  }, [query, browseCountryCode, isArabic, browseCityAr, setCategoryFilter, setSearchQuery, navigateTo, updatePostDraft, props]);

  return { query, setQuery, handleQueryChange, isAnalyzing, aiResponse, handleSend, clearResponse };
};
