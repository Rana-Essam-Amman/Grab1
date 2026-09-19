import React from 'react';
import { Location, Eye, Calendar1 } from 'iconsax-react';

export interface ListingMainInfoProps {
  title: string;
  price: string;
  currency: string;
  locationText: string;
  views: number;
  createdAt: string;
  isArabic: boolean;
}

export const ListingMainInfo: React.FC<ListingMainInfoProps> = React.memo(({
  title,
  price,
  currency,
  locationText,
  views,
  createdAt,
  isArabic,
}) => (
  <div className="text-start">
    <h1 className="text-lg font-bold text-ink leading-snug text-start" dir="auto">{title}</h1>
    <div className="price-tag text-2xl font-black text-danger mt-1.5 flex items-baseline gap-1.5 text-start">
      <span dir="ltr">
        <span>{price}</span>{' '}
        <span className="text-sm font-extrabold text-danger">{currency}</span>
      </span>
    </div>
    <div className="flex items-center gap-2.5 text-xs text-ink-muted mt-2.5 flex-wrap">
      <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
        <Location size={13} variant="Linear" color="#DC2626" className="text-danger" />
        <span className="font-semibold text-ink" dir="auto">{locationText}</span>
      </div>
      <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
        <Eye size={13} variant="Linear" />
        <span>{views} {isArabic ? 'مشاهدة' : 'views'}</span>
      </div>
      <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border">
        <Calendar1 size={13} variant="Linear" />
        <span>{createdAt}</span>
      </div>
    </div>
  </div>
));

ListingMainInfo.displayName = 'ListingMainInfo';
