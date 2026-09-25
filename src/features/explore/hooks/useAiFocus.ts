import { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';

export interface UseAiFocusReturn {
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
}

export const useAiFocus = (): UseAiFocusReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const { setIsAiFocused } = useUI();

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setIsAiFocused(true);
  }, [setIsAiFocused]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsAiFocused(false);
  }, [setIsAiFocused]);

  return {
    isFocused,
    handleFocus,
    handleBlur,
  };
};
