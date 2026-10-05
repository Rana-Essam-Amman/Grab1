import React from 'react';
import { ArrowLeft, ArrowRight, Trash } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

interface WishlistHeaderProps {
  isArabic: boolean;
  goBack: () => void;
  totalCount: number;
  title: string;
  clearAllText: string;
  onClearClick: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({
  isArabic,
  goBack,
  totalCount,
  title,
  clearAllText,
  onClearClick,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
   <div className="p-3 bg-brand border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
     <div className="flex items-center gap-2 min-w-0">
       <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 shrink-0 p-0">
         <BackIcon size={18} variant="Linear" color="#FFFFFF" />
       </Button>
       <div className="min-w-0">
         <h1 className="text-base font-bold text-white flex items-center gap-1.5">
           <span>{title}</span>
           <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">{totalCount}</span>
         </h1>
         <p className="text-[11px] text-white/70 truncate">
           {isArabic ? 'الإعلانات التي قمت بحفظها للمراجعة لاحقاً' : 'Listings you saved to track and review'}
         </p>
       </div>
     </div>
     {totalCount > 0 && (
       <button onClick={onClearClick} className="flex items-center gap-1 text-xs text-white/80 hover:text-white cursor-pointer select-none">
         <Trash size={14} variant="Linear" color="#FFFFFF" />
         <span>{clearAllText}</span>
       </button>
     )}
   </div>
  );
};
