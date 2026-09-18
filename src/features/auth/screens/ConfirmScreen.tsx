import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { useDraft } from '@/hooks/useDraft';
import { useListings } from '@/hooks/useListings';
import React, { useState, useCallback } from 'react';
import { Listing } from '@/types';
import { ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const ConfirmScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo, browseCountryCode, activeCurrency, setActiveTab } = useUI();
  const { registrationPendingUser, confirmRegistration } = useAuth();
  const { postDraft, resetPostDraft } = useDraft();
  const { addListing } = useListings();

  const [otp, setOtp] = useState('');
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  }, []);

  const handleVerify = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    confirmRegistration();

    // If user was in middle of posting an ad:
    if (postDraft.generated) {
      const gen = postDraft.generated;
      const newListing: Listing = {
        id: 'listing-' + Date.now(),
        title: gen.title,
        description: gen.description,
        price: gen.price || '0',
        currency: activeCurrency,
        countryCode: browseCountryCode,
        city: postDraft.city || 'عمّان',
        neighborhood: postDraft.neighborhood || '',
        categorySlug: gen.categorySlug || postDraft.categorySlug,
        subcategorySlug: gen.subcategorySlug || postDraft.subcategorySlug,
        imageUrl: postDraft.photos[0] || '/assets/listings/car.jpg',
        images: postDraft.photos.length > 0 ? postDraft.photos : ['/assets/listings/car.jpg'],
        sellerPhone: registrationPendingUser?.phone || '',
        sellerName: `${registrationPendingUser?.firstName || 'User'} ${registrationPendingUser?.lastName || ''}`.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        views: 1,
        attributes: [
          { label: 'Category', value: gen.categorySlug || postDraft.categorySlug },
          { label: 'City', value: postDraft.city },
        ],
      };
      addListing(newListing, browseCountryCode, isArabic);
      resetPostDraft();
      setActiveTab('my-ads');
      navigateTo('main');
      return;
    }

    setActiveTab('explore');
    navigateTo('main');
  }, [
    confirmRegistration,
    postDraft,
    activeCurrency,
    browseCountryCode,
    registrationPendingUser,
    addListing,
    resetPostDraft,
    setActiveTab,
    navigateTo,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <BackIcon size={18} />
        </Button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'تأكيد رمز التحقق' : 'Confirm Verification Code'}
        </h1>
      </div>

      <form onSubmit={handleVerify} className="p-4 flex flex-col gap-5 flex-1 items-center justify-center max-w-sm mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-background text-primary flex items-center justify-center">
          <KeyRound size={32} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink">
            {isArabic ? 'أدخل الرمز المرسل لهاتفك' : 'Enter Verification Code'}
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {isArabic
              ? `تم إرسال رمز تجريبي إلى ${registrationPendingUser?.phone || 'رقم هاتفك'}`
              : `A code was sent to ${registrationPendingUser?.phone || 'your phone'}`}
          </p>
        </div>

        <div className="w-full">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            className="w-full h-14 text-center tracking-[12px] text-2xl font-bold rounded-2xl bg-surface border-2 border-border text-ink focus:outline-none focus:border-primary [direction:ltr]"
          />
          <span className="text-[11px] text-ink-muted mt-2 block">
            {isArabic ? 'رمز التجربة السريع: 1234' : 'Quick demo code: 1234'}
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!otp.trim()}
          className="mt-2"
        >
          {isArabic ? 'تأكيد ودخول' : 'Confirm & Continue'}
        </Button>
      </form>
    </div>
  );
};
