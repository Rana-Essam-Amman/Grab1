import React from 'react';
import { Icon } from '@iconify/react';
import { iconFor } from '@/features/post-wizard/components/data/fluentIconMap';
import { labelToIconKey } from '@/features/listings';

interface SpecItem {
  readonly label: string;
  readonly value: string;
  readonly key?: string;
}

interface ListingSpecsRowProps {
  readonly specs: readonly SpecItem[];
  readonly compact?: boolean;
  readonly isArabic?: boolean;
}

const formatValue = (spec: SpecItem, isArabic: boolean): string => {
  const { key, label, value } = spec;
  const raw = value.trim();
  if (!raw) return value;

  const keyLower = key?.toLowerCase() ?? '';
  const labelLower = label.toLowerCase();

  // If year key or label, leave raw value without comma formatting
  if (keyLower === 'year' || /year|سنة|عام/i.test(labelLower)) {
    return raw;
  }

  // Check if value already has units or non-digit chars (e.g. "50,000 كم" or "100 m²")
  if (/[a-zA-Zء-ي²%]/.test(raw)) {
    return raw;
  }

  const num = Number(raw);
  if (isNaN(num)) {
    return raw;
  }

  const formatted = new Intl.NumberFormat('en-US').format(num);

  if (keyLower === 'km' || keyLower === 'mileage' || /km|ممشى|ماشي|mileage|قطعت|كيلومترات/i.test(labelLower)) {
    return `${formatted}${isArabic ? ' كم' : ' KM'}`;
  }

  if (keyLower === 'area' || /area|مساحة|م²/i.test(labelLower)) {
    return `${formatted}${isArabic ? ' م²' : ' m²'}`;
  }

  return formatted;
};

export const ListingSpecsRow: React.FC<ListingSpecsRowProps> = ({ specs, compact = false, isArabic = true }) => {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
      {specs.map((s, i) => (
        <span
          key={`${s.label}-${i}`}
          className={`inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 truncate ${
            compact ? 'px-1.5 py-0.5' : 'px-2 py-1'
          }`}
        >
          <Icon
            icon={iconFor(labelToIconKey(s.label))}
            width={compact ? 11 : 13}
            height={compact ? 11 : 13}
            className="shrink-0"
          />
          <span
            className={`font-bold text-ink truncate ${
              compact ? 'text-[10px] max-w-[70px]' : 'text-[11px] max-w-[100px]'
            }`}
          >
            {formatValue(s, isArabic)}
          </span>
        </span>
      ))}
    </div>
  );
};
