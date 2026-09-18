import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
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
        <Button variant="ghost" size="icon" onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0">
          <BackIcon size={18} className="text-white" />
        </Button>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">{isArabic ? 'الخطوة 5 من 6' : 'Step 5 of 6'}</div>
          <h2 className="text-lg font-bold text-white">{isArabic ? 'صياغة الإعلان بالذكاء الاصطناعي' : 'AI Listing Assistant'}</h2>
        </div>
      </div>
      <Badge variant="outline" size="sm" className="bg-white/10 text-white border-white/25 font-bold px-2.5 py-1">
        <Sparkles size={14} className="text-white" />
        <span>{isArabic ? 'المساعد الذكي' : 'AI Assistant'}</span>
      </Badge>
    </div>
  );
};
