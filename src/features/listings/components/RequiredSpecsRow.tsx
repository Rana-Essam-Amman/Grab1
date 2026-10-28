import { useMemo } from 'react';
import { Icon } from '@iconify/react';
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

const getSpecIcon = (key: string, label: string): string => {
  const k = key.toLowerCase();
  const l = label.toLowerCase();
  
  if (k.includes('bedroom') || k.includes('room') || l.includes('غرف') || l.includes('نوم')) return 'lucide:bed';
  if (k.includes('bath') || l.includes('حمام')) return 'lucide:bath';
  if (k.includes('area') || l.includes('مساحة') || l.includes('م²')) return 'lucide:maximize';
  if (k.includes('year') || l.includes('سنة') || l.includes('عام')) return 'lucide:calendar';
  if (k.includes('km') || l.includes('كم') || l.includes('ممشى')) return 'lucide:gauge';
  
  return 'lucide:tag'; // Default fallback icon
};

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
        
        let formattedValue = raw;
        
        if (f.key === 'make') {
          formattedValue = getMakeLabel(raw, isArabic);
        } else if (f.key === 'model') {
          formattedValue = makeValue ? getModelLabel(makeValue, raw, isArabic) : raw;
        } else if (f.type === 'select' && f.options) {
          const opt = f.options.find(
            (o) => o.value === raw || o.labelAr === raw || o.labelEn === raw
          );
          formattedValue = opt ? (isArabic ? opt.labelAr : opt.labelEn) : raw;
        } else if (f.type === 'number' || f.key === 'km' || f.key === 'mileage' || f.key === 'area') {
          if (f.key !== 'year') {
            const formattedNum = formatNumberValue(raw);
            if (f.key === 'area') {
              formattedValue = `${formattedNum}${isArabic ? ' م²' : ' m²'}`;
            } else if (f.key === 'km' || f.key === 'mileage') {
              formattedValue = `${formattedNum}${isArabic ? ' كم' : ' KM'}`;
            } else if (f.key === 'bedrooms' || f.key === 'rooms' || f.key === 'beds' || f.key === 'غرف') {
              formattedValue = `${formattedNum}${isArabic ? ' غرف' : ' Beds'}`;
            } else if (f.key === 'bathrooms' || f.key === 'baths' || f.key === 'حمام') {
              formattedValue = `${formattedNum}${isArabic ? ' حمام' : ' Baths'}`;
            } else {
              formattedValue = formattedNum;
            }
          }
        }
        
        return { key: f.key, value: formattedValue };
      })
      .filter((v): v is { key: string; value: string } => Boolean(v));
  }, [categorySlug, subcategorySlug, attributes, isArabic]);

  if (items.length === 0) return null;

  return (
    <div
      className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] font-semibold text-ink-soft mt-1.5 mb-2"
      dir="auto"
      data-testid="required-specs-row"
    >
      {items.map((item, idx) => (
        <div key={`${item.key}-${idx}`} className="flex items-center gap-1.5 shrink-0">
          <Icon icon={getSpecIcon(item.key, item.value)} width={15} height={15} className="text-ink-muted shrink-0" />
          <span className="truncate max-w-[150px]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
