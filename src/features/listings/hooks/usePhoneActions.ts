import { useState, useCallback } from 'react';
import { useRevealPhone } from './useRevealPhone';
import { getWhatsAppUrl } from '../helpers/listingDerivedData';
import { composeIntentMessage, WhatsAppIntent } from '../helpers/whatsappIntents';
import { Listing } from '@/types';

export function usePhoneActions(listing: Listing | null, isArabic: boolean) {
  const { revealPhone, isRevealing } = useRevealPhone(listing?.id, listing?.sellerPhone, isArabic, listing?.countryCode);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'call' | 'whatsapp'; intent?: WhatsAppIntent } | null>(null);

  const handleCall = useCallback(async () => {
    try {
      const num = await revealPhone();
      if (num) window.location.href = `tel:${num}`;
    } catch (err) {
      if (err instanceof Error && err.message === 'CAPTCHA_REQUIRED') {
        setPendingAction({ type: 'call' });
        setShowCaptcha(true);
      }
    }
  }, [revealPhone]);

  const handleWhatsApp = useCallback(async (intent?: WhatsAppIntent) => {
    try {
      const num = await revealPhone();
      if (num && listing) {
        const customMessage = intent ? composeIntentMessage(intent.body, listing, isArabic) : undefined;
        window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic, customMessage }), '_blank');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'CAPTCHA_REQUIRED') {
        setPendingAction({ type: 'whatsapp', intent });
        setShowCaptcha(true);
      }
    }
  }, [revealPhone, listing, isArabic]);

  const handleCaptchaVerify = useCallback(async (token: string) => {
    setShowCaptcha(false);
    try {
      const num = await revealPhone(token);
      if (num && listing && pendingAction) {
        if (pendingAction.type === 'call') {
          window.location.href = `tel:${num}`;
        } else if (pendingAction.type === 'whatsapp') {
          const customMessage = pendingAction.intent ? composeIntentMessage(pendingAction.intent.body, listing, isArabic) : undefined;
          window.open(getWhatsAppUrl({ countryCode: listing.countryCode, dialNumber: num, listingTitle: listing.title, isArabic, customMessage }), '_blank');
        }
        setPendingAction(null);
      }
    } catch (err) {
      if (err instanceof Error && err.message !== 'CAPTCHA_REQUIRED') {
        setPendingAction(null);
      }
    }
  }, [revealPhone, pendingAction, listing, isArabic]);

  return { handleCall, handleWhatsApp, showCaptcha, setShowCaptcha, handleCaptchaVerify, isRevealingPhone: isRevealing };
}
