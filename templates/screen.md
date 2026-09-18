# Screen Anatomy & Compliance Guide

Rule 14 Limit: Max 150 lines.

## Responsibilities
- Act strictly as a thin router / container view.
- Max 3 useState hooks.
- Delegate all business logic and state management to custom hooks in `hooks/`.
- Delegate presentational UI blocks to modular components in `components/`.

## Skeleton Template
\`\`\`tsx
import React from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';
import { MyFeatureHook } from '../hooks/useMyFeature';
import { MySubComponent } from '../components/MySubComponent';

export const MyFeatureScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { t } = useTranslation();
  const { state, actions } = MyFeatureHook();

  return (
    <div className="flex flex-col min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      <MySubComponent state={state} actions={actions} />
    </div>
  );
};
\`\`\`

## Reference
- See `src/features/auth/screens/LoginScreen.tsx` for state machine routing.
