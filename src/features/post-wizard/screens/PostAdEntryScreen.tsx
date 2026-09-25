import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { usePostAdEntry } from '../hooks/usePostAdEntry';
import { Icon } from '@iconify/react';

export const PostAdEntryScreen: React.FC = () => {
  const { isArabic, handleBack, handleAI, handleTraditional } = usePostAdEntry();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div
      id="post-ad-entry-screen"
      className="flex flex-col min-h-screen bg-surface pb-12"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Bar */}
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

      <div className="p-4 flex flex-col gap-5 flex-1">
        <div>
          <h3 className="text-base font-bold text-ink mb-1">
            {isArabic ? 'اختر طريقة النشر' : 'Choose how to post'}
          </h3>
          <p className="text-xs text-ink-muted">
            {isArabic
              ? 'اختر بين الذكاء الاصطناعي السريع أو النموذج التقليدي التفصيلي'
              : 'Select between fast AI draft or traditional structured forms'}
          </p>
        </div>

        {/* Option 1 - AI (Primary) */}
        <button
          type="button"
          id="post-ad-entry-ai"
          data-testid="post-entry-ai-card"
          onClick={handleAI}
          aria-label={isArabic ? 'باستخدام الذكاء الاصطناعي' : 'Using AI'}
          className="w-full text-start bg-surface border-2 border-brand/40 hover:border-brand/60 rounded-2xl p-5 flex gap-4 items-center cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
            <Icon icon="fluent-emoji:sparkles" width={32} height={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-ink font-cairo">
              {isArabic ? 'باستخدام الذكاء الاصطناعي' : 'Using AI'}
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              {isArabic
                ? 'صور + وصف أو صوت، والإعلان جاهز'
                : 'Photos + text/voice, listing ready'}
            </p>
          </div>
        </button>

        {/* Option 2 - Traditional (Secondary) */}
        <button
          type="button"
          id="post-ad-entry-traditional"
          data-testid="post-entry-traditional-card"
          onClick={handleTraditional}
          aria-label={isArabic ? 'الطريقة التقليدية' : 'Traditional'}
          className="w-full text-start bg-surface border border-line hover:border-line-muted rounded-2xl p-5 flex gap-4 items-center cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-ink-muted/5 flex items-center justify-center shrink-0">
            <Icon icon="fluent-emoji:memo" width={32} height={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-ink font-cairo">
              {isArabic ? 'الطريقة التقليدية' : 'Traditional'}
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              {isArabic ? 'املأ الحقول خطوة بخطوة' : 'Fill fields step by step'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
