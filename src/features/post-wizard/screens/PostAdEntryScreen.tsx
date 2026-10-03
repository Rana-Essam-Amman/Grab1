import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { usePostAdEntry } from '../hooks/usePostAdEntry';
import { Icon } from '@iconify/react';

export const PostAdEntryScreen: React.FC = () => {
  const { isArabic, handleBack, startPostFlow } = usePostAdEntry();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div
      id="post-ad-entry-screen"
      className="flex flex-col min-h-screen bg-surface pb-12"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
        <Button
          id="post-ad-entry-back-btn"
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"
          aria-label={isArabic ? 'رجوع' : 'Back'}
        >
          <BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" />
        </Button>
        <h2 className="text-lg font-bold text-white">
          {isArabic ? 'نشر إعلان' : 'Post Ad'}
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-5 flex-1 items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-4">
          <Icon icon="fluent-emoji:rocket" width={48} height={48} />
        </div>

        <div className="text-center px-4">
          <h3 className="text-xl font-bold text-ink mb-2">
            {isArabic ? 'جاهز لنشر إعلانك؟' : 'Ready to post your ad?'}
          </h3>
          <p className="text-sm text-ink-muted">
            {isArabic
              ? 'انشر إعلانك في أقل من دقيقة'
              : 'Post your ad in under a minute'}
          </p>
        </div>

        <Button
          id="post-ad-entry-start"
          onClick={startPostFlow}
          size="lg"
          className="w-full mt-8"
        >
          {isArabic ? 'نشر إعلان جديد' : 'Post New Ad'}
        </Button>
      </div>
    </div>
  );
};
