import React from 'react';
import { usePostAdEntry } from '../hooks/usePostAdEntry';
import { Icon } from '@iconify/react';
import { Button } from '@/shared/ui/Button';
import type { MarketCode } from '@/data/markets/types';
import { toast } from 'sonner';
import { useUI } from '@/hooks/useUI';

const MARKET_NAMES: Record<string, string> = {
  JO: 'الأردن', SA: 'السعودية', LB: 'لبنان', PS: 'فلسطين', SY: 'سوريا',
};

export const PostAdEntryScreen = () => {
  const { isArabic, handleBack, startPostFlow, canPostInMarket, myMarket, freeRemaining, updateUserMarket } = usePostAdEntry();
  const { navigateTo } = useUI();

  const handleSelectMarket = async (m: MarketCode) => {
    const success = await updateUserMarket?.(m);
    if (!success) {
      toast.error(isArabic ? 'فشل تحديث الدولة، يرجى المحاولة مرة أخرى' : 'Failed to update market, please try again');
    }
  };

  const header = (
    <header className="sticky top-0 z-50 px-4 pt-2 pb-2 bg-brand border-b border-white/20">
      <div className="flex items-center justify-between gap-2">
        <div className="w-12 shrink-0 flex items-center justify-start">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={isArabic ? 'رجوع' : 'Back'}
          >
            <Icon icon="lucide:arrow-right" className={`text-white ${isArabic ? '' : 'rotate-180'}`} width={20} height={20} />
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigateTo('main')}>
          <img
            src="/assets/icons/logo.png"
            alt="FOX Marketplace"
            className="w-[40px] h-[40px] object-cover rounded-full shrink-0 mix-blend-lighten"
          />
          <div className="flex flex-col justify-center items-center m-0 p-0">
            <h1 className="text-[24px] font-black text-white font-cairo tracking-[2px] leading-[0.95] m-0">FOX</h1>
            <span className="text-[8px] font-semibold text-white tracking-[4px] uppercase leading-none mt-0.5 m-0 block">Marketplace</span>
          </div>
        </div>
        <div className="w-12 shrink-0" />
      </div>
    </header>
  );

  if (!canPostInMarket) {
    return (
      <div id="post-ad-entry-screen" className="flex flex-col min-h-screen bg-canvas pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
        {header}
        <div className="p-6 flex flex-col gap-5 flex-1 items-center justify-center">
          <div className="text-center px-4 mb-4">
            <h3 id="post-ad-entry-blocked-title" className="text-xl font-bold text-ink mb-2">
              {isArabic ? 'اختر السوق الذي تريد النشر فيه' : 'Select the market you want to post in'}
            </h3>
            <p className="text-sm text-ink-muted">
              {isArabic ? 'يرجى تحديد الدولة لمتابعة النشر' : 'Please select your country to continue posting'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {(Object.keys(MARKET_NAMES) as MarketCode[]).map((m) => (
              <button key={m} onClick={() => handleSelectMarket(m)} className="p-4 border border-border bg-surface rounded-xl font-bold text-ink hover:border-primary hover:text-primary transition-all shadow-sm">
                {MARKET_NAMES[m]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="post-ad-entry-screen" className="flex flex-col min-h-screen bg-canvas pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {header}
      <div className="p-6 flex flex-col gap-5 flex-1 items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-sm">
          <Icon icon="lucide:plus-circle" width={48} height={48} className="text-primary" />
        </div>
        <div className="text-center px-4">
          <h3 className="text-2xl font-bold text-ink mb-2">{isArabic ? 'أضف إعلانك الآن' : 'Post your ad now'}</h3>
          <p className="text-sm text-ink-muted mb-6">
            {isArabic ? `يمكنك نشر ${freeRemaining} إعلانات مجانية متبقية في ${MARKET_NAMES[myMarket || 'JO']}` : `You can post ${freeRemaining} more free ads in ${myMarket || 'JO'}`}
          </p>
        </div>
        {freeRemaining <= 0 ? (
          <Button id="post-ad-entry-upgrade" onClick={() => navigateTo('pricing')} size="lg" className="w-full mt-4" variant="primary">
            {isArabic ? 'ترقية الباقة للنشر' : 'Upgrade Plan to Post'}
          </Button>
        ) : (
          <Button id="post-ad-entry-start" onClick={startPostFlow} size="lg" className="w-full mt-4">
            {isArabic ? 'بدء النشر' : 'Start Posting'}
          </Button>
        )}
      </div>
    </div>
  );
};
