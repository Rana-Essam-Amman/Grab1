import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { generateListing } from '@/ai/listingCopyAgent';

export interface UseAiDraftReturn {
  prompt: string;
  setPrompt: (p: string) => void;
  isGenerating: boolean;
  handleGenerate: () => Promise<void>;
  handleManualSubmit: (fields: { title: string; price: string; description: string }) => void;
  error: string | null;
}

export function useAiDraft(): UseAiDraftReturn {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { postDraft, updatePostDraft } = usePostWizard();
  const { navigateTo, browseCountryCode, isArabic } = useUI();
  const { user } = useAuth();

  const handleGenerate = async () => {
    const raw = prompt.trim();
    if (!raw) {
      setError('اكتب وصف السلعة أولاً');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const sellerId = user?.email || user?.phone || postDraft.draftId || 'guest';
      const generated = await generateListing({
        raw,
        categorySlug: postDraft.categorySlug || '',
        subcategorySlug: postDraft.subcategorySlug || '',
        arabic: isArabic,
        city: postDraft.city,
        countryCode: browseCountryCode,
        uniqueId: sellerId,
      });
      updatePostDraft({
        title: generated.title,
        price: generated.price || postDraft.price || '',
        description: generated.description,
        city: generated.city || postDraft.city,
        generated,
      });
      navigateTo('post-ai-review');
    } catch (err: unknown) {
      const failure = err instanceof Error ? err : new Error(String(err));
      setError(failure.message || 'تعذر إنشاء الإعلان');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSubmit = (fields: { title: string; price: string; description: string }) => {
    const generated = {
      ...fields,
      categorySlug: postDraft.categorySlug || '',
      subcategorySlug: postDraft.subcategorySlug || '',
      city: postDraft.city || '',
      missing: [],
    };
    updatePostDraft({ ...fields, generated });
  };

  return { prompt, setPrompt, isGenerating, handleGenerate, handleManualSubmit, error };
}
