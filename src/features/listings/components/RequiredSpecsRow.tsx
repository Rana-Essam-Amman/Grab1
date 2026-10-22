import { useMemo } from 'react';
import { getListingFields } from '@/data/listingFields';
import { getMakeLabel, getModelLabel } from '@/data/brands';

interface Props {
  readonly categorySlug: string;
  readonly subcategorySlug?: string | null;
  readonly attributes: readonly { key: string; value: string; label?: string }[];
  readonly isArabic: boolean;
}

const formatNumberValue = (v: string): string => {
  const num = Number(v);
  return !isNaN(num) ? new Intl.NumberFormat('en-US').format(num) : v;
};

/**
 * Renders ALL required attributes for the listing's category, translated to
 * display labels. Used on ListingCard so buyers see mandatory specs at a glance.
 * Works for every category (motors, real-estate, mobiles, etc.) — automatic.
 */
export function RequiredSpecsRow({ categorySlug, subcategorySlug, attributes, isArabic }: Props) {
  const items = useMemo(() => {
    const fields = getListingFields(categorySlug, subcategorySlug ?? undefined);
    const makeValue = attributes.find((a) => a.key === 'make')?.value ?? '';
    return fields
      .filter((f) => f.required)
      .map((f) => {
        const attr = attributes.find((a) => a.key === f.key);
        const raw = attr?.value?.trim();
        if (!raw) return null;
        if (f.key === 'make') return getMakeLabel(raw, isArabic);
        if (f.key === 'model') return makeValue ? getModelLabel(makeValue, raw, isArabic) : raw;
        if (f.type === 'select' && f.options) {
          const opt = f.options.find(
            (o) => o.value === raw || o.labelAr === raw || o.labelEn === raw
          );
          return opt ? (isArabic ? opt.labelAr : opt.labelEn) : raw;
        }
        if (f.type === 'number' || f.key === 'km' || f.key === 'mileage' || f.key === 'area') {
          if (f.key === 'year') return raw;
          const formatted = formatNumberValue(raw);
          if (f.key === 'area') return `${formatted}${isArabic ? ' م²' : ' m²'}`;
          if (f.key === 'km' || f.key === 'mileage') return `${formatted}${isArabic ? ' كم' : ' KM'}`;
          return formatted;
        }
        return raw;
      })
      .filter((v): v is string => Boolean(v));
  }, [categorySlug, subcategorySlug, attributes, isArabic]);

  if (items.length === 0) return null;

  return (
    <div
      className="flex items-center flex-wrap gap-x-1 gap-y-0.5 text-[12px] font-bold text-ink mt-1 mb-1"
      dir="auto"
      data-testid="required-specs-row"
    >
      {items.map((item, idx) => (
        <span key={`${item}-${idx}`} className="flex items-center gap-1">
          <span className="truncate max-w-[200px]">{item}</span>
          {idx < items.length - 1 && <span className="text-ink-muted">·</span>}
        </span>
      ))}
    </div>
  );
}
