import { useCallback, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import { useAuth } from '@/hooks/useAuth';
import { globalStorage } from '@/shared/lib/marketStorage';

export interface UsePostAdEntryReturn {
  isArabic: boolean;
  handleBack: () => void;
  handleAI: () => void;
  handleTraditional: () => void;
}

export const usePostAdEntry = (): UsePostAdEntryReturn => {
  const { isArabic, goBack, navigateTo, setActiveTab, setAiFlowPending } = useUI();
  const { startPostFlow } = useDraft();
  const { authStatus, isAnonymous } = useAuth();

  // Guard: only signed-in users can access the post wizard.
  // Visitors are sent to the unified login gateway. After sign-in, the listener
  // routes them back to post-ad-entry.
  useEffect(() => {
    if (authStatus !== 'authenticated' || isAnonymous) {
      globalStorage().set('catch_pending_post_entry', 'true');
      navigateTo('login');
    }
  }, [authStatus, isAnonymous, navigateTo]);

  const handleBack = useCallback(() => {
    setActiveTab('explore');
    goBack();
  }, [setActiveTab, goBack]);

  const handleAI = useCallback(() => {
    startPostFlow();
    setAiFlowPending(true);
    navigateTo('post-category');
  }, [startPostFlow, setAiFlowPending, navigateTo]);

  const handleTraditional = useCallback(() => {
    startPostFlow();
    setAiFlowPending(false);
    navigateTo('post-category');
  }, [startPostFlow, setAiFlowPending, navigateTo]);

  return { isArabic, handleBack, handleAI, handleTraditional };
};
