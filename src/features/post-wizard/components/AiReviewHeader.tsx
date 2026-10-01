import React from 'react';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ArrowRight, MagicStar } from 'iconsax-react';
import { usePostWizard } from '../hooks/usePostWizard';

interface Props {
  isArabic: boolean;
  onBack: () => void;
}

export const AiReviewHeader: React.FC<Props> = ({ isArabic, onBack }) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const { postDraft } = usePostWizard();
  const draftTitle = postDraft.generated?.title || postDraft.title || '';

  // Parse source indicator from title
  let sourceBadge = null;
  if (draftTitle) {
    if (draftTitle.startsWith('🟢 AI')) {
      sourceBadge = (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
          🟢 AI Source
        </span>
      );
    } else if (draftTitle.startsWith('🟠 Local')) {
      sourceBadge = (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
          🟠 Local Fallback
        </span>
      );
    }
  }

  return (
    <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
      <Button variant="ghost" size="icon" onClick={onBack} className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0"><BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" /></Button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {sourceBadge || (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-bold">
              <MagicStar size={11} variant="Bold" color="#FFFFFF" />
              {isArabic ? 'AI' : 'AI'}
            </span>
          )}
          <h2 className="text-base font-bold text-white truncate">
            {isArabic ? 'مراجعة الإعلان' : 'Review Listing'}
          </h2>
        </div>
        <p className="text-[11px] text-white/70 truncate">
          {isArabic ? 'راجع التفاصيل وانشر' : 'Check details and publish'}
        </p>
      </div>
    </div>
  );
};
