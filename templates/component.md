# Component Anatomy & Compliance Guide

Rule 14 Limit: Max 120 lines.

## Responsibilities
- Purely presentational or lightly interactive view elements.
- Accept typed props. Do not fetch data directly or import global stores.

## Skeleton Template
\`\`\`tsx
import React from 'react';
import { Button } from '@/shared/ui/Button';

export interface MyComponentProps {
  title: string;
  onAction: () => void;
  isArabic: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
  isArabic,
}) => {
  return (
    <div className="p-4 bg-surface rounded-xl border border-border" dir={isArabic ? 'rtl' : 'ltr'}>
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <Button onClick={onAction} className="mt-3">Action</Button>
    </div>
  );
};
\`\`\`

## Reference
- See `src/features/auth/components/CountrySelector.tsx`.
