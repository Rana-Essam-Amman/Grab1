# Custom Hook Anatomy & Compliance Guide

Rule 14 Limit: Max 100 lines.

## Responsibilities
- Encapsulate domain state and event handlers using `useCallback` and `useState`.
- Interact with Zustand stores or React Query.
- Return a strongly typed return object.

## Skeleton Template
\`\`\`ts
import { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';

export interface UseMyFeatureReturn {
  value: string;
  setValue: (v: string) => void;
  handleSubmit: () => void;
  isArabic: boolean;
}

export const useMyFeature = (): UseMyFeatureReturn => {
  const [value, setValue] = useState('');
  const { isArabic } = useUI();

  const handleSubmit = useCallback(() => {
    // Logic here
  }, [value]);

  return {
    value,
    setValue,
    handleSubmit,
    isArabic,
  };
};
\`\`\`

## Reference
- See `src/features/auth/hooks/useDemoAuth.ts`.
