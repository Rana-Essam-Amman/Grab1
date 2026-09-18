import { useDraft } from '@/hooks/useDraft';
import { PostDraft } from '@/types';
import { useUI } from '@/hooks/useUI';

export interface UsePostWizardReturn {
  postDraft: PostDraft;
  updatePostDraft: (updates: Partial<PostDraft>) => void;
  resetDraft: () => void;
  startPostFlow: () => void;
}

export function usePostWizard(): UsePostWizardReturn {
  const { postDraft, updatePostDraft, resetPostDraft, startPostFlow } = useDraft();
  const { navigateTo, setActiveTab } = useUI();

  const resetDraft = () => {
    resetPostDraft();
    setActiveTab('explore');
    navigateTo('main');
  };

  return { postDraft, updatePostDraft, resetDraft, startPostFlow };
}
