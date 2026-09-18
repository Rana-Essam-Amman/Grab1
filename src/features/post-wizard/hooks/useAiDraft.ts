import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';

export interface UseAiDraftReturn {
  prompt: string;
  setPrompt: (p: string) => void;
  isGenerating: boolean;
  handleGenerate: () => Promise<void>;
  handleManualSubmit: (fields: {title: string, price: string, description: string}) => void;
  error: string | null;
}

export function useAiDraft(): UseAiDraftReturn {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { postDraft, updatePostDraft } = usePostWizard();
  const { navigateTo } = useUI();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const city = postDraft.city || 'المدينة';
      const neighborhood = postDraft.neighborhood || 'الحي';
      
      const title = `${postDraft.categorySlug || 'إعلان'} في ${city}`;
      const price = '500';
      const description = `إعلان جديد في ${city} - ${neighborhood}. للحصول على مزيد من التفاصيل يرجى التواصل.`;
      
      const generated = {
        title,
        price,
        description,
        categorySlug: postDraft.categorySlug || '',
        subcategorySlug: postDraft.subcategorySlug || '',
        city,
        missing: []
      };

      updatePostDraft({ title, price, description, generated });
      navigateTo('post-ai-review');
    } catch (err: any) {
      setError(err.message || 'Error generating draft');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSubmit = (fields: {title: string, price: string, description: string}) => {
    const generated = {
      ...fields,
      categorySlug: postDraft.categorySlug || '',
      subcategorySlug: postDraft.subcategorySlug || '',
      city: postDraft.city || '',
      missing: []
    };
    updatePostDraft({ ...fields, generated });
  };

  return { prompt, setPrompt, isGenerating, handleGenerate, handleManualSubmit, error };
}
