import React from 'react';
import { Sparkles, Gift } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface ProfileQuotaCardProps {
  isArabic: boolean;
  dailyAiCredits: number;
  handleShare: () => void;
}

export const ProfileQuotaCard: React.FC<ProfileQuotaCardProps> = ({
  isArabic,
  dailyAiCredits,
  handleShare,
}) => {
  return (
    <div
      className={`w-full rounded-2xl p-4 border transition-all shadow-2xs flex flex-col gap-3 font-cairo ${
        dailyAiCredits === 0
          ? 'bg-gradient-to-br from-primary/10 via-surface to-primary/5 border-primary/50'
          : 'bg-surface border-border'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-ink">
          <Sparkles size={16} className="text-primary" />
          <span>{isArabic ? 'رصيد المساعد الذكي اليومي' : 'Daily AI Assistant Quota'}</span>
        </div>
        <Badge
          variant="outline"
          size="sm"
          className="font-extrabold font-mono text-primary border border-border"
        >
          {dailyAiCredits} / 5
        </Badge>
      </div>
      <div className="text-xs text-ink-muted leading-relaxed">
        {isArabic
          ? `المحاولات الذكية المتبقية اليوم: ٥/${dailyAiCredits}`
          : `Remaining smart attempts today: 5/${dailyAiCredits}`}
      </div>
      {dailyAiCredits === 0 && (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleShare}
          className="gap-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white flex items-center justify-center py-2.5 rounded-xl cursor-pointer"
        >
          <Gift size={16} className="animate-bounce" />
          <span>
            {isArabic
              ? 'شارك التطبيق لفتح محاولات إضافية فوراً! 🎁'
              : 'Share the app to unlock extra attempts instantly! 🎁'}
          </span>
        </Button>
      )}
    </div>
  );
};
