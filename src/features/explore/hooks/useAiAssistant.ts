import { useState, useCallback, useEffect } from 'react';
import { parseNaturalLanguageSearch } from '@/ai/searchQueryParser';
import { useUI } from '@/hooks/useUI';
import { classifyUserIntent, extractCleanSearchFallback } from '../helpers/intentClassifier';
import type { AiResponse } from './useAiAssistant.types';
import { useAiPublishFlow } from './useAiPublishFlow';
import { useAiSuggestion } from './useAiSuggestion';
import type { SuggestionState } from './useAiSuggestion';

export interface UseAiAssistantReturn {
  query: string;
  setQuery: (q: string) => void;
  handleQueryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isAnalyzing: boolean;
  handleSend: (images: string[], onSuccess?: () => void) => Promise<AiResponse | null | void>;
  readonly suggestion: SuggestionState | null;
  readonly isDismissed: boolean;
  readonly handleSuggestionAccept: (images?: string[]) => Promise<void>;
  readonly handleSuggestionDismiss: () => void;
  readonly hint: string | null;
}

export const useAiAssistant = (props: {
  setMaxPriceFilter: (val: number | null) => void;
  setActiveNeighborhood: (val: string | null) => void;
  setActiveSearchText: (val: string) => void;
  setVoidedNotice: (val: string | null) => void;
}): UseAiAssistantReturn => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const { isArabic, browseCountryCode, setCategoryFilter, setSearchQuery } = useUI();
  const { processPublishFlow } = useAiPublishFlow(setIsAnalyzing);
  const { suggestion, isDismissed, evaluate, dismiss, clear: clearSuggestion } = useAiSuggestion();

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 3000);
    return () => clearTimeout(t);
  }, [hint]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value), []);

  const applySearchResult = useCallback((parsed: ReturnType<typeof parseNaturalLanguageSearch>, rawText: string) => {
    if (parsed.categorySlug) setCategoryFilter(parsed.categorySlug);
    if (parsed.maxPrice !== undefined) props.setMaxPriceFilter(parsed.maxPrice);
    if (parsed.locationLabel) props.setActiveNeighborhood(parsed.locationLabel);
    const clean = parsed.cleanTextQuery || (!parsed.categorySlug && parsed.maxPrice === undefined && !parsed.locationLabel ? extractCleanSearchFallback(rawText) : '');
    props.setActiveSearchText(clean);
    if (clean) setSearchQuery(clean);
    props.setVoidedNotice(parsed.voidedCrossBorderLocation || null);
  }, [setCategoryFilter, setSearchQuery, props]);

  const handleSuggestionAccept = useCallback(async (images: string[] = []) => {
    const raw = suggestion?.rawText ?? query.trim();
    if (!raw && images.length === 0) return;
    clearSuggestion();
    await processPublishFlow(raw, images, undefined);
  }, [suggestion, query, clearSuggestion, processPublishFlow]);

  const handleSuggestionDismiss = useCallback(() => dismiss(), [dismiss]);

  const handleSend = useCallback(async (images: string[] = [], onSuccess?: () => void) => {
    const raw = query.trim();
    if (!raw && images.length === 0) return null;
    const intent = classifyUserIntent(raw);
    if (intent === 'IGNORE') {
      setQuery('');
      setHint(isArabic ? 'اكتب اسم منتج للبحث، أو وصف لما بدك تبيعه' : 'Type a product name, or describe what you want to sell');
      return null;
    }
    const parsed = parseNaturalLanguageSearch(raw, browseCountryCode);
    applySearchResult(parsed, raw);
    if (intent === 'PUBLISH' && !isDismissed) evaluate(raw);
    setQuery('');
    onSuccess?.();
    return parsed;
  }, [query, browseCountryCode, isDismissed, evaluate, applySearchResult, isArabic]);

  return {
    query,
    setQuery,
    handleQueryChange,
    isAnalyzing,
    handleSend,
    suggestion,
    isDismissed,
    handleSuggestionAccept,
    handleSuggestionDismiss,
    hint,
  };
};
