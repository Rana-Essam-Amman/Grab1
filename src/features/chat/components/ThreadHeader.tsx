import React from 'react';
import { Call, ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';

interface ThreadHeaderProps {
  isArabic: boolean;
  goBack: () => void;
  handleViewListing: () => void;
  imageUrl: string;
  title: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  dialNumber?: string;
  readonly isTyping?: boolean;
  readonly isOtherOnline?: boolean;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({
  isArabic,
  goBack,
  handleViewListing,
  imageUrl,
  title,
  handleImageError,
  dialNumber,
  isTyping,
  isOtherOnline,
}) => {
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
   <div className="p-3 bg-brand border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
     <div className="flex items-center gap-2.5 min-w-0">
       <Button variant="ghost" size="icon" onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 shrink-0 p-0">
         <BackIcon size={18} variant="Linear" color="#FFFFFF" />
       </Button>
       <div onClick={handleViewListing} className="flex items-center gap-2 cursor-pointer min-w-0">
         <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/15 border border-white/20 shrink-0">
           <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={handleImageError} />
           {isOtherOnline && (
             <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-brand" />
           )}
         </div>
         <div className="min-w-0">
           <div className="text-xs font-bold text-white truncate">{title}</div>
           <div className="text-[11px] text-white/80 font-bold">
             {isTyping
               ? (isArabic ? 'يكتب الآن...' : 'typing...')
               : (isArabic ? 'عرض تفاصيل الإعلان ←' : 'View Listing →')}
           </div>
         </div>
       </div>
     </div>
     {dialNumber && (
       <a href={`tel:${dialNumber}`} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors" title={isArabic ? 'اتصال بالبائع' : 'Call Seller'}>
         <Call size={18} variant="Linear" color="#FFFFFF" />
       </a>
     )}
   </div>
  );
};
