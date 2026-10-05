import React from 'react';
import { Icon } from '@iconify/react';
import { pickSpecs } from '../helpers/pickSpecs';
import { ListingSpecsRow } from '@/shared/components/ListingSpecsRow';

export interface ListingMainInfoProps {
  title: string;
  price: string;
  currency: string;
  locationText: string;
  views?: number;
  createdAt?: string;
  isArabic: boolean;
  attributes?: Array<{ label: string; value: string }>;
}

export const ListingMainInfo: React.FC<ListingMainInfoProps> = React.memo(({
  title,
  price,
  currency,
  locationText,
  attributes,
}) => {
  const specs = pickSpecs(attributes, 6, title);

  return (
    <div className="text-start">
      <h1 className="text-lg font-bold text-ink leading-snug text-start" dir="auto">{title}</h1>
      <div className="price-tag text-2xl font-black text-danger mt-1.5 flex items-baseline gap-1.5 text-start">
        <span dir="ltr">
          <span>{price}</span>{' '}
          <span className="text-sm font-extrabold text-danger">{currency}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs mt-2.5 flex-wrap">
        <div className="flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/30">
          <Icon icon="noto:round-pushpin" width={13} height={13} className="shrink-0" />
          <span className="font-semibold text-ink" dir="auto">{locationText}</span>
        </div>
        {specs.length > 0 && <ListingSpecsRow specs={specs} />}
      </div>
    </div>
  );
});

ListingMainInfo.displayName = 'ListingMainInfo';
