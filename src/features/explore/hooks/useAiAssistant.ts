import { useState, useCallback } from 'react';
import { parseNaturalLanguageSearch } from '@/ai/searchQueryParser';
import { useUI } from '@/hooks/useUI';
import { classifyUserIntent, extractCleanSearchFallback } from '../helpers/intentClassifier';
import type { AiResponse } from './useAiAssistant.types';
import { useAiPublishFlow } from './useAiPublishFlow';

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
  const { browseCountryCode, setCategoryFilter, setSearchQuery } = useUI();
  const { processPublishFlow } = useAiPublishFlow(setIsAnalyzing);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value), []);
  const clearResponse = useCallback(() => setAiResponse(null), []);

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
  }, [query, browseCountryCode, processPublishFlow, setCategoryFilter, setSearchQuery, props]);

  return { query, setQuery, handleQueryChange, isAnalyzing, aiResponse, handleSend, clearResponse };
};
