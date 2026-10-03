import React from 'react';
import { TickCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';

export const PublishSuccessScreen: React.FC = () => {
  const { isArabic, setActiveTab, navigateTo } = useUI();
  const { resetPostDraft } = useDraft();

  const handleViewListing = () => {
    setActiveTab('my-ads');
    navigateTo('main');
  };

  const handleAddAnother = () => {
    resetPostDraft();
    navigateTo('post-category');
  };

  return (
    <div
      id="publish-success-screen"
      className="flex flex-col min-h-screen bg-canvas items-center justify-center p-6 text-center"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col items-center max-w-sm w-full mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-[scale-in_400ms_cubic-bezier(0.16,1,0.3,1)]">
          <TickCircle size={44} variant="Bold" color="#10B981" />
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2 animate-[fade-in_300ms_ease-out]">
          {isArabic ? 'تم نشر الإعلان' : 'Listing Published'}
        </h1>

        <p className="text-sm text-ink-muted mb-8 animate-[fade-in_300ms_ease-out]">
          {isArabic ? 'إعلانك متاح الآن للجميع' : 'Your ad is now live'}
        </p>

        <div className="w-full flex flex-col gap-3 animate-[slide-up_250ms_ease-out]">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleViewListing}
          >
            {isArabic ? 'شاهد الإعلان' : 'View Listing'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleAddAnother}
          >
            {isArabic ? 'أضف إعلان آخر' : 'Post Another Ad'}
          </Button>
        </div>
      </div>
    </div>
  );
};
