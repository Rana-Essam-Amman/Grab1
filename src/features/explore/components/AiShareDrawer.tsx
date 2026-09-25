import React from 'react';
import { ExportSquare } from 'iconsax-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { AiShareButtons } from './AiShareButtons';

export interface AiShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaim: () => void;
  isArabic: boolean;
}

export const AiShareDrawer: React.FC<AiShareDrawerProps> = ({
  isOpen,
  onClose,
  onRewardClaim,
  isArabic,
}) => {
  const shareText = isArabic
    ? 'تطبيق الصفقات الذكية الأول! بيع واشتري بالصوت والذكاء الاصطناعي:'
    : 'Smartest Marketplace app! Buy and sell with AI:';

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'https://app.krakeeb.com';
  };

  const handleShare = (platform: 'whatsapp' | 'messenger' | 'facebook' | 'telegram') => {
    const url = getShareUrl();
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${url}`)}`;
        break;
      case 'messenger':
        shareUrl = `fb-messenger://share?link=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    onRewardClaim();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      className="font-cairo p-5"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg">
              🎁
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-ink">
                {isArabic ? 'شارك واحصل على ٥ محاولات مجاناً' : 'Share & Unlock 5 Free Credits'}
              </h3>
              <p className="text-[11px] text-ink-muted">
                {isArabic ? 'شارك التطبيق مع أصدقائك وفعّل محاولاتك فوراً' : 'Share the app with friends to unlock credits'}
              </p>
            </div>
          </div>
        </div>

        <AiShareButtons isArabic={isArabic} onShare={handleShare} />

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              try {
                navigator.clipboard.writeText(getShareUrl());
              } catch {}
              onRewardClaim();
            }}
            className="flex-1 font-bold text-xs h-auto py-3 cursor-pointer"
          >
            <ExportSquare size={15} variant="Linear" color="#64748B" className="text-ink-soft" />
            <span>{isArabic ? 'نسخ رابط التطبيق' : 'Copy App Link'}</span>
          </Button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                navigator
                  .share({
                    title: 'Catch The Deals',
                    text: shareText,
                    url: getShareUrl(),
                  })
                  .catch(() => {});
                onRewardClaim();
              }}
              className="font-bold text-xs h-auto py-3 cursor-pointer"
            >
              <span>{isArabic ? 'مشاركة عبر النظام' : 'Native Share'}</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
