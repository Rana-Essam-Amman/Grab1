import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  isArabic: boolean;
  onBack: () => void;
}

export const AiReviewHeader: React.FC<Props> = ({ isArabic, onBack }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  return (
    <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
      <Button variant="ghost" size="icon" onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"><BackIcon size={18} className="text-white" /></Button>
      <div>
        <div className="text-xs font-semibold text-white/70">{isArabic ? 'الخطوة 6 من 6' : 'Step 6 of 6'}</div>
        <h2 className="text-lg font-bold text-white">{isArabic ? 'مراجعة وتأكيد الإعلان' : 'Review & Confirm'}</h2>
      </div>
    </div>
  );
};
