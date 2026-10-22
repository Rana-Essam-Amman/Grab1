import React from 'react';
import { usePostAdEntry } from '../hooks/usePostAdEntry';
import { Icon } from '@iconify/react';
import { Button } from '@/shared/ui/Button';
import type { MarketCode } from '@/data/markets/types';

const MARKET_NAMES: Record<string, string> = {
  JO: 'الأردن',
  SA: 'السعودية',
  LB: 'لبنان',
  PS: 'فلسطين',
  SY: 'سوريا',
};

export const PostAdEntryScreen = () => {
  const {
    isArabic,
    handleBack,
    startPostFlow,
    canPostInMarket,
    myMarket,
    freeLimit,
    freeRemaining,
    updateUserMarket,
  } = usePostAdEntry();

  const header = (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <button
        onClick={handleBack}
        className="p-2 rounded-full hover:bg-surface transition-colors"
      >
        <Icon
          icon="lucide:arrow-right"
          className={isArabic ? '' : 'rotate-180'}
        />
      </button>
      <h2 className="text-lg font-bold text-ink">
        {isArabic ? 'إضافة إعلان' : 'Post Ad'}
      </h2>
      <div className="w-10" />
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
          <div className="text-center px-4 mb-4">
            <h3
              id="post-ad-blocked-title"
              className="text-xl font-bold text-ink mb-2"
            >
              {isArabic
                ? 'اختر السوق الذي تريد النشر فيه'
                : 'Select the market you want to post in'}
            </h3>

            <p className="text-sm text-ink-muted">
              {isArabic
                ? 'يرجى تحديد الدولة لمتابعة النشر'
                : 'Please select your country to continue posting'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {(['JO', 'SA', 'LB', 'PS', 'SY'] as MarketCode[]).map((m) => (
              <button
                key={m}
                onClick={() => updateUserMarket(m)}
                className="p-4 border border-border bg-surface rounded-xl font-bold text-ink hover:border-primary hover:text-primary transition-all"
              >
                {MARKET_NAMES[m]}
              </button>
            ))}
          </div>
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

      <div className="p-6 flex flex-col gap-5 flex-1 items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon
            icon="lucide:plus-circle"
            width={48}
            height={48}
            className="text-primary"
          />
        </div>

        <div className="text-center px-4">
          <h3 className="text-xl font-bold text-ink mb-2">
            {isArabic ? 'أضف إعلانك الآن' : 'Post your ad now'}
          </h3>

          <p className="text-sm text-ink-muted mb-6">
            {isArabic
              ? `يمكنك نشر ${freeRemaining} إعلانات مجانية متبقية في ${MARKET_NAMES[myMarket || 'JO']}`
              : `You can post ${freeRemaining} more free ads in ${myMarket || 'JO'}`}
          </p>
        </div>

        <Button
          onClick={startPostFlow}
          size="lg"
          className="w-full mt-4"
          disabled={freeRemaining <= 0}
        >
          {isArabic ? 'بدء النشر' : 'Start Posting'}
        </Button>
      </div>
    </div>
  );
};
