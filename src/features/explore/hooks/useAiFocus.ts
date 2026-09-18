import { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';

export interface UseAiFocusReturn {
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
}

export const useAiFocus = (): UseAiFocusReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const { setHeaderHidden } = useUI() as unknown as { setHeaderHidden?: (hidden: boolean) => void };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (setHeaderHidden) setHeaderHidden(true);
  }, [setHeaderHidden]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (setHeaderHidden) setHeaderHidden(false);
  }, [setHeaderHidden]);

  return {
    isFocused,
    handleFocus,
    handleBlur,
  };
};
