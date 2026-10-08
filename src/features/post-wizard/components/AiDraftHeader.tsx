import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ArrowRight, Magicpen } from 'iconsax-react';
import { Badge } from '@/shared/ui/Badge';

interface Props {
  isArabic: boolean;
  onBack: () => void;
}

export const AiDraftHeader: React.FC<Props> = ({ isArabic, onBack }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  return (
    <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-brand sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="w-10 h-10 rounded-full bg-surface/15 text-white hover:bg-surface/25 cursor-pointer flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="currentColor" className="text-white" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">{isArabic ? 'الخطوة 5 من 6' : 'Step 5 of 6'}</div>
          <h2 className="text-lg font-bold text-white">{isArabic ? 'صياغة الإعلان بالذكاء الاصطناعي' : 'AI Listing Assistant'}</h2>
        </div>
      </div>
      <Badge variant="outline" size="sm" className="bg-surface/10 text-white border-white/25 font-bold px-2.5 py-1">
        <Magicpen size={14} variant="Linear" color="currentColor" className="text-white" />
        <span>{isArabic ? 'المساعد الذكي' : 'AI Assistant'}</span>
      </Badge>
    </div>
  );
};
