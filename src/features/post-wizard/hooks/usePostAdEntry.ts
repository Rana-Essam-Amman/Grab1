import { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';

export interface UsePostAdEntryReturn {
  isArabic: boolean;
  handleBack: () => void;
  handleAI: () => void;
  handleTraditional: () => void;
}

export const usePostAdEntry = (): UsePostAdEntryReturn => {
  const { isArabic, goBack, navigateTo, setActiveTab } = useUI();
  const { startPostFlow } = useDraft();

  const handleBack = useCallback(() => {
    setActiveTab('explore');
    goBack();
  }, [setActiveTab, goBack]);

  const handleAI = useCallback(() => {
    startPostFlow();
    navigateTo('post-ai-capture');
  }, [startPostFlow, navigateTo]);

  const handleTraditional = useCallback(() => {
    startPostFlow();
    navigateTo('post-category');
  }, [startPostFlow, navigateTo]);

  return { isArabic, handleBack, handleAI, handleTraditional };
};
