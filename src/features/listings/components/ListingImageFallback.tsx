import React from 'react';

interface Props {
  readonly isArabic: boolean;
  readonly messageAr: string;
  readonly messageEn: string;
}

export const ListingImageFallback: React.FC<Props> = ({ isArabic, messageAr, messageEn }) => (
  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
    {isArabic ? messageAr : messageEn}
  </div>
);
