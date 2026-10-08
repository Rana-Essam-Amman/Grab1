import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { usePostAdEntry } from '../hooks/usePostAdEntry';
import { Icon } from '@iconify/react';
import { MARKETS } from '@/data/markets/config';

export const PostAdEntryScreen: React.FC = () => {
  const { isArabic, handleBack, startPostFlow, canPostInMarket, myMarket, freeLimit, freeRemaining } = usePostAdEntry();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const marketNameAr = myMarket && MARKETS[myMarket]
    ? MARKETS[myMarket].nameAr
    : '';

  const header = (
    <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
      <Button
        id="post-ad-entry-back-btn"
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="w-10 h-10 rounded-full bg-surface/15 text-white hover:bg-surface/25 cursor-pointer flex items-center justify-center p-0"
        aria-label={isArabic ? 'رجوع' : 'Back'}
      >
        <BackIcon size={18} variant="Linear" color="currentColor" className="text-white" />
      </Button>
      <h2 className="text-lg font-bold text-white">
        {isArabic ? 'نشر إعلان' : 'Post Ad'}
      </h2>
    </div>
  );

  if (!canPostInMarket) {
    return (
      <div
        id="post-ad-entry-screen"
        className="flex flex-col min-h-screen bg-surface pb-12"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {header}
        <div className="p-6 flex flex-col gap-5 flex-1 items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <Icon icon="fluent-emoji:prohibited" width={48} height={48} />
          </div>
          <div className="text-center px-4">
            <h3
              id="post-ad-blocked-title"
              className="text-xl font-bold text-ink mb-2"
            >
              {isArabic
                ? `لا يمكنك النشر إلا في سوق ${marketNameAr}`
                : `You can only post in ${myMarket ?? 'your market'}`}
            </h3>
            <p className="text-sm text-ink-muted">
              {isArabic
                ? 'تصفح وتواصل بحرية — لكن النشر فقط في سوق حسابك.'
                : 'Browse and contact freely — publishing only in your account market.'}
            </p>
          </div>
          <Button
            id="post-ad-blocked-back"
            onClick={handleBack}
            size="lg"
            className="w-full mt-8"
            aria-label={isArabic ? 'رجوع إلى السوق' : 'Back to market'}
          >
            {isArabic ? 'رجوع' : 'Back'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="post-ad-entry-screen"
      className="flex flex-col min-h-screen bg-surface pb-12"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {header}
      <div className="p-4 flex flex-col gap-5 flex-1 items-center justify-center">
        <div
          id="post-ad-free-remaining"
          data-testid="post-ad-free-remaining"
          data-free-remaining={freeRemaining}
          data-free-limit={freeLimit}
          className={
            freeRemaining > 0
              ? 'w-full max-w-xs rounded-full px-4 py-2 text-center text-xs font-bold bg-brand/10 text-brand border border-brand/20'
              : 'w-full max-w-xs rounded-full px-4 py-2 text-center text-xs font-bold bg-danger/10 text-danger border border-danger/20'
          }
        >
          {freeRemaining > 0
            ? isArabic
              ? `عندك ${freeRemaining} من ${freeLimit} إعلانات مجانية`
              : `${freeRemaining} of ${freeLimit} free ads remaining`
            : isArabic
              ? 'استهلكت الإعلانات المجانية — الإعلان القادم مدفوع'
              : 'Free ads used — next ad is paid'}
        </div>
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
