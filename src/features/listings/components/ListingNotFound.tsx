import React from 'react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';

export interface ListingNotFoundProps {
  isArabic: boolean;
  onGoBack: () => void;
}

export const ListingNotFound: React.FC<ListingNotFoundProps> = React.memo(({ isArabic, onGoBack }) => (
  <div className="max-w-[440px] mx-auto w-full min-h-[60vh] flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
    <EmptyState
      title={isArabic ? 'الإعلان غير موجود أو تم حذفه' : 'Listing not found or removed'}
      action={
        <Button variant="primary" size="md" onClick={onGoBack}>
          {isArabic ? 'العودة' : 'Go back'}
        </Button>
      }
    />
  </div>
));

ListingNotFound.displayName = 'ListingNotFound';
