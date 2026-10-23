import React from 'react';
import { Icon } from '@iconify/react';
import { iconFor } from '@/features/post-wizard/components/data/fluentIconMap';
import { labelToIconKey } from '@/features/listings';

interface SpecItem {
  readonly label: string;
  readonly value: string;
}

interface ListingSpecsRowProps {
  readonly specs: readonly SpecItem[];
  readonly compact?: boolean;
}

export const ListingSpecsRow: React.FC<ListingSpecsRowProps> = ({ specs, compact = false }) => {
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
            {s.value}
          </span>
        </span>
      ))}
    </div>
  );
};
