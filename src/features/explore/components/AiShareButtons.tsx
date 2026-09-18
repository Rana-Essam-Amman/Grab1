import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { SOCIAL_BRANDS } from '@/data/socialBrands';

interface AiShareButtonsProps {
  isArabic: boolean;
  onShare: (platform: 'whatsapp' | 'messenger' | 'facebook' | 'telegram') => void;
}

export const AiShareButtons: React.FC<AiShareButtonsProps> = ({ isArabic, onShare }) => {
  const renderSocialButton = (platform: 'whatsapp' | 'messenger' | 'facebook' | 'telegram', label: string) => {
    const brand = SOCIAL_BRANDS[platform];
    return (
      <Button
        key={platform}
        variant="ghost"
        size="md"
        onClick={() => onShare(platform)}
        className="flex items-center justify-start gap-2.5 p-3 rounded-2xl border active:scale-98 transition-all cursor-pointer font-bold text-xs h-auto"
        style={{
          backgroundColor: `${brand.color}1A`,
          borderColor: `${brand.color}33`,
          color: brand.color,
        }}
      >
        <div
          className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0"
          style={{ backgroundColor: brand.color }}
        >
          <Share2 size={16} />
        </div>
        <span>{label}</span>
      </Button>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 pt-2">
      {renderSocialButton('whatsapp', isArabic ? 'واتساب WhatsApp' : SOCIAL_BRANDS.whatsapp.name)}
      {renderSocialButton('messenger', isArabic ? 'ماسينجر Messenger' : SOCIAL_BRANDS.messenger.name)}
      {renderSocialButton('facebook', isArabic ? 'فيسبوك Facebook' : SOCIAL_BRANDS.facebook.name)}
      {renderSocialButton('telegram', isArabic ? 'تيليجرام Telegram' : SOCIAL_BRANDS.telegram.name)}
    </div>
  );
};
