import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { pickSpecs } from '../helpers/pickSpecs';
import { ListingSpecsRow } from '@/shared/components/ListingSpecsRow';
import { formatPrice } from '@/shared/lib/formatPrice';
import { formatRelativeDate } from '@/shared/lib/formatDate';

export interface ListingMainInfoProps {
  title: string;
  price: string;
  currency: string;
  locationText: string;
  views?: number;
  createdAt?: string;
  isArabic: boolean;
  attributes?: Array<{ label: string; value: string; key?: string }>;
}

export const ListingMainInfo: React.FC<ListingMainInfoProps> = React.memo(({
  title,
  price,
  currency,
  locationText,
  createdAt,
  isArabic,
  attributes,
}) => {
  const specs = pickSpecs(attributes, 6, title);

  const formattedPrice = useMemo(() => {
    if (!price || price === '0' || Number(price) === 0) {
      return isArabic ? 'السعر غير محدد' : 'Price not specified';
    }
    return formatPrice(price, currency, isArabic);
  }, [price, currency, isArabic]);

  const relativeDate = useMemo(() => formatRelativeDate(createdAt, isArabic), [createdAt, isArabic]);

  const conditionVal = useMemo(() => {
    const c = attributes?.find(
      (a) => a.key === 'condition' || a.key === 'حالة' || a.label === 'الحالة' || a.label === 'Condition'
    );
    return c?.value || null;
  }, [attributes]);

  return (
    <div className="text-start">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-lg font-bold text-ink leading-snug text-start flex-1" dir="auto">{title}</h1>
        {conditionVal && (
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {conditionVal}
          </span>
        )}
      </div>

      <div className="price-tag text-2xl font-black text-danger mt-1.5 flex items-baseline gap-1.5 text-start">
        <span>{formattedPrice}</span>
      </div>

      <div className="flex items-center gap-2 text-xs mt-2.5 flex-wrap">
        <div className="flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/30">
          <Icon icon="noto:round-pushpin" width={13} height={13} className="shrink-0" />
          <span className="font-semibold text-ink" dir="auto">{locationText}</span>
        </div>
        {relativeDate && (
          <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-lg border border-border text-ink-muted font-medium">
            <Icon icon="lucide:clock" width={12} height={12} className="shrink-0" />
            <span>{relativeDate}</span>
          </div>
        )}
        {specs.length > 0 && <ListingSpecsRow specs={specs} />}
      </div>
    </div>
  );
});

ListingMainInfo.displayName = 'ListingMainInfo';
