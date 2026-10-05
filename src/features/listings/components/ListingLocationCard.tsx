import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Location, Export } from 'iconsax-react';
import { googleMapsEmbedUrl } from '@/data/mapUrls';

export interface ListingLocationCardProps {
  mapQuery: string;
  locationText: string;
  mapUrl: string;
  isArabic: boolean;
}

export const ListingLocationCard: React.FC<ListingLocationCardProps> = React.memo(({ mapQuery, locationText, mapUrl, isArabic }) => (
  <Card variant="default" className="p-4 flex flex-col gap-2.5">
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
        {isArabic ? 'موقع السلعة الموثق' : 'Verified Map Location'}
      </h3>
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
      >
        <span>{isArabic ? 'فتح الخريطة' : 'Open Map'}</span>
        <Export size={12} variant="Linear" />
      </a>
    </div>

    <div className="w-full h-36 rounded-xl overflow-hidden bg-background border border-border">
      <iframe
        title="Listing Location"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={googleMapsEmbedUrl(mapQuery)}
        className="border-0"
      />
    </div>
    <div className="text-[11px] text-ink-muted font-medium flex items-center gap-1">
      <Location size={12} variant="Linear" color="currentColor" className="text-danger" />
      <span dir="auto">{locationText}</span>
    </div>
  </Card>
));

ListingLocationCard.displayName = 'ListingLocationCard';
