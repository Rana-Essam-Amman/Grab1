import React from 'react';

interface LocationItem {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
}

interface Props<T extends LocationItem> {
  readonly title: string;
  readonly items: readonly T[];
  readonly isArabic: boolean;
  readonly activeNeighborhood: string | null;
  readonly selectedSlug?: string | null;
  readonly onItemSelect: (item: T) => void;
}

const chipStyle = (isActive: boolean) =>
  `px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
    isActive
      ? 'bg-accent/15 border-accent text-accent'
      : 'bg-surface border-border text-ink hover:border-ink-muted'
  }`;

export function LocationFilterSection<T extends LocationItem>({
  title,
  items,
  isArabic,
  activeNeighborhood,
  selectedSlug,
  onItemSelect,
}: Props<T>) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-ink-muted">
        {title}
      </span>

      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive =
            activeNeighborhood === item.nameAr ||
            selectedSlug === item.slug;

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onItemSelect(item)}
              className={chipStyle(isActive)}
            >
              {isArabic ? item.nameAr : item.nameEn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
