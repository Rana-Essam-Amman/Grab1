import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Listing } from '@/types';
import { Link2, Check, Share2 } from 'lucide-react';
import { getSanitizedCurrency } from '@/data/countries';
import { SHARE_PLATFORMS } from './sharePlatforms.config';
import { copyTextToClipboard } from './shareUtils';

export interface ShareItem {
  id: string;
  name: string;
  bgColor: string;
  shadowColor: string;
  icon: React.ReactNode;
  action: () => void;
}

export const useShareItems = (listing: Listing, isArabic: boolean) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const displayCurrency = useMemo(
    () => getSanitizedCurrency(listing.countryCode, listing.currency),
    [listing.countryCode, listing.currency]
  );
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${listing.title} - ${listing.price} ${displayCurrency} ${isArabic ? 'على تطبيق Catch the Deals' : 'on Catch the Deals'}`;

  const handleCopyLink = useCallback(async () => {
    await copyTextToClipboard(shareUrl);
    setCopied(true);
    setToastMessage(isArabic ? 'تم نسخ رابط الإعلان بنجاح! 📋' : 'Listing link copied successfully! 📋');

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, [shareUrl, isArabic]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: listing.title, text: shareText, url: shareUrl });
      } catch {
        // User cancelled or share failed silently
      }
    }
  }, [listing.title, shareText, shareUrl]);

  const handleWhatsApp = useCallback(() => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank');
  }, [shareText, shareUrl]);

  const handleInstagram = useCallback(async () => {
    await copyTextToClipboard(shareUrl);
    setToastMessage(isArabic ? 'تم نسخ الرابط. الصقه في Instagram' : 'Link copied. Paste it on Instagram');

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);

    window.open('https://instagram.com', '_blank');
  }, [shareUrl, isArabic]);

  const handleMessenger = useCallback(() => {
    const messengerUrl = `https://www.facebook.com/dialog/send?app_id=291494419107576&link=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(messengerUrl, '_blank');
  }, [shareUrl]);

  const handleFacebook = useCallback(() => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank');
  }, [shareUrl]);

  const handleTelegram = useCallback(() => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
  }, [shareText, shareUrl]);

  const actionMap: Record<string, () => void> = useMemo(
    () => ({
      whatsapp: handleWhatsApp,
      instagram: handleInstagram,
      messenger: handleMessenger,
      facebook: handleFacebook,
      telegram: handleTelegram,
    }),
    [handleWhatsApp, handleInstagram, handleMessenger, handleFacebook, handleTelegram]
  );

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareItems = useMemo(() => {
    const items: ShareItem[] = SHARE_PLATFORMS.map((platform) => ({
      id: platform.id,
      name: platform.getName(isArabic),
      bgColor: platform.bgColor,
      shadowColor: platform.shadowColor,
      icon: platform.icon,
      action: actionMap[platform.id],
    }));

    items.push({
      id: 'copylink',
      name: isArabic ? 'نسخ الرابط' : 'Copy Link',
      bgColor: copied ? 'bg-success text-white' : 'bg-background text-ink hover:bg-border border border-border',
      shadowColor: 'shadow-2xs',
      icon: copied ? <Check size={22} className="text-white" /> : <Link2 size={22} className="text-ink" />,
      action: handleCopyLink,
    });

    if (hasNativeShare) {
      items.unshift({
        id: 'nativeshare',
        name: isArabic ? 'مشاركة' : 'Share',
        bgColor: 'bg-primary text-white hover:bg-primary-hover',
        shadowColor: 'shadow-[0_4px_14px_rgba(27,42,74,0.35)]',
        icon: <Share2 size={22} className="text-white" />,
        action: handleNativeShare,
      });
    }

    return items;
  }, [isArabic, copied, actionMap, handleCopyLink, handleNativeShare, hasNativeShare]);

  return { shareItems, toastMessage, displayCurrency };
};
